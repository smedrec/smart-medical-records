import { testClient } from 'hono/testing'
import { describe, expect, it } from 'vitest'

import licenseVerificationRoutes from './license-verification.js'

describe('License Verification API', () => {
	const client = testClient(licenseVerificationRoutes)

	describe('POST /verify', () => {
		it('should verify a license successfully', async () => {
			const licenseData = {
				licenseNumber: 'MD123456',
				jurisdiction: 'US-CA',
				practitionerName: 'Dr. John Smith',
				licenseType: 'Medical Doctor',
				expiryDate: '2025-12-31T00:00:00.000Z',
			}

			const response = await client.verify.$post({
				json: licenseData,
			})

			expect(response.status).toBe(200)

			const result = await response.json()
			expect(result.status).toBeOneOf(['verified', 'manual_review'])
			expect(result.timestamp).toBeDefined()
			expect(result.details).toBeDefined()
		})

		it('should handle invalid license data', async () => {
			const invalidData = {
				licenseNumber: '',
				jurisdiction: 'US-CA',
				practitionerName: 'Dr. John Smith',
				licenseType: 'Medical Doctor',
			}

			const response = await client.verify.$post({
				json: invalidData,
			})

			expect(response.status).toBe(400)
		})
	})

	describe('POST /verify/bulk', () => {
		it('should verify multiple licenses', async () => {
			const bulkData = {
				licenses: [
					{
						licenseNumber: 'MD123456',
						jurisdiction: 'US-CA',
						practitionerName: 'Dr. John Smith',
						licenseType: 'Medical Doctor',
					},
					{
						licenseNumber: 'MD789012',
						jurisdiction: 'US-TX',
						practitionerName: 'Dr. Jane Doe',
						licenseType: 'Medical Doctor',
					},
				],
			}

			const response = await client.verify.bulk.$post({
				json: bulkData,
			})

			expect(response.status).toBe(200)

			const result = await response.json()
			expect(result.results).toHaveLength(2)
			expect(result.results[0].timestamp).toBeDefined()
			expect(result.results[1].timestamp).toBeDefined()
		})

		it('should reject too many licenses', async () => {
			const tooManyLicenses = {
				licenses: Array(51).fill({
					licenseNumber: 'MD123456',
					jurisdiction: 'US-CA',
					practitionerName: 'Dr. John Smith',
					licenseType: 'Medical Doctor',
				}),
			}

			const response = await client.verify.bulk.$post({
				json: tooManyLicenses,
			})

			expect(response.status).toBe(400)
		})
	})

	describe('GET /status/:licenseNumber/:jurisdiction', () => {
		it('should get license status for supported jurisdiction', async () => {
			const response = await client.status[':licenseNumber'][':jurisdiction'].$get({
				param: {
					licenseNumber: 'MD123456',
					jurisdiction: 'US-CA',
				},
			})

			expect(response.status).toBe(200)

			const result = await response.json()
			expect(result.isValid).toBeDefined()
			expect(result.isActive).toBeDefined()
			expect(result.lastUpdated).toBeDefined()
		})

		it('should return 404 for unsupported jurisdiction', async () => {
			const response = await client.status[':licenseNumber'][':jurisdiction'].$get({
				param: {
					licenseNumber: 'XYZ123',
					jurisdiction: 'UNSUPPORTED',
				},
			})

			expect(response.status).toBe(404)
		})
	})

	describe('GET /jurisdictions', () => {
		it('should return supported jurisdictions', async () => {
			const response = await client.jurisdictions.$get()

			expect(response.status).toBe(200)

			const result = await response.json()
			expect(result.jurisdictions).toBeInstanceOf(Array)
			expect(result.jurisdictions.length).toBeGreaterThan(0)
			expect(result.jurisdictions).toContain('US-CA')
		})
	})
})
