# Audit Database Migration Guide

This guide covers the database schema enhancements for compliance fields and audit integrity tracking, implementing a common audit system that can handle any type of resource (including FHIR resources).

## Overview

The audit database has been enhanced with two key migrations:

### Migration `0005_magenta_peter_quill` - Compliance Fields

Adds compliance and integrity tracking capabilities to the audit database.

### Migration `0006_unknown_siren` - Common Audit System

Removes resource-specific fields to create a truly common audit system that can handle any type of resource through the flexible `details` JSONB column.

### New Compliance Fields in `audit_log` table:

- `hash_algorithm` - Cryptographic hash algorithm used (default: 'SHA-256')
- `event_version` - Event schema version for compatibility tracking (default: '1.0')
- `correlation_id` - Correlation ID for tracking related events
- `data_classification` - Data classification level ('PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'PHI')
- `retention_policy` - Retention policy identifier (default: 'standard')
- `processing_latency` - Processing latency in milliseconds for performance monitoring
- `archived_at` - Timestamp when the record was archived

### New Tables:

#### `audit_integrity_log`

Tracks verification attempts and results for audit event integrity:

- `id` - Primary key
- `audit_log_id` - Foreign key to audit_log table
- `verification_timestamp` - When verification was performed
- `verification_status` - Result of verification ('success', 'failure', 'tampered')
- `verification_details` - Additional context about verification (JSONB)
- `verified_by` - System or user that performed verification
- `hash_verified` - The hash that was verified
- `expected_hash` - The expected hash value

#### `audit_retention_policy`

Manages data lifecycle and retention policies:

- `id` - Primary key
- `policy_name` - Unique policy identifier
- `retention_days` - How long to keep active data
- `archive_after_days` - When to archive data (optional)
- `delete_after_days` - When to permanently delete data (optional)
- `data_classification` - Which data classification this policy applies to
- `description` - Human-readable description
- `is_active` - Whether policy is currently active
- `created_at` - When policy was created
- `updated_at` - When policy was last updated
- `created_by` - Who created this policy

### New Indexes

Optimized indexes for compliance queries and performance:

- Correlation ID, data classification, retention policy indexes
- Composite indexes for common query patterns
- Integrity log verification tracking indexes
- Retention policy management indexes

## Migration Commands

### Apply Migration

```bash
# Generate migration files
pnpm run audit-db:generate

# Apply migrations to database
pnpm run audit-db:migrate
```

### Verify Migration

```bash
# Verify database schema
pnpm run audit-db:verify

# Verify compliance features are present
pnpm run audit-db:verify-compliance
```

### Rollback Migration

```bash
# Rollback specific migration
pnpm run audit-db:rollback 0005_magenta_peter_quill
```

### Seed Default Policies

```bash
# Insert default retention policies
pnpm run audit-db:seed-policies
```

## Default Retention Policies

The migration includes these default retention policies:

1. **standard** (INTERNAL data)
   - Retention: 7 years
   - Archive after: 1 year

2. **phi_extended** (PHI data)
   - Retention: 7 years (HIPAA requirement)
   - Archive after: 1 year

3. **minimal** (PUBLIC data)
   - Retention: 3 months
   - Archive after: 1 month

4. **confidential** (CONFIDENTIAL data)
   - Retention: 5 years
   - Archive after: 1 year

## Testing

### Run Schema Tests

```bash
pnpm test --run
```

### Run Integration Tests (requires database)

```bash
# Set database URL
export TEST_AUDIT_DB_URL="postgresql://user:pass@localhost:5432/audit_test"

# Run all tests
pnpm test --run
```

## Requirements Addressed

This migration addresses the following requirements from the audit system enhancement specification:

- **Requirement 1.1**: Cryptographic integrity verification with hash tracking
- **Requirement 4.3**: GDPR compliance with data retention management
- **Requirement 7.1**: Optimized database schema for write performance
- **Requirement 7.2**: Efficient querying with proper indexing for compliance reports

## Rollback Procedure

If you need to rollback this migration:

1. **Backup your data** before rollback
2. Run the rollback command: `pnpm run audit-db:rollback 0005_magenta_peter_quill`
3. Verify the rollback: `pnpm run audit-db:verify`

The rollback will:

- Remove new compliance columns from `audit_log`
- Drop `audit_integrity_log` and `audit_retention_policy` tables
- Remove all new indexes
- Preserve existing audit data

## Data Migration Notes

- Existing audit_log records will have default values applied for new compliance fields
- No data loss occurs during migration or rollback
- New fields are nullable or have sensible defaults
- Foreign key constraints ensure referential integrity

## Performance Considerations

- New indexes optimize common compliance query patterns
- Composite indexes support multi-column queries
- Partitioning strategy can be implemented for large datasets
- Archive functionality supports data lifecycle management

## Security Considerations

- Hash algorithm standardized to SHA-256
- Integrity verification tracking prevents tampering
- Data classification supports access control
- Retention policies ensure compliance with data protection laws
