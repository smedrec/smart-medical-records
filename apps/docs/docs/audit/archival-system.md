# Audit Data Archival and Cleanup System

## Overview

The Audit Data Archival and Cleanup System provides comprehensive functionality for managing the lifecycle of audit data. It implements automated archival based on retention policies, secure deletion with verification, and efficient retrieval of archived data for compliance investigations.

## Key Features

1. **Automated Data Archival**
   - Archives audit data based on configurable retention policies
   - Supports different data classifications with varying retention requirements
   - Provides detailed archival statistics and reporting

2. **Data Compression**
   - Implements multiple compression algorithms (gzip, deflate)
   - Configurable compression levels for storage optimization
   - Maintains metadata about compression ratios and sizes

3. **Secure Deletion**
   - Implements secure data deletion with verification
   - Confirms complete removal of deleted records
   - Supports selective deletion based on various criteria

4. **Archive Integrity**
   - Calculates checksums for both original and compressed data
   - Provides integrity verification capabilities
   - Detects corrupted archives automatically

5. **Flexible Retrieval**
   - Retrieves archived data based on multiple criteria
   - Supports filtering by date ranges, principal IDs, actions, etc.
   - Provides efficient decompression and deserialization

## Architecture

The archival system consists of the following components:

1. **ArchivalService**: Base class defining the core archival functionality
2. **PostgresArchivalService**: PostgreSQL-specific implementation
3. **Archive Storage Table**: Database table for storing compressed archives
4. **CLI Tool**: Command-line interface for managing archives

## Usage

### Command Line Interface

The system provides a comprehensive CLI for managing archives:

```bash
# Archive data based on retention policies
audit-archival archive [options]

# Delete data securely with verification
audit-archival delete [options]

# Retrieve archived data
audit-archival retrieve [options]

# Show archive statistics
audit-archival stats

# Validate archive integrity
audit-archival validate [options]

# Clean up old archives
audit-archival cleanup [options]
```

### Programmatic Usage

```typescript
import { PostgresArchivalService } from '@repo/audit'
import { archiveStorage, auditLog, auditRetentionPolicy } from '@repo/audit-db'

// Create archival service
const archivalService = new PostgresArchivalService(
	db,
	auditLog,
	auditRetentionPolicy,
	archiveStorage
)

// Archive data based on retention policies
const results = await archivalService.archiveDataByRetentionPolicies()

// Retrieve archived data
const retrievalResult = await archivalService.retrieveArchivedData({
	dateRange: {
		start: '2023-01-01T00:00:00Z',
		end: '2023-01-31T23:59:59Z',
	},
	principalId: 'user123',
	actions: ['user.login', 'user.logout'],
})
```

## Configuration

The archival system can be configured with the following options:

```typescript
const config = {
	compressionAlgorithm: 'gzip', // 'gzip', 'deflate', or 'none'
	compressionLevel: 6, // 0-9, higher means more compression
	format: 'jsonl', // 'json', 'jsonl', or 'parquet'
	batchSize: 1000, // Number of records per batch
	verifyIntegrity: true, // Whether to verify archive integrity
	encryptArchive: false, // Whether to encrypt archived data
}

const archivalService = new PostgresArchivalService(
	db,
	auditLog,
	auditRetentionPolicy,
	archiveStorage,
	config
)
```

## Retention Policies

Retention policies are defined in the `audit_retention_policy` table and control how long data is kept before archival and deletion:

- **archiveAfterDays**: Number of days after which data should be archived
- **deleteAfterDays**: Number of days after which data should be deleted
- **dataClassification**: The classification of data this policy applies to
- **isActive**: Whether the policy is currently active

## Database Schema

The archival system uses the following table for storing archives:

```sql
CREATE TABLE archive_storage (
  id VARCHAR(255) PRIMARY KEY,
  metadata JSONB NOT NULL,
  data TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  retrieved_count INTEGER NOT NULL DEFAULT 0,
  last_retrieved_at TIMESTAMP WITH TIME ZONE
);
```

## Performance Considerations

- Archives are processed in batches to minimize memory usage
- Compression reduces storage requirements significantly
- Indexes on key metadata fields optimize retrieval performance
- Archive cleanup runs automatically to free up storage space

## Best Practices

1. **Configure Appropriate Retention Policies**
   - Define policies based on data classification and compliance requirements
   - Set reasonable archival and deletion timeframes

2. **Regular Maintenance**
   - Schedule regular archival jobs to prevent audit table growth
   - Run cleanup operations during off-peak hours

3. **Monitoring**
   - Monitor archive statistics regularly
   - Check for corrupted archives with the validation command

4. **Backup Strategy**
   - Include archive storage in your backup strategy
   - Test archive retrieval periodically to ensure data accessibility

## CLI Command Reference

### Archive Command

Archives audit data based on retention policies.

```bash
audit-archival archive [options]

Options:
  --dry-run            Show what would be archived without actually archiving
  --policy <policy>    Archive data for specific retention policy only
  --verbose            Show detailed output
```

### Delete Command

Securely deletes audit data with verification.

```bash
audit-archival delete [options]

Options:
  --principal-id <id>                Delete data for specific principal ID
  --date-range <range>               Delete data in date range (format: start,end)
  --classification <classifications>  Delete data with specific classifications (comma-separated)
  --policy <policies>                Delete data with specific retention policies (comma-separated)
  --verify                           Verify deletion completion (default: true)
  --dry-run                          Show what would be deleted without actually deleting
```

### Retrieve Command

Retrieves archived audit data for compliance investigations.

```bash
audit-archival retrieve [options]

Options:
  --archive-id <id>                  Retrieve specific archive by ID
  --principal-id <id>                Retrieve data for specific principal ID
  --date-range <range>               Retrieve data in date range (format: start,end)
  --actions <actions>                Retrieve data with specific actions (comma-separated)
  --classification <classifications>  Retrieve data with specific classifications (comma-separated)
  --policy <policies>                Retrieve data with specific retention policies (comma-separated)
  --limit <limit>                    Limit number of records returned (default: "1000")
  --output <file>                    Output file path (default: stdout)
```

### Stats Command

Shows archive statistics and health information.

```bash
audit-archival stats
```

### Validate Command

Validates integrity of all stored archives.

```bash
audit-archival validate [options]

Options:
  --archive-id <id>    Validate specific archive by ID
```

### Cleanup Command

Cleans up old archives based on retention policies.

```bash
audit-archival cleanup [options]

Options:
  --dry-run            Show what would be cleaned up without actually deleting
```
