import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'

import { LicenseVerificationService } from '../lib/license-verification/index.js'

import type { LicenseInfo } from '../lib/license-verification/index.js'

const app = new OpenAPIHono()

// Initialize the service
const licenseService = new LicenseVerificationService()

// Schema definitions
const LicenseInfoSchema = z.object({
	licenseNumber: z.string().min(1).describe('License number to verify'),
	jurisdiction: z.string().min(1).describe('Jurisdiction code (e.g., US-CA, GB, CA-ON)'),
	practitionerName: z.string().min(1).describe('Full name of the practitioner'),
	licenseType: z.string().min(1).describe('Type of license (e.g., Medical Doctor, Nurse)'),
	expiryDate: z.string().datetime().optional().describe('License expiry date in ISO format'),
})

const VerificationResultSchema = z.object({
	status: z
		.enum(['verified', 'failed', 'pending', 'manual_review'])
		.describe('Verification status'),
	details: z
		.object({
			apiResponse: z.any().optional(),
			matchScore: z.number().optional(),
			discrepancies: z.array(z.string()).optional(),
			provider: z.string().optional(),
			confidence: z.number().optional(),
		})
		.describe('Verification details'),
	timestamp: z.string().datetime().describe('Verification timestamp'),
})

const LicenseStatusSchema = z.object({
	isValid: z.boolean().describe('Whether the license is valid'),
	isActive: z.boolean().describe('Whether the license is currently active'),
	expiryDate: z.string().datetime().optional().describe('License expiry date'),
	practitionerName: z.string().optional().describe('Practitioner name from registry'),
	licenseType: z.string().optional().describe('Type of license'),
	specialties: z.array(z.string()).optional().describe('Medical specialties'),
	lastUpdated: z.string().datetime().describe('Last update timestamp'),
})

// Single license verification route
const verifyLicenseRoute = createRoute({
	method: 'post',
	path: '/verify',
	tags: ['License Verification'],
	summary: 'Verify a single license',
	description: 'Verify a practitioner license against official registries',
	request: {
		body: {
			content: {
				'application/json': {
					schema: LicenseInfoSchema,
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: VerificationResultSchema,
				},
			},
			description: 'License verification result',
		},
		400: {
			content: {
				'application/json': {
					schema: z.object({
						error: z.string(),
						code: z.string(),
					}),
				},
			},
			description: 'Bad request',
		},
		500: {
			content: {
				'application/json': {
					schema: z.object({
						error: z.string(),
						code: z.string(),
					}),
				},
			},
			description: 'Internal server error',
		},
	},
})

app.openapi(verifyLicenseRoute, async (c) => {
	try {
		const licenseInfo = c.req.valid('json')

		// Convert string date to Date object if provided
		const processedLicenseInfo: LicenseInfo = {
			...licenseInfo,
			expiryDate: licenseInfo.expiryDate ? new Date(licenseInfo.expiryDate) : undefined,
		}

		const result = await licenseService.verifyLicense(processedLicenseInfo)

		// Convert Date objects to ISO strings for JSON response
		const response = {
			...result,
			timestamp: result.timestamp.toISOString(),
		}

		return c.json(response, 200)
	} catch (error: any) {
		console.error('License verification error:', error)

		return c.json(
			{
				error: error.message || 'License verification failed',
				code: error.code || 'VERIFICATION_ERROR',
			},
			500
		)
	}
})

// Bulk license verification route
const bulkVerifyRoute = createRoute({
	method: 'post',
	path: '/verify/bulk',
	tags: ['License Verification'],
	summary: 'Verify multiple licenses',
	description: 'Verify multiple practitioner licenses in a single request',
	request: {
		body: {
			content: {
				'application/json': {
					schema: z.object({
						licenses: z
							.array(LicenseInfoSchema)
							.min(1)
							.max(50)
							.describe('Array of licenses to verify (max 50)'),
					}),
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: z.object({
						results: z.array(VerificationResultSchema),
					}),
				},
			},
			description: 'Bulk verification results',
		},
		400: {
			content: {
				'application/json': {
					schema: z.object({
						error: z.string(),
						code: z.string(),
					}),
				},
			},
			description: 'Bad request',
		},
		500: {
			content: {
				'application/json': {
					schema: z.object({
						error: z.string(),
						code: z.string(),
					}),
				},
			},
			description: 'Internal server error',
		},
	},
})

app.openapi(bulkVerifyRoute, async (c) => {
	try {
		const { licenses } = c.req.valid('json')

		// Convert string dates to Date objects
		const processedLicenses: LicenseInfo[] = licenses.map((license: any) => ({
			...license,
			expiryDate: license.expiryDate ? new Date(license.expiryDate) : undefined,
		}))

		const results = await licenseService.bulkVerify(processedLicenses)

		// Convert Date objects to ISO strings
		const response = {
			results: results.map((result) => ({
				...result,
				timestamp: result.timestamp.toISOString(),
			})),
		}

		return c.json(response, 200)
	} catch (error: any) {
		console.error('Bulk verification error:', error)

		return c.json(
			{
				error: error.message || 'Bulk verification failed',
				code: error.code || 'BULK_VERIFICATION_ERROR',
			},
			500
		)
	}
})

// License status check route
const licenseStatusRoute = createRoute({
	method: 'get',
	path: '/status/{licenseNumber}/{jurisdiction}',
	tags: ['License Verification'],
	summary: 'Get license status',
	description: 'Get current status of a license from official registry',
	request: {
		params: z.object({
			licenseNumber: z.string().min(1).describe('License number'),
			jurisdiction: z.string().min(1).describe('Jurisdiction code'),
		}),
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: LicenseStatusSchema.nullable(),
				},
			},
			description: 'License status information',
		},
		404: {
			content: {
				'application/json': {
					schema: z.object({
						error: z.string(),
						code: z.string(),
					}),
				},
			},
			description: 'License not found or jurisdiction not supported',
		},
		500: {
			content: {
				'application/json': {
					schema: z.object({
						error: z.string(),
						code: z.string(),
					}),
				},
			},
			description: 'Internal server error',
		},
	},
})

app.openapi(licenseStatusRoute, async (c) => {
	try {
		const { licenseNumber, jurisdiction } = c.req.valid('param')

		const status = await licenseService.getLicenseStatus(licenseNumber, jurisdiction)

		if (!status) {
			return c.json(
				{
					error: 'License not found or jurisdiction not supported',
					code: 'LICENSE_NOT_FOUND',
				},
				404
			)
		}

		// Convert Date objects to ISO strings
		const response = {
			...status,
			expiryDate: status.expiryDate?.toISOString(),
			lastUpdated: status.lastUpdated.toISOString(),
		}

		return c.json(response, 200)
	} catch (error: any) {
		console.error('License status error:', error)

		return c.json(
			{
				error: error.message || 'Failed to get license status',
				code: error.code || 'STATUS_ERROR',
			},
			500
		)
	}
})

// Supported jurisdictions route
const jurisdictionsRoute = createRoute({
	method: 'get',
	path: '/jurisdictions',
	tags: ['License Verification'],
	summary: 'Get supported jurisdictions',
	description: 'Get list of supported jurisdictions for license verification',
	responses: {
		200: {
			content: {
				'application/json': {
					schema: z.object({
						jurisdictions: z.array(z.string()).describe('List of supported jurisdiction codes'),
					}),
				},
			},
			description: 'Supported jurisdictions',
		},
		500: {
			content: {
				'application/json': {
					schema: z.object({
						error: z.string(),
						code: z.string(),
					}),
				},
			},
			description: 'Internal server error',
		},
	},
})

app.openapi(jurisdictionsRoute, async (c) => {
	try {
		// This would typically come from the provider manager
		const jurisdictions = [
			'US',
			'US-CA',
			'US-TX',
			'US-FL',
			'US-NY',
			'US-IL',
			'GB',
			'UK',
			'CA-ON',
			'CA-BC',
			'CA-AB',
		]

		return c.json({ jurisdictions }, 200)
	} catch (error: any) {
		console.error('Jurisdictions error:', error)

		return c.json(
			{
				error: 'Failed to get jurisdictions',
				code: 'JURISDICTIONS_ERROR',
			},
			500
		)
	}
})

export default app
