# API Reference

Complete API reference for the SMEDREC Audit System.

## @repo/audit

### Audit Class

The main class for logging audit events to a BullMQ queue backed by Redis.

#### Constructor

```typescript
new Audit(
  queueName: string,
  redisOrUrlOrOptions?: string | Redis | { url?: string; options?: RedisOptions },
  directConnectionOptions?: RedisOptions,
  cryptoConfig?: Partial<CryptoConfig>
)
```

**Parameters:**

- `queueName` - Name of the BullMQ queue for audit logs
- `redisOrUrlOrOptions` - Redis connection configuration (optional)
- `directConnectionOptions` - IORedis options for direct connections (optional)
- `cryptoConfig` - Cryptographic configuration (optional)

**Example:**

```typescript
// Use shared Redis connection
const audit = new Audit('user-activity-queue')

// Use specific Redis URL
const audit = new Audit('user-activity-queue', 'redis://audit-redis:6379')

// Use existing Redis instance
const audit = new Audit('user-activity-queue', redisInstance)
```

#### Methods

##### log()

Logs an audit event to the queue with validation and cryptographic security.

```typescript
async log(
  eventDetails: Omit<AuditLogEvent, 'timestamp'>,
  options?: {
    generateHash?: boolean
    generateSignature?: boolean
    correlationId?: string
    eventVersion?: string
    skipValidation?: boolean
    validationConfig?: ValidationConfig
  }
): Promise<void>
```

**Parameters:**

- `eventDetails` - Audit event data (timestamp is auto-generated)
- `options` - Optional configuration for logging behavior

**Example:**

```typescript
await audit.log(
	{
		principalId: 'user-123',
		action: 'fhir.patient.read',
		targetResourceType: 'Patient',
		targetResourceId: 'patient-456',
		status: 'success',
		outcomeDescription: 'Patient record accessed successfully',
		sessionContext: {
			sessionId: 'sess-789',
			ipAddress: '192.168.1.100',
			userAgent: 'Mozilla/5.0...',
		},
	},
	{
		generateHash: true,
		generateSignature: true,
		correlationId: 'corr-12345',
	}
)
```

##### logWithGuaranteedDelivery()

Logs an audit event with enhanced reliability guarantees.

```typescript
async logWithGuaranteedDelivery(
  eventDetails: Omit<AuditLogEvent, 'timestamp'>,
  options?: {
    priority?: number
    delay?: number
    durabilityGuarantees?: boolean
    generateHash?: boolean
    generateSignature?: boolean
    correlationId?: string
    eventVersion?: string
    skipValidation?: boolean
    validationConfig?: ValidationConfig
  }
): Promise<void>
```

**Example:**

```typescript
await audit.logWithGuaranteedDelivery(
	{
		principalId: 'user-123',
		action: 'fhir.patient.update',
		targetResourceType: 'Patient',
		targetResourceId: 'patient-456',
		status: 'success',
		dataClassification: 'PHI',
	},
	{
		priority: 1, // High priority
		durabilityGuarantees: true,
		generateHash: true,
		generateSignature: true,
	}
)
```

##### generateEventHash()

Generates a cryptographic hash for event integrity verification.

```typescript
generateEventHash(event: AuditLogEvent): string
```

##### verifyEventHash()

Verifies the cryptographic hash of an audit event.

```typescript
verifyEventHash(event: AuditLogEvent, expectedHash: string): boolean
```

##### generateEventSignature()

Generates an HMAC signature for additional security.

```typescript
generateEventSignature(event: AuditLogEvent): string
```

##### verifyEventSignature()

Verifies the HMAC signature of an audit event.

```typescript
verifyEventSignature(event: AuditLogEvent, signature: string): boolean
```

##### closeConnection()

Closes the audit service connection and cleans up resources.

```typescript
async closeConnection(): Promise<void>
```

### Types and Interfaces

#### AuditLogEvent

Core interface for audit events.

```typescript
interface AuditLogEvent {
	timestamp: string // ISO 8601 timestamp
	action: string // Action performed
	status: AuditEventStatus // 'attempt' | 'success' | 'failure'
	principalId?: string // User/system identifier
	organizationId?: string // Organization identifier
	targetResourceType?: string // Type of resource affected
	targetResourceId?: string // ID of resource affected
	outcomeDescription?: string // Description of outcome
	hash?: string // Cryptographic hash
	hashAlgorithm?: 'SHA-256' // Hash algorithm used
	signature?: string // HMAC signature
	eventVersion?: string // Event schema version
	correlationId?: string // Correlation identifier
	sessionContext?: SessionContext // Session information
	dataClassification?: DataClassification // Data sensitivity level
	retentionPolicy?: string // Data retention policy
	processingLatency?: number // Processing time in ms
	queueDepth?: number // Queue depth at processing
	[key: string]: any // Additional custom fields
}
```

#### SessionContext

Session information for audit events.

```typescript
interface SessionContext {
	sessionId: string // Session identifier
	ipAddress: string // Client IP address
	userAgent: string // Client user agent
	geolocation?: string // Geographic location (optional)
}
```

#### DataClassification

Data sensitivity levels for compliance.

```typescript
type DataClassification = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'PHI'
```

#### AuditEventStatus

Possible outcomes for audited actions.

```typescript
type AuditEventStatus = 'attempt' | 'success' | 'failure'
```

### Validation and Sanitization

#### validateAndSanitizeAuditEvent()

Comprehensive validation and sanitization pipeline.

```typescript
function validateAndSanitizeAuditEvent(
	event: Partial<AuditLogEvent>,
	config?: ValidationConfig
): {
	isValid: boolean
	sanitizedEvent: AuditLogEvent | null
	validationErrors: AuditValidationError[]
	sanitizationWarnings: AuditSanitizationError[]
	validationWarnings: string[]
}
```

#### ValidationConfig

Configuration for validation rules.

```typescript
interface ValidationConfig {
	maxStringLength: number // Maximum string field length
	allowedDataClassifications: DataClassification[] // Allowed data classifications
	requiredFields: (keyof AuditLogEvent)[] // Required event fields
	maxCustomFieldDepth: number // Maximum nesting depth
	allowedEventVersions: string[] // Supported event versions
}
```

## @repo/audit-db

### AuditDb Class

Database client for audit log storage and retrieval.

#### Constructor

```typescript
new AuditDb(postgresUrl?: string)
```

**Parameters:**

- `postgresUrl` - PostgreSQL connection string (optional, uses `AUDIT_DB_URL` env var if not provided)

#### Methods

##### getDrizzleInstance()

Returns the configured Drizzle ORM instance.

```typescript
getDrizzleInstance(): PostgresJsDatabase<typeof schema>
```

##### checkAuditDbConnection()

Verifies database connectivity.

```typescript
async checkAuditDbConnection(): Promise<boolean>
```

### Database Schema

The audit database uses the following main table structure:

```sql
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  action VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  principal_id VARCHAR(255),
  organization_id VARCHAR(255),
  target_resource_type VARCHAR(100),
  target_resource_id VARCHAR(255),
  outcome_description TEXT,
  hash VARCHAR(64),
  signature VARCHAR(128),
  event_version VARCHAR(10),
  correlation_id VARCHAR(255),
  data_classification VARCHAR(20),
  retention_policy VARCHAR(50),
  processing_latency INTEGER,
  queue_depth INTEGER,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Error Handling

#### AuditValidationError

Thrown when audit event validation fails.

```typescript
class AuditValidationError extends Error {
	field: string // Field that failed validation
	value: any // Invalid value
	code: string // Error code
}
```

#### AuditSanitizationError

Thrown when sanitization modifies event data.

```typescript
class AuditSanitizationError extends Error {
	field: string // Field that was sanitized
	originalValue: any // Original value
	sanitizedValue: any // Sanitized value
}
```

## Configuration

### Environment Variables

```env
# Redis Configuration
REDIS_URL="redis://localhost:6379"
AUDIT_REDIS_URL="redis://audit-redis:6379"  # Optional separate Redis

# Database Configuration
AUDIT_DB_URL="postgresql://user:pass@localhost:5432/audit_db"

# Cryptographic Configuration
AUDIT_CRYPTO_SECRET="your-secret-key-here"
AUDIT_HASH_ALGORITHM="SHA-256"

# Queue Configuration
AUDIT_QUEUE_NAME="audit-events"
AUDIT_RELIABLE_QUEUE_NAME="audit-events-reliable"
```

### Default Configurations

```typescript
// Default validation configuration
const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
	maxStringLength: 10000,
	allowedDataClassifications: ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'PHI'],
	requiredFields: ['timestamp', 'action', 'status'],
	maxCustomFieldDepth: 3,
	allowedEventVersions: ['1.0', '1.1', '2.0'],
}

// Default reliable processor configuration
const DEFAULT_RELIABLE_PROCESSOR_CONFIG: ReliableProcessorConfig = {
	maxRetries: 3,
	retryDelay: 1000,
	circuitBreakerThreshold: 5,
	circuitBreakerTimeout: 30000,
	deadLetterQueueEnabled: true,
}
```
