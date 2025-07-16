/**
 * Express.js Integration Example for SMEDREC Audit SDK
 *
 * This example demonstrates how to integrate the audit SDK with an Express.js
 * application for automatic request/response logging and manual event logging.
 */

import express from 'express'

import { AuditSDK, createAuditMiddleware } from '@repo/audit-sdk'

import type { Request, Response } from 'express'

// Initialize the audit SDK
const auditSDK = new AuditSDK({
	queueName: 'express-api-audit',
	redis: {
		url: process.env.REDIS_URL || 'redis://localhost:6379',
	},
	databaseUrl: process.env.AUDIT_DB_URL,
	defaults: {
		dataClassification: 'INTERNAL',
		generateHash: true,
	},
	compliance: {
		hipaa: {
			enabled: true,
			retentionYears: 6,
		},
	},
})

// Create Express app
const app = express()

// Middleware setup
app.use(express.json())

// Add audit middleware with custom configuration
app.use(
	createAuditMiddleware(auditSDK, {
		// Skip health check endpoints
		skip: (req) => req.path.startsWith('/health') || req.path.startsWith('/metrics'),

		// Enrich events with custom data
		enrich: (req, res, event) => ({
			...event,
			apiVersion: 'v1',
			requestId: req.headers['x-request-id'] as string,
			organizationId: (req as any).user?.organizationId,
		}),

		// Handle audit errors gracefully
		onError: (error, req, res) => {
			console.error('Audit middleware error:', error)
			// Could send to error tracking service here
		},

		// Performance settings
		performance: {
			sampleRate: 1.0, // Log all requests in this example
			maxLatency: 10000, // Skip requests that take longer than 10 seconds
		},
	})
)

// Mock authentication middleware
app.use((req: Request, res: Response, next) => {
	// In a real app, this would validate JWT tokens, API keys, etc.
	const authHeader = req.headers.authorization
	if (authHeader && authHeader.startsWith('Bearer ')) {
		// Mock user data
		;(req as any).user = {
			id: 'practitioner-12345',
			organizationId: 'hospital-001',
			roles: ['doctor', 'attending_physician'],
			name: 'Dr. Jane Smith',
		}
	}
	next()
})

/**
 * Health check endpoint (not audited due to skip configuration)
 */
app.get('/health', (req: Request, res: Response) => {
	res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

/**
 * Authentication endpoints with manual audit logging
 */
app.post('/auth/login', async (req: Request, res: Response) => {
	const { username, password } = req.body

	// Mock authentication logic
	const isValidCredentials = username === 'doctor' && password === 'secure123'

	if (isValidCredentials) {
		// Manual audit logging for successful login
		await auditSDK.logAuth({
			principalId: 'practitioner-12345',
			action: 'login',
			status: 'success',
			sessionContext: {
				sessionId: 'sess-' + Math.random().toString(36).substr(2, 9),
				ipAddress: req.ip || 'unknown',
				userAgent: req.get('User-Agent') || 'unknown',
			},
		})

		res.json({
			success: true,
			token: 'mock-jwt-token',
			user: { id: 'practitioner-12345', name: 'Dr. Jane Smith' },
		})
	} else {
		// Manual audit logging for failed login
		await auditSDK.logAuth({
			principalId: username, // Use attempted username
			action: 'login',
			status: 'failure',
			reason: 'Invalid credentials provided',
			sessionContext: {
				sessionId: 'failed-' + Math.random().toString(36).substr(2, 9),
				ipAddress: req.ip || 'unknown',
				userAgent: req.get('User-Agent') || 'unknown',
			},
		})

		res.status(401).json({ success: false, message: 'Invalid credentials' })
	}
})

app.post('/auth/logout', async (req: Request, res: Response) => {
	const user = (req as any).user

	if (user) {
		await auditSDK.logAuth({
			principalId: user.id,
			action: 'logout',
			status: 'success',
			sessionContext: {
				sessionId: (req.headers['x-session-id'] as string) || 'unknown',
				ipAddress: req.ip || 'unknown',
				userAgent: req.get('User-Agent') || 'unknown',
			},
		})
	}

	res.json({ success: true, message: 'Logged out successfully' })
})

/**
 * FHIR API endpoints with automatic and manual audit logging
 */
app.get('/fhir/Patient/:id', async (req: Request, res: Response) => {
	const patientId = req.params.id
	const user = (req as any).user

	if (!user) {
		return res.status(401).json({ error: 'Authentication required' })
	}

	// Mock patient data retrieval
	const patientData = {
		resourceType: 'Patient',
		id: patientId,
		name: [{ family: 'Doe', given: ['John'] }],
		birthDate: '1980-01-01',
	}

	// Manual FHIR audit logging (in addition to automatic middleware logging)
	await auditSDK.logFHIR({
		principalId: user.id,
		organizationId: user.organizationId,
		action: 'read',
		resourceType: 'Patient',
		resourceId: patientId,
		status: 'success',
		outcomeDescription: `Practitioner ${user.name} accessed patient record`,
		sessionContext: {
			sessionId: (req.headers['x-session-id'] as string) || 'unknown',
			ipAddress: req.ip || 'unknown',
			userAgent: req.get('User-Agent') || 'unknown',
		},
		fhirContext: {
			version: 'R4',
			interaction: 'read',
			compartment: `Patient/${patientId}`,
		},
	})

	res.json(patientData)
})

app.post('/fhir/Patient', async (req: Request, res: Response) => {
	const user = (req as any).user

	if (!user) {
		return res.status(401).json({ error: 'Authentication required' })
	}

	// Mock patient creation
	const newPatientId = 'patient-' + Math.random().toString(36).substr(2, 9)
	const patientData = {
		resourceType: 'Patient',
		id: newPatientId,
		...req.body,
	}

	// Manual FHIR audit logging
	await auditSDK.logFHIR({
		principalId: user.id,
		organizationId: user.organizationId,
		action: 'create',
		resourceType: 'Patient',
		resourceId: newPatientId,
		status: 'success',
		outcomeDescription: `New patient record created by ${user.name}`,
		sessionContext: {
			sessionId: (req.headers['x-session-id'] as string) || 'unknown',
			ipAddress: req.ip || 'unknown',
			userAgent: req.get('User-Agent') || 'unknown',
		},
		fhirContext: {
			version: 'R4',
			interaction: 'create',
		},
	})

	res.status(201).json(patientData)
})

app.put('/fhir/Patient/:id', async (req: Request, res: Response) => {
	const patientId = req.params.id
	const user = (req as any).user

	if (!user) {
		return res.status(401).json({ error: 'Authentication required' })
	}

	// Mock patient update with change tracking
	const oldData = { name: [{ family: 'Smith', given: ['Jane'] }] }
	const newData = req.body

	await auditSDK.logData({
		principalId: user.id,
		action: 'update',
		resourceType: 'Patient',
		resourceId: patientId,
		status: 'success',
		dataClassification: 'PHI',
		outcomeDescription: `Patient record updated by ${user.name}`,
		changes: {
			oldValue: oldData,
			newValue: newData,
			modifiedFields: Object.keys(newData),
		},
	})

	res.json({ resourceType: 'Patient', id: patientId, ...newData })
})

/**
 * Administrative endpoints
 */
app.get('/admin/audit-health', async (req: Request, res: Response) => {
	const user = (req as any).user

	if (!user || !user.roles.includes('admin')) {
		return res.status(403).json({ error: 'Admin access required' })
	}

	const health = await auditSDK.getHealth()

	// Log admin access to audit system health
	await auditSDK.log(
		{
			principalId: user.id,
			action: 'admin.audit.health.check',
			status: 'success',
			outcomeDescription: 'Admin checked audit system health',
			dataClassification: 'CONFIDENTIAL',
			adminContext: {
				adminName: user.name,
				healthStatus: health,
			},
		},
		{
			preset: 'admin',
		}
	)

	res.json(health)
})

/**
 * Data export endpoint with compliance logging
 */
app.post('/admin/export-audit-data', async (req: Request, res: Response) => {
	const user = (req as any).user
	const { startDate, endDate, format } = req.body

	if (!user || !user.roles.includes('admin')) {
		return res.status(403).json({ error: 'Admin access required' })
	}

	// Log the data export request
	await auditSDK.logCritical(
		{
			principalId: user.id,
			action: 'data.export.audit_logs',
			status: 'success',
			outcomeDescription: `Admin ${user.name} exported audit data`,
			dataClassification: 'CONFIDENTIAL',
			exportContext: {
				dateRange: { startDate, endDate },
				format,
				requestedBy: user.name,
				organizationId: user.organizationId,
			},
		},
		{
			priority: 1,
			compliance: ['hipaa', 'gdpr'],
		}
	)

	// Mock export data
	const exportData = {
		exportId: 'export-' + Date.now(),
		status: 'completed',
		recordCount: 1500,
		downloadUrl: '/downloads/audit-export-' + Date.now() + '.' + format,
	}

	res.json(exportData)
})

/**
 * Error handling middleware
 */
app.use((error: Error, req: Request, res: Response, next: any) => {
	console.error('Application error:', error)

	// Log application errors
	auditSDK
		.logSystem({
			action: 'application.error',
			status: 'failure',
			component: 'express-api',
			outcomeDescription: `Application error: ${error.message}`,
			systemContext: {
				errorStack: error.stack,
				requestPath: req.path,
				requestMethod: req.method,
				userId: (req as any).user?.id,
			},
		})
		.catch((auditError) => {
			console.error('Failed to log application error:', auditError)
		})

	res.status(500).json({ error: 'Internal server error' })
})

/**
 * Graceful shutdown handling
 */
process.on('SIGTERM', async () => {
	console.log('Received SIGTERM, shutting down gracefully...')

	await auditSDK.logSystem({
		action: 'shutdown',
		status: 'success',
		component: 'express-api',
		outcomeDescription: 'Express API server shutting down gracefully',
	})

	await auditSDK.close()
	process.exit(0)
})

process.on('SIGINT', async () => {
	console.log('Received SIGINT, shutting down gracefully...')

	await auditSDK.logSystem({
		action: 'shutdown',
		status: 'success',
		component: 'express-api',
		outcomeDescription: 'Express API server shutting down gracefully',
	})

	await auditSDK.close()
	process.exit(0)
})

/**
 * Start the server
 */
const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
	console.log(`🚀 Express server running on port ${PORT}`)

	// Log server startup
	await auditSDK.logSystem({
		action: 'startup',
		status: 'success',
		component: 'express-api',
		outcomeDescription: `Express API server started on port ${PORT}`,
		systemContext: {
			port: PORT,
			nodeVersion: process.version,
			environment: process.env.NODE_ENV || 'development',
		},
	})
})

export { app, auditSDK }
