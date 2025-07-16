# Getting Started with the Audit System

The SMEDREC Audit System provides comprehensive audit logging capabilities for healthcare applications, ensuring compliance with HIPAA, GDPR, and other regulatory requirements.

## Overview

The audit system consists of two main packages:

- **[@repo/audit](./audit.md)** - Core audit logging SDK for generating and sending audit events
- **[@repo/audit-db](./audit-db.md)** - Database layer for storing and querying audit logs

## Quick Start

### 1. Installation

Add the audit packages to your application:

```bash
# For basic audit logging
pnpm add '@repo/audit@workspace:*'

# For database operations
pnpm add '@repo/audit-db@workspace:*'
```

### 2. Basic Usage

```typescript
import { Audit } from '@repo/audit'

// Initialize the audit service
const auditService = new Audit('user-activity-queue')

// Log a simple audit event
await auditService.log({
	principalId: 'user-123',
	action: 'fhir.patient.read',
	targetResourceType: 'Patient',
	targetResourceId: 'patient-456',
	status: 'success',
	outcomeDescription: 'Successfully retrieved patient record',
})
```

### 3. Environment Setup

Configure your environment variables:

```env
# Redis connection for audit queue
REDIS_URL="redis://localhost:6379"

# Optional: Separate Redis for audit system
AUDIT_REDIS_URL="redis://audit-redis:6379"

# Database connection for audit storage
AUDIT_DB_URL="postgresql://user:pass@localhost:5432/audit_db"
```

## Key Features

### 🔒 Security & Compliance

- Cryptographic integrity verification with SHA-256 hashing
- HMAC signatures for tamper detection
- GDPR compliance with data classification and retention policies
- Automatic data sanitization to prevent injection attacks

### 🚀 Reliability

- Guaranteed delivery with reliable event processor
- Circuit breaker pattern for fault tolerance
- Dead letter queue for failed events
- Automatic retry mechanisms with exponential backoff

### 📊 Monitoring & Observability

- Real-time health checks and metrics
- Performance monitoring with latency tracking
- Queue depth monitoring
- Comprehensive error handling and logging

### 🏥 Healthcare-Specific

- FHIR resource audit events
- Practitioner license verification tracking
- Patient data access logging
- HIPAA-compliant audit trails

## Architecture

```mermaid
graph TB
    A[Application] --> B[Audit SDK]
    B --> C[Redis Queue]
    C --> D[Audit Worker]
    D --> E[PostgreSQL Database]

    B --> F[Validation & Sanitization]
    B --> G[Cryptographic Security]
    B --> H[Reliable Processor]

    D --> I[GDPR Compliance]
    D --> J[Monitoring & Alerts]
```

## Next Steps

- [Learn about the Audit SDK](./audit.md)
- [Explore database operations](./audit-db.md)
- [View API reference](./api-reference.md)
- [Check out examples](./examples.md)
- [Security best practices](./security.md)
