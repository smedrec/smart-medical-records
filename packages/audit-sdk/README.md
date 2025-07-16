# SMEDREC Audit SDK

A comprehensive audit logging SDK for healthcare applications with built-in security, compliance, and FHIR support.

## Features

- 🔒 **Security First**: Cryptographic hashing and signatures for tamper detection
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

// Log a FHIR event with compliance validation
await auditSDK.logFHIR({
	principalId: 'practitioner-456',
	action: 'read',
	resourceType: 'Patient',
	resourceId: 'patient-789',
	status: 'success',
	outcomeDescription: 'Accessed patient record for treatment',
})
```

## Configuration

### Basic Configuration

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
}
```

### Compliance Configuration

```typescript
const config: AuditSDKConfig = {
	// ... other config
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
}
```

## Usage Examples

### Authentication Events

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

// Failed login attempt
await auditSDK.logAuth({
	principalId: 'user-123',
	action: 'login',
	status: 'failure',
	reason: 'Invalid credentials',
})
```

### FHIR Resource Access

```typescript
// Patient record access
await auditSDK.logFHIR({
	principalId: 'practitioner-456',
	organizationId: 'hospital-1',
	action: 'read',
	resourceType: 'Patient',
	resourceId: 'patient-789',
	status: 'success',
	outcomeDescription: 'Accessed patient record for treatment planning',
	sessionContext: {
		sessionId: 'sess-def456',
		ipAddress: '10.0.1.50',
		userAgent: 'EMR-System/2.1',
	},
	fhirContext: {
		version: 'R4',
		interaction: 'read',
		compartment: 'Patient/patient-789',
	},
})
```

### Data Operations

```typescript
// Data modification
await auditSDK.logData({
	principalId: 'user-123',
	action: 'update',
	resourceType: 'Patient',
	resourceId: 'patient-456',
	status: 'success',
	dataClassification: 'PHI',
	changes: {
		field: 'address',
		oldValue: '123 Old St',
		newValue: '456 New Ave',
	},
})
```

### Critical Events with Guaranteed Delivery

```typescript
// High-priority security event
await auditSDK.logCritical(
	{
		principalId: 'security-system',
		action: 'security.breach.detected',
		status: 'failure',
		outcomeDescription: 'Unauthorized access attempt detected',
		dataClassification: 'CONFIDENTIAL',
		securityContext: {
			threatLevel: 'high',
			attackVector: 'brute_force',
			blockedIP: '192.168.1.200',
		},
	},
	{
		priority: 1,
		compliance: ['hipaa'],
	}
)
```

## Middleware Integration

### Express.js

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

### WebSocket

```typescript
import { createWebSocketAuditMiddleware } from '@repo/audit-sdk'

io.use(createWebSocketAuditMiddleware(auditSDK))
```

### GraphQL

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
// Using authentication preset
await auditSDK.log(
	{
		principalId: 'user-123',
		status: 'success',
	},
	{
		preset: 'authentication',
	}
)

// Available presets:
// - authentication
// - fhir_access
// - system
// - data_operation
// - admin
// - security
// - compliance
// - practitioner
```

## Utilities

### Event Batching

```typescript
import { AuditEventBatcher } from '@repo/audit-sdk'

const batcher = new AuditEventBatcher(
	100, // batch size
	5000, // flush interval (ms)
	async (events) => {
		// Process batch of events
		for (const event of events) {
			await auditSDK.log(event)
		}
	}
)

// Add events to batch
batcher.add(event1)
batcher.add(event2)
```

### Rate Limiting

```typescript
import { AuditRateLimiter } from '@repo/audit-sdk'

const rateLimiter = new AuditRateLimiter(100, 60000) // 100 events per minute

if (rateLimiter.isAllowed(userId)) {
	await auditSDK.log(event)
}
```

### Data Masking

```typescript
import { maskSensitiveData } from '@repo/audit-sdk'

const maskedEvent = maskSensitiveData(event, ['password', 'ssn', 'creditCard'])
```

## Compliance Features

### HIPAA Compliance

```typescript
// Automatic HIPAA validation
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

```typescript
// GDPR data processing event
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

## Reporting

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

```typescript
// Verify audit log integrity
const integrityReport = await auditSDK.verifyIntegrity({
	startDate: new Date('2024-01-01'),
	limit: 10000,
})

console.log(
	`Verified ${integrityReport.total} events, found ${integrityReport.corrupted} corrupted`
)
```

## Health Monitoring

```typescript
// Check system health
const health = await auditSDK.getHealth()
console.log('Audit system health:', health)
// Output: { redis: 'connected', database: 'connected', timestamp: '...' }
```

## Error Handling

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

## Environment Variables

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

## TypeScript Support

The SDK is fully typed with comprehensive TypeScript definitions:

```typescript
import type { AuditLogEvent, AuditSDKConfig, ComplianceConfig } from '@repo/audit-sdk'
```

## Contributing

See the main project [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

See [LICENSE](../../LICENSE) file.
