# Security Best Practices

The SMEDREC Audit System is designed with security as a primary concern. This guide outlines best practices for secure audit logging in healthcare environments.

## Cryptographic Security

### Hash Verification

All audit events can be protected with SHA-256 cryptographic hashes to ensure integrity:

```typescript
// Enable hash generation (enabled by default)
await auditService.log(eventDetails, {
	generateHash: true, // Default: true
})

// Verify event integrity
const isValid = auditService.verifyEventHash(event, event.hash)
if (!isValid) {
	console.error('Audit event integrity compromised!')
	// Handle tampered event
}
```

### HMAC Signatures

For additional security, use HMAC signatures with a secret key:

```typescript
// Generate signature for critical events
await auditService.log(eventDetails, {
	generateSignature: true,
})

// Verify signature
const isAuthentic = auditService.verifyEventSignature(event, event.signature)
if (!isAuthentic) {
	console.error('Audit event authentication failed!')
	// Handle unauthorized modification
}
```

### Configuration

Set up cryptographic configuration:

```typescript
const auditService = new Audit(
	'secure-queue',
	redisUrl,
	{},
	{
		secretKey: process.env.AUDIT_CRYPTO_SECRET, // Required for signatures
		algorithm: 'SHA-256', // Hash algorithm
	}
)
```

## Data Classification and Handling

### Classification Levels

Properly classify audit data based on sensitivity:

```typescript
// Public data
await auditService.log({
	action: 'system.startup',
	status: 'success',
	dataClassification: 'PUBLIC',
})

// Internal business data
await auditService.log({
	action: 'user.login',
	status: 'success',
	dataClassification: 'INTERNAL',
})

// Confidential business data
await auditService.log({
	action: 'admin.config.change',
	status: 'success',
	dataClassification: 'CONFIDENTIAL',
})

// Protected Health Information
await auditService.log({
	action: 'fhir.patient.read',
	targetResourceType: 'Patient',
	targetResourceId: 'patient-123',
	status: 'success',
	dataClassification: 'PHI', // Highest protection level
})
```

### Retention Policies

Implement appropriate data retention based on classification:

```typescript
await auditService.log({
	action: 'fhir.patient.access',
	dataClassification: 'PHI',
	retentionPolicy: 'hipaa-7-years', // Custom retention policy
	status: 'success',
})
```

## Input Validation and Sanitization

### Automatic Sanitization

The audit system automatically sanitizes input to prevent injection attacks:

```typescript
// Potentially dangerous input is automatically sanitized
await auditService.log({
	action: 'user.comment',
	status: 'success',
	userInput: '<script>alert("xss")</script>', // Automatically sanitized
	outcomeDescription: 'User submitted comment with "quotes"', // Quotes escaped
})
```

### Custom Validation

Configure validation rules for your environment:

```typescript
const customValidationConfig = {
	maxStringLength: 5000, // Shorter max length
	allowedDataClassifications: ['INTERNAL', 'PHI'], // Restrict classifications
	requiredFields: ['timestamp', 'action', 'status', 'principalId'], // Require user ID
	maxCustomFieldDepth: 2, // Limit nesting
	allowedEventVersions: ['2.0'], // Only allow specific versions
}

await auditService.log(eventDetails, {
	validationConfig: customValidationConfig,
})
```

### Manual Validation

For critical events, perform additional validation:

```typescript
function validateCriticalEvent(event: AuditLogEvent): boolean {
	// Custom business logic validation
	if (event.dataClassification === 'PHI' && !event.principalId) {
		throw new Error('PHI access must have principalId')
	}

	if (event.action.startsWith('admin.') && !event.organizationId) {
		throw new Error('Admin actions must have organizationId')
	}

	return true
}

// Use before logging
if (validateCriticalEvent(eventDetails)) {
	await auditService.log(eventDetails)
}
```

## Access Control and Authentication

### Principal Identification

Always identify the actor performing the action:

```typescript
// User actions
await auditService.log({
	principalId: 'user-123', // Always include user ID
	action: 'fhir.patient.read',
	status: 'success',
})

// System actions
await auditService.log({
	principalId: 'system-backup-service', // System identifier
	action: 'system.backup.created',
	status: 'success',
})

// Service-to-service
await auditService.log({
	principalId: 'service-fhir-api', // Service identifier
	organizationId: 'org-hospital-1', // Organization context
	action: 'fhir.bundle.process',
	status: 'success',
})
```

### Session Context

Include comprehensive session information:

```typescript
await auditService.log({
	principalId: 'user-123',
	action: 'fhir.patient.read',
	status: 'success',
	sessionContext: {
		sessionId: 'sess-abc123', // Session identifier
		ipAddress: '192.168.1.100', // Client IP
		userAgent: 'Mozilla/5.0...', // Client info
		geolocation: 'US-CA-SF', // Optional location
	},
})
```

## Network Security

### Redis Security

Secure your Redis connections:

```typescript
// Use TLS for Redis connections
const auditService = new Audit('secure-queue', {
	url: 'rediss://audit-redis:6380', // TLS connection
	options: {
		tls: {
			rejectUnauthorized: true,
			ca: fs.readFileSync('redis-ca.crt'),
			cert: fs.readFileSync('redis-client.crt'),
			key: fs.readFileSync('redis-client.key'),
		},
		password: process.env.REDIS_PASSWORD,
	},
})
```

### Database Security

Secure your PostgreSQL connections:

```env
# Use SSL for database connections
AUDIT_DB_URL="postgresql://user:pass@audit-db:5432/audit?sslmode=require&sslcert=client.crt&sslkey=client.key&sslrootcert=ca.crt"
```

## Environment Configuration

### Secure Environment Variables

```env
# Cryptographic keys (use strong, random values)
AUDIT_CRYPTO_SECRET="your-256-bit-secret-key-here"

# Database credentials (use strong passwords)
AUDIT_DB_URL="postgresql://audit_user:strong_password@audit-db:5432/audit_db"

# Redis credentials
AUDIT_REDIS_URL="rediss://audit_user:redis_password@audit-redis:6380"

# Additional security settings
AUDIT_ENABLE_SIGNATURES=true
AUDIT_REQUIRE_TLS=true
AUDIT_MAX_EVENT_SIZE=10000
```

### Key Management

Use proper key management practices:

```typescript
// Use environment-specific keys
const cryptoConfig = {
	secretKey:
		process.env.NODE_ENV === 'production'
			? process.env.AUDIT_CRYPTO_SECRET_PROD
			: process.env.AUDIT_CRYPTO_SECRET_DEV,
	rotationInterval: 30 * 24 * 60 * 60 * 1000, // 30 days
}

const auditService = new Audit('secure-queue', redisUrl, {}, cryptoConfig)
```

## Monitoring and Alerting

### Security Event Detection

Monitor for suspicious audit patterns:

```typescript
// Monitor for failed authentication attempts
const failedLogins = await db
	.select()
	.from(auditLog)
	.where(
		and(
			eq(auditLog.action, 'auth.login.failure'),
			gte(auditLog.timestamp, new Date(Date.now() - 60000).toISOString()) // Last minute
		)
	)

if (failedLogins.length > 5) {
	// Alert security team
	await alertSecurityTeam('Multiple failed login attempts detected')
}

// Monitor for PHI access anomalies
const phiAccess = await db
	.select()
	.from(auditLog)
	.where(
		and(
			eq(auditLog.dataClassification, 'PHI'),
			eq(auditLog.principalId, userId),
			gte(auditLog.timestamp, new Date(Date.now() - 3600000).toISOString()) // Last hour
		)
	)

if (phiAccess.length > 50) {
	// Unusual PHI access pattern
	await alertComplianceTeam('Unusual PHI access pattern detected', {
		userId,
		count: phiAccess.length,
	})
}
```

### Integrity Monitoring

Regularly verify audit log integrity:

```typescript
async function verifyAuditIntegrity() {
	const events = await db.select().from(auditLog).where(isNotNull(auditLog.hash)).limit(1000)

	let corruptedCount = 0

	for (const event of events) {
		if (event.hash && !auditService.verifyEventHash(event, event.hash)) {
			corruptedCount++
			console.error('Corrupted audit event detected:', event.id)
		}
	}

	if (corruptedCount > 0) {
		await alertSecurityTeam(`${corruptedCount} corrupted audit events detected`)
	}

	return { total: events.length, corrupted: corruptedCount }
}

// Run integrity check daily
setInterval(verifyAuditIntegrity, 24 * 60 * 60 * 1000)
```

## Compliance Considerations

### HIPAA Compliance

For HIPAA compliance, ensure:

```typescript
// Minimum required fields for HIPAA audit
await auditService.log({
	principalId: 'required-for-hipaa', // Who
	action: 'fhir.patient.read', // What
	targetResourceType: 'Patient', // What resource
	targetResourceId: 'patient-123', // Which resource
	timestamp: new Date().toISOString(), // When (auto-generated)
	status: 'success', // Outcome
	sessionContext: {
		sessionId: 'sess-123',
		ipAddress: '192.168.1.100', // Where from
	},
	dataClassification: 'PHI',
	retentionPolicy: 'hipaa-6-years',
})
```

### GDPR Compliance

For GDPR compliance:

```typescript
// Include data subject information
await auditService.log({
	principalId: 'processor-123',
	action: 'data.process',
	targetResourceType: 'PersonalData',
	targetResourceId: 'subject-456',
	status: 'success',
	dataClassification: 'CONFIDENTIAL',
	gdprContext: {
		dataSubjectId: 'subject-456',
		legalBasis: 'consent',
		processingPurpose: 'healthcare-treatment',
		dataCategories: ['health-data', 'contact-info'],
	},
	retentionPolicy: 'gdpr-standard',
})
```

## Incident Response

### Security Incident Logging

Log security incidents with high priority:

```typescript
await auditService.logWithGuaranteedDelivery(
	{
		principalId: 'security-system',
		action: 'security.incident.detected',
		status: 'failure',
		outcomeDescription: 'Potential data breach detected',
		dataClassification: 'CONFIDENTIAL',
		incidentDetails: {
			type: 'unauthorized-access',
			severity: 'high',
			affectedResources: ['patient-123', 'patient-456'],
			detectionMethod: 'anomaly-detection',
		},
	},
	{
		priority: 1, // Highest priority
		durabilityGuarantees: true,
		generateSignature: true,
	}
)
```

### Forensic Preservation

Preserve audit logs for forensic analysis:

```typescript
// Create immutable audit trail
await auditService.log(
	{
		action: 'forensic.preservation.start',
		status: 'success',
		preservationDetails: {
			incidentId: 'inc-2024-001',
			timeRange: { start: '2024-01-01T00:00:00Z', end: '2024-01-02T00:00:00Z' },
			preservedBy: 'security-officer-123',
		},
	},
	{
		generateHash: true,
		generateSignature: true,
		skipValidation: false, // Ensure full validation
	}
)
```

By following these security best practices, you can ensure that your audit system provides robust protection for sensitive healthcare data while maintaining compliance with regulatory requirements.
