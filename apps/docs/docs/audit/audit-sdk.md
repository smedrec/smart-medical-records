# Audit SDK (`@repo/audit-sdk`)

The `@repo/audit-sdk` package provides a comprehensive, high-level interface for audit logging in healthcare applications. It builds on top of `@repo/audit` and `@repo/audit-db` to offer enhanced features, compliance validation, and developer-friendly APIs.

## Features

- 🔒 **Security First**: Built-in cryptographic hashing and signatures
- 🏥 **Healthcare Ready**: FHIR-specific audit events and PHI handling
- 📋 **Compliance Built-in**: HIPAA and GDPR compliance validation
- 🚀 **High Performance**: Batching, rate limiting, and guaranteed delivery
- 🔧 **Easy Integration**: Express, WebSocket, and GraphQL middleware
- 📊 **Rich Reporting**: Compliance reports and integrity verification

## Installation

```bash
pnpm add '@repo/audit-sdk@workspace:*'
```

## Quick Start

```typescript
import { AuditSDK } from '@repo/audit-sdk'

// Initialize the SDK
const auditSDK = new AuditSDK({
	queueName: 'my-app-audit',
	redis: {
		url: 'redis://localhost:6379',
	},
	databaseUrl: 'postgresql://user:pass@localhost:5432/audit_db',
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

// Log a simple event
await auditSDK.log({
	principalId: 'user-123',
	action: 'user.login',
	status: 'success',
	outcomeDescription: 'User logged in successfully',
})
```

## Core Methods

### log()

Log a standard audit event with optional presets and compliance validation.

```typescript
await auditSDK.log(
	{
		principalId: 'user-123',
		action: 'data.read',
		targetResourceType: 'Patient',
		targetResourceId: 'patient-456',
		status: 'success',
		dataClassification: 'PHI',
	},
	{
		preset: 'fhir_access',
		compliance: ['hipaa'],
	}
)
```

### logFHIR()

Specialized method for FHIR resource access events.

```typescript
await auditSDK.logFHIR({
	principalId: 'practitioner-456',
	action: 'read',
	resourceType: 'Patient',
	resourceId: 'patient-789',
	status: 'success',
	outcomeDescription: 'Accessed patient record for treatment',
	organizationId: 'hospital-1',
	sessionContext: {
		sessionId: 'sess-123',
		ipAddress: '192.168.1.100',
		userAgent: 'EMR-System/2.1',
	},
})
```

### logAuth()

Log authentication-related events.

```typescript
// Successful login
await auditSDK.logAuth({
	principalId: 'user-123',
	action: 'login',
	status: 'success',
	sessionContext: {
		sessionId: 'sess-abc123',
		ipAddress: '192.168.1.100',
		userAgent: 'Mozilla/5.0...',
	},
})

// Failed login
await auditSDK.logAuth({
	principalId: 'user-123',
	action: 'login',
	status: 'failure',
	reason: 'Invalid credentials',
})
```

### logCritical()

Log critical events with guaranteed delivery.

```typescript
await auditSDK.logCritical(
	{
		principalId: 'security-system',
		action: 'security.breach.detected',
		status: 'failure',
		outcomeDescription: 'Unauthorized access attempt detected',
		dataClassification: 'CONFIDENTIAL',
	},
	{
		priority: 1,
		compliance: ['hipaa'],
	}
)
```

## Middleware Integration

### Express.js Middleware

Automatically log HTTP requests and responses:

```typescript
import express from 'express'

import { createAuditMiddleware } from '@repo/audit-sdk'

const app = express()

app.use(
	createAuditMiddleware(auditSDK, {
		skip: (req) => req.path.startsWith('/health'),
		enrich: (req, res, event) => ({
			...event,
			customField: req.headers['x-custom-header'],
		}),
		performance: {
			sampleRate: 0.1, // Log 10% of requests
			maxLatency: 5000, // Skip slow requests
		},
	})
)
```

### WebSocket Middleware

```typescript
import { createWebSocketAuditMiddleware } from '@repo/audit-sdk'

io.use(createWebSocketAuditMiddleware(auditSDK))
```

### GraphQL Middleware

```typescript
import { createGraphQLAuditMiddleware } from '@repo/audit-sdk'

const server = new ApolloServer({
	typeDefs,
	resolvers,
	plugins: [createGraphQLAuditMiddleware(auditSDK)],
})
```

## Presets

Use predefined configurations for common scenarios:

```typescript
// Available presets:
// - authentication: For login/logout events
// - fhir_access: For FHIR resource access
// - system: For system operations
// - data_operation: For data CRUD operations
// - admin: For administrative actions
// - security: For security events
// - compliance: For compliance-related events
// - practitioner: For practitioner management

await auditSDK.log(
	{
		principalId: 'user-123',
		status: 'success',
	},
	{
		preset: 'authentication',
	}
)
```

## Compliance Features

### HIPAA Compliance

Automatic validation for HIPAA requirements:

```typescript
await auditSDK.log(
	{
		principalId: 'practitioner-123',
		action: 'fhir.patient.read',
		targetResourceType: 'Patient',
		targetResourceId: 'patient-456',
		status: 'success',
		dataClassification: 'PHI',
		sessionContext: {
			sessionId: 'sess-123',
			ipAddress: '192.168.1.100',
			userAgent: 'EMR/1.0',
		},
	},
	{
		compliance: ['hipaa'],
	}
)
```

### GDPR Compliance

Handle personal data processing events:

```typescript
await auditSDK.log(
	{
		principalId: 'processor-123',
		action: 'data.process',
		status: 'success',
		gdprContext: {
			dataSubjectId: 'subject-456',
			legalBasis: 'consent',
			processingPurpose: 'healthcare-treatment',
			dataCategories: ['health-data', 'contact-info'],
		},
	},
	{
		compliance: ['gdpr'],
	}
)
```

## Utilities

### Event Batching

Process events in batches for better performance:

```typescript
import { AuditEventBatcher } from '@repo/audit-sdk'

const batcher = new AuditEventBatcher(
	100, // batch size
	5000, // flush interval (ms)
	async (events) => {
		for (const event of events) {
			await auditSDK.log(event)
		}
	}
)

batcher.add(event1)
batcher.add(event2)
```

### Rate Limiting

Prevent audit spam:

```typescript
import { AuditRateLimiter } from '@repo/audit-sdk'

const rateLimiter = new AuditRateLimiter(100, 60000) // 100 events per minute

if (rateLimiter.isAllowed(userId)) {
	await auditSDK.log(event)
}
```

### Data Masking

Automatically mask sensitive data:

```typescript
import { maskSensitiveData } from '@repo/audit-sdk'

const maskedEvent = maskSensitiveData(event, ['password', 'ssn', 'creditCard'])
```

## Reporting and Analytics

### Generate Compliance Reports

```typescript
// HIPAA audit report
const hipaaReport = await auditSDK.generateComplianceReport('hipaa', {
	startDate: new Date('2024-01-01'),
	endDate: new Date('2024-12-31'),
	format: 'json',
})

// GDPR processing activities report
const gdprReport = await auditSDK.generateComplianceReport('gdpr', {
	startDate: new Date('2024-01-01'),
	endDate: new Date('2024-12-31'),
	format: 'csv',
})
```

### Integrity Verification

Verify the integrity of audit logs:

```typescript
const integrityReport = await auditSDK.verifyIntegrity({
	startDate: new Date('2024-01-01'),
	limit: 10000,
})

console.log(
	`Verified ${integrityReport.total} events, found ${integrityReport.corrupted} corrupted`
)
```

## Configuration

### Environment Variables

```env
# Redis Configuration
REDIS_URL=redis://localhost:6379
AUDIT_REDIS_URL=redis://audit-redis:6379

# Database Configuration
AUDIT_DB_URL=postgresql://user:pass@localhost:5432/audit_db

# Security Configuration
AUDIT_SECRET_KEY=your-256-bit-secret-key
AUDIT_ENABLE_SIGNATURES=true

# Performance Configuration
AUDIT_BATCH_SIZE=100
AUDIT_FLUSH_INTERVAL=5000
AUDIT_RATE_LIMIT=1000
```

### Full Configuration Example

```typescript
const config: AuditSDKConfig = {
	queueName: 'audit-events',
	redis: {
		url: process.env.REDIS_URL,
		options: {
			maxRetriesPerRequest: 3,
			enableAutoPipelining: true,
		},
	},
	databaseUrl: process.env.AUDIT_DB_URL,
	crypto: {
		secretKey: process.env.AUDIT_SECRET_KEY,
		enableSignatures: true,
	},
	validation: {
		maxStringLength: 10000,
		allowedDataClassifications: ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'PHI'],
		requiredFields: ['timestamp', 'action', 'status'],
		maxCustomFieldDepth: 3,
		allowedEventVersions: ['1.0', '1.1', '2.0'],
	},
	compliance: {
		hipaa: {
			enabled: true,
			requiredFields: ['principalId', 'targetResourceType', 'sessionContext'],
			retentionYears: 6,
		},
		gdpr: {
			enabled: true,
			defaultLegalBasis: 'legitimate_interest',
			retentionDays: 365,
		},
	},
	defaults: {
		dataClassification: 'INTERNAL',
		retentionPolicy: 'standard',
		generateHash: true,
		generateSignature: false,
	},
}

const auditSDK = new AuditSDK(config)
```

## Health Monitoring

Monitor the health of your audit system:

```typescript
const health = await auditSDK.getHealth()
console.log('Audit system health:', health)
// Output: { redis: 'connected', database: 'connected', timestamp: '...' }
```

## Error Handling

Handle different types of audit errors:

```typescript
try {
	await auditSDK.log(eventDetails)
} catch (error) {
	if (error.name === 'AuditValidationError') {
		console.error('Validation failed:', error.field, error.message)
	} else if (error.name === 'ComplianceError') {
		console.error('Compliance validation failed:', error.message)
	} else {
		console.error('Audit logging failed:', error.message)
	}
}
```

## Best Practices

1. **Always include session context** for user actions
2. **Use appropriate data classifications** (PUBLIC, INTERNAL, CONFIDENTIAL, PHI)
3. **Enable cryptographic features** for sensitive data
4. **Implement rate limiting** to prevent audit spam
5. **Use presets** for consistent event structure
6. **Validate compliance** for regulated data
7. **Monitor system health** regularly
8. **Batch events** for high-volume scenarios

## Migration from @repo/audit

If you're currently using `@repo/audit` directly, migrating to the SDK is straightforward:

```typescript
// Before (using @repo/audit)
import { Audit } from '@repo/audit'
// After (using @repo/audit-sdk)
import { AuditSDK } from '@repo/audit-sdk'

const audit = new Audit('queue-name')
await audit.log(eventDetails)

const auditSDK = new AuditSDK({ queueName: 'queue-name' })
await auditSDK.log(eventDetails)
```

The SDK provides the same core functionality with additional features and better developer experience.

## Related Documentation

- [Getting Started](./get-started.md) - Quick introduction to the audit system
- [Core Audit Package](./audit.md) - Low-level audit functionality
- [Database Package](./audit-db.md) - Database operations
- [API Reference](./api-reference.md) - Complete API documentation
- [Examples](./examples.md) - Practical usage examples
- [Security](./security.md) - Security best practices
