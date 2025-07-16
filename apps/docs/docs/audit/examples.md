# Examples

Practical examples of using the SMEDREC Audit System in various scenarios.

## Basic Usage Examples

### Simple User Action Logging

```typescript
import { Audit } from '@repo/audit'

const auditService = new Audit('user-activity-queue')

// Log user login
await auditService.log({
	principalId: 'user-123',
	action: 'auth.login.success',
	status: 'success',
	outcomeDescription: 'User successfully logged in',
	sessionContext: {
		sessionId: 'sess-abc123',
		ipAddress: '192.168.1.100',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
	},
})

// Log user logout
await auditService.log({
	principalId: 'user-123',
	action: 'auth.logout',
	status: 'success',
	outcomeDescription: 'User logged out successfully',
})
```

### FHIR Resource Access Logging

```typescript
// Patient record access
await auditService.log({
	principalId: 'practitioner-456',
	organizationId: 'org-hospital-1',
	action: 'fhir.patient.read',
	targetResourceType: 'Patient',
	targetResourceId: 'patient-789',
	status: 'success',
	outcomeDescription: 'Practitioner accessed patient record for treatment',
	dataClassification: 'PHI',
	sessionContext: {
		sessionId: 'sess-def456',
		ipAddress: '10.0.1.50',
		userAgent: 'FHIR-Client/1.0',
	},
	// Additional FHIR-specific context
	fhirContext: {
		resourceVersion: '1',
		compartment: 'Patient/patient-789',
		interaction: 'read',
	},
})

// Failed access attempt
await auditService.log({
	principalId: 'practitioner-999',
	action: 'fhir.patient.read',
	targetResourceType: 'Patient',
	targetResourceId: 'patient-789',
	status: 'failure',
	outcomeDescription: 'Access denied - insufficient permissions',
	dataClassification: 'PHI',
	errorDetails: {
		errorCode: 'INSUFFICIENT_PERMISSIONS',
		cerbosDecision: 'DENY',
		requiredRole: 'attending_physician',
	},
})
```

## Advanced Usage Examples

### High-Security Audit Events

```typescript
// Critical system changes with full security
await auditService.logWithGuaranteedDelivery(
	{
		principalId: 'admin-001',
		action: 'system.configuration.change',
		targetResourceType: 'SystemConfig',
		targetResourceId: 'security-policy',
		status: 'success',
		outcomeDescription: 'Updated system security policy',
		dataClassification: 'CONFIDENTIAL',
		changes: {
			oldValue: { maxLoginAttempts: 3 },
			newValue: { maxLoginAttempts: 5 },
		},
	},
	{
		priority: 1, // Highest priority
		durabilityGuarantees: true,
		generateHash: true,
		generateSignature: true,
		correlationId: 'config-change-2024-001',
	}
)
```

### Batch Operations Logging

```typescript
// Log multiple related events with correlation
const correlationId = `batch-${Date.now()}`

const patients = ['patient-001', 'patient-002', 'patient-003']

for (const patientId of patients) {
	await auditService.log({
		principalId: 'system-batch-processor',
		action: 'data.anonymize',
		targetResourceType: 'Patient',
		targetResourceId: patientId,
		status: 'success',
		outcomeDescription: 'Patient data anonymized for research dataset',
		dataClassification: 'PHI',
		correlationId,
		batchInfo: {
			batchId: correlationId,
			totalItems: patients.length,
			currentItem: patients.indexOf(patientId) + 1,
		},
	})
}
```

### Error Handling and Retry Logic

```typescript
import { Audit } from '@repo/audit'

class AuditService {
	private audit: Audit

	constructor() {
		this.audit = new Audit('application-audit-queue')
	}

	async logWithRetry(eventDetails: any, maxRetries = 3): Promise<void> {
		let lastError: Error | null = null

		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			try {
				await this.audit.log(eventDetails, {
					generateHash: true,
					correlationId: `retry-${attempt}-${Date.now()}`,
				})
				return // Success
			} catch (error) {
				lastError = error as Error
				console.warn(`Audit logging attempt ${attempt} failed:`, error)

				if (attempt < maxRetries) {
					// Exponential backoff
					const delay = Math.pow(2, attempt) * 1000
					await new Promise((resolve) => setTimeout(resolve, delay))
				}
			}
		}

		// All retries failed - log to fallback system
		console.error('All audit logging attempts failed:', lastError)
		await this.logToFallbackSystem(eventDetails, lastError)
	}

	private async logToFallbackSystem(eventDetails: any, error: Error): Promise<void> {
		// Implement fallback logging (file system, alternative queue, etc.)
		console.error(
			'FALLBACK AUDIT LOG:',
			JSON.stringify({
				...eventDetails,
				timestamp: new Date().toISOString(),
				fallbackReason: error.message,
			})
		)
	}
}
```

## Database Operations Examples

### Querying Audit Logs

```typescript
import { and, desc, eq, gte, lte } from 'drizzle-orm'

import { AuditDb } from '@repo/audit-db'
import { auditLog } from '@repo/audit-db/schema'

const auditDb = new AuditDb()
const db = auditDb.getDrizzleInstance()

// Get recent events for a user
const userEvents = await db
	.select()
	.from(auditLog)
	.where(eq(auditLog.principalId, 'user-123'))
	.orderBy(desc(auditLog.timestamp))
	.limit(50)

// Get failed login attempts in the last 24 hours
const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
const failedLogins = await db
	.select()
	.from(auditLog)
	.where(
		and(eq(auditLog.action, 'auth.login.failure'), gte(auditLog.timestamp, yesterday.toISOString()))
	)
	.orderBy(desc(auditLog.timestamp))

// Get PHI access events for compliance reporting
const phiAccess = await db
	.select({
		timestamp: auditLog.timestamp,
		principalId: auditLog.principalId,
		action: auditLog.action,
		targetResourceId: auditLog.targetResourceId,
		outcomeDescription: auditLog.outcomeDescription,
	})
	.from(auditLog)
	.where(
		and(
			eq(auditLog.dataClassification, 'PHI'),
			gte(auditLog.timestamp, '2024-01-01T00:00:00Z'),
			lte(auditLog.timestamp, '2024-12-31T23:59:59Z')
		)
	)
	.orderBy(desc(auditLog.timestamp))
```

### Compliance Reporting

```typescript
// Generate HIPAA compliance report
async function generateHIPAAReport(startDate: Date, endDate: Date) {
	const db = new AuditDb().getDrizzleInstance()

	const report = await db
		.select({
			date: auditLog.timestamp,
			user: auditLog.principalId,
			action: auditLog.action,
			resource: auditLog.targetResourceType,
			resourceId: auditLog.targetResourceId,
			outcome: auditLog.status,
			description: auditLog.outcomeDescription,
			ipAddress: auditLog.details,
		})
		.from(auditLog)
		.where(
			and(
				eq(auditLog.dataClassification, 'PHI'),
				gte(auditLog.timestamp, startDate.toISOString()),
				lte(auditLog.timestamp, endDate.toISOString())
			)
		)
		.orderBy(desc(auditLog.timestamp))

	return {
		reportGenerated: new Date().toISOString(),
		period: { start: startDate.toISOString(), end: endDate.toISOString() },
		totalEvents: report.length,
		events: report.map((event) => ({
			...event,
			ipAddress: event.ipAddress?.sessionContext?.ipAddress || 'unknown',
		})),
	}
}
```

## Integration Examples

### Express.js Middleware

```typescript
import { NextFunction, Request, Response } from 'express'

import { Audit } from '@repo/audit'

const auditService = new Audit('api-audit-queue')

export function auditMiddleware() {
	return async (req: Request, res: Response, next: NextFunction) => {
		const startTime = Date.now()

		// Capture original end method
		const originalEnd = res.end

		res.end = function (chunk?: any, encoding?: any) {
			const processingTime = Date.now() - startTime

			// Log the API request
			auditService
				.log({
					principalId: req.user?.id || 'anonymous',
					action: `api.${req.method.toLowerCase()}.${req.route?.path || req.path}`,
					status: res.statusCode < 400 ? 'success' : 'failure',
					outcomeDescription: `API ${req.method} ${req.path} - ${res.statusCode}`,
					processingLatency: processingTime,
					sessionContext: {
						sessionId: req.sessionID || 'no-session',
						ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
						userAgent: req.get('User-Agent') || 'unknown',
					},
					apiDetails: {
						method: req.method,
						path: req.path,
						statusCode: res.statusCode,
						contentLength: res.get('Content-Length'),
					},
				})
				.catch((error) => {
					console.error('Failed to log audit event:', error)
				})

			// Call original end method
			originalEnd.call(this, chunk, encoding)
		}

		next()
	}
}

// Usage in Express app
app.use(auditMiddleware())
```

### React Hook for Client-Side Auditing

```typescript
import { useCallback } from 'react'

interface AuditEvent {
  action: string
  targetResourceType?: string
  targetResourceId?: string
  status: 'attempt' | 'success' | 'failure'
  outcomeDescription?: string
  [key: string]: any
}

export function useAudit() {
  const logEvent = useCallback(async (event: AuditEvent) => {
    try {
      await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          sessionContext: {
            sessionId: sessionStorage.getItem('sessionId'),
            ipAddress: 'client-side', // Will be replaced server-side
            userAgent: navigator.userAgent
          }
        })
      })
    } catch (error) {
      console.error('Failed to log audit event:', error)
    }
  }, [])

  return { logEvent }
}

// Usage in React component
function PatientView({ patientId }: { patientId: string }) {
  const { logEvent } = useAudit()

  useEffect(() => {
    // Log patient view
    logEvent({
      action: 'ui.patient.view',
      targetResourceType: 'Patient',
      targetResourceId: patientId,
      status: 'success',
      outcomeDescription: 'User viewed patient details page'
    })
  }, [patientId, logEvent])

  return <div>Patient details...</div>
}
```

## Testing Examples

### Unit Testing Audit Events

```typescript
import { Redis } from 'ioredis'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { Audit } from '@repo/audit'

describe('Audit Service', () => {
	let auditService: Audit
	let mockRedis: Redis

	beforeEach(() => {
		mockRedis = new Redis({
			host: 'localhost',
			port: 6380, // Test Redis instance
			db: 1, // Use different database for tests
		})
		auditService = new Audit('test-audit-queue', mockRedis)
	})

	afterEach(async () => {
		await auditService.closeConnection()
		await mockRedis.quit()
	})

	it('should log audit event successfully', async () => {
		const eventDetails = {
			principalId: 'test-user',
			action: 'test.action',
			status: 'success' as const,
			outcomeDescription: 'Test event logged successfully',
		}

		await expect(auditService.log(eventDetails)).resolves.not.toThrow()
	})

	it('should generate and verify event hash', () => {
		const event = {
			timestamp: '2024-01-01T00:00:00Z',
			action: 'test.action',
			status: 'success' as const,
			principalId: 'test-user',
		}

		const hash = auditService.generateEventHash(event)
		expect(hash).toBeTruthy()
		expect(typeof hash).toBe('string')

		const isValid = auditService.verifyEventHash(event, hash)
		expect(isValid).toBe(true)
	})

	it('should validate required fields', async () => {
		const invalidEvent = {
			// Missing required 'action' field
			status: 'success' as const,
		}

		await expect(auditService.log(invalidEvent as any)).rejects.toThrow('Validation Error')
	})
})
```

### Integration Testing

```typescript
import { eq } from 'drizzle-orm'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { AuditDb } from '@repo/audit-db'
import { auditLog } from '@repo/audit-db/schema'

describe('Audit Database Integration', () => {
	let auditDb: AuditDb
	let db: ReturnType<AuditDb['getDrizzleInstance']>

	beforeAll(async () => {
		auditDb = new AuditDb(process.env.TEST_AUDIT_DB_URL)
		db = auditDb.getDrizzleInstance()

		// Verify connection
		const isConnected = await auditDb.checkAuditDbConnection()
		expect(isConnected).toBe(true)
	})

	it('should store and retrieve audit events', async () => {
		const testEvent = {
			timestamp: new Date().toISOString(),
			action: 'test.database.operation',
			status: 'success',
			principalId: 'test-user-db',
			outcomeDescription: 'Database integration test',
		}

		// Insert test event
		const [inserted] = await db.insert(auditLog).values(testEvent).returning()

		expect(inserted).toBeTruthy()
		expect(inserted.action).toBe(testEvent.action)

		// Retrieve test event
		const retrieved = await db.select().from(auditLog).where(eq(auditLog.id, inserted.id)).limit(1)

		expect(retrieved).toHaveLength(1)
		expect(retrieved[0].action).toBe(testEvent.action)

		// Cleanup
		await db.delete(auditLog).where(eq(auditLog.id, inserted.id))
	})
})
```

These examples demonstrate the flexibility and power of the SMEDREC Audit System across different use cases, from simple logging to complex compliance scenarios.
