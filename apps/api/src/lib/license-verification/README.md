# License Verification Service

The License Verification Service provides automated verification of medical practitioner licenses against official registries and databases.

## Features

- **Multi-jurisdiction Support**: Supports verification across multiple jurisdictions (US states, UK, Canada, etc.)
- **Multiple Verification Methods**: API-based verification with fallback to manual review
- **Batch Processing**: Bulk verification of multiple licenses
- **Retry Logic**: Automatic retry with exponential backoff for failed API calls
- **Manual Review Queue**: Queue system for licenses requiring manual verification
- **Audit Trail**: Complete history of verification attempts

## Architecture

### Core Components

1. **LicenseVerificationService**: Main service orchestrating the verification process
2. **APIProviderManager**: Manages different API providers for various jurisdictions
3. **VerificationQueue**: Handles manual review requests and verification history
4. **Types**: TypeScript interfaces and error classes

### Verification Flow

1. **API Verification**: First attempt using jurisdiction-specific API providers
2. **Retry Logic**: Automatic retry with exponential backoff on failures
3. **Manual Review**: Queue for manual verification when API verification fails
4. **Result Processing**: Standardized result format with confidence scoring

## Usage

### Basic License Verification

```typescript
import { LicenseVerificationService } from './lib/license-verification'

const service = new LicenseVerificationService()

const licenseInfo = {
	licenseNumber: 'MD123456',
	jurisdiction: 'US-CA',
	practitionerName: 'Dr. John Smith',
	licenseType: 'Medical Doctor',
	expiryDate: new Date('2025-12-31'),
}

const result = await service.verifyLicense(licenseInfo)
console.log(result.status) // 'verified', 'failed', 'pending', or 'manual_review'
```

### Bulk Verification

```typescript
const licenses = [
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
]

const results = await service.bulkVerify(licenses)
```

### License Status Check

```typescript
const status = await service.getLicenseStatus('MD123456', 'US-CA')
if (status) {
	console.log(`License is ${status.isActive ? 'active' : 'inactive'}`)
}
```

## API Endpoints

### POST /license-verification/verify

Verify a single license.

**Request Body:**

```json
{
	"licenseNumber": "MD123456",
	"jurisdiction": "US-CA",
	"practitionerName": "Dr. John Smith",
	"licenseType": "Medical Doctor",
	"expiryDate": "2025-12-31T00:00:00.000Z"
}
```

**Response:**

```json
{
	"status": "verified",
	"details": {
		"provider": "california",
		"confidence": 0.95,
		"matchScore": 0.95
	},
	"timestamp": "2025-01-15T10:30:00.000Z"
}
```

### POST /license-verification/verify/bulk

Verify multiple licenses (max 50 per request).

**Request Body:**

```json
{
	"licenses": [
		{
			"licenseNumber": "MD123456",
			"jurisdiction": "US-CA",
			"practitionerName": "Dr. John Smith",
			"licenseType": "Medical Doctor"
		}
	]
}
```

### GET /license-verification/status/{licenseNumber}/{jurisdiction}

Get current license status.

**Response:**

```json
{
	"isValid": true,
	"isActive": true,
	"expiryDate": "2025-12-31T00:00:00.000Z",
	"practitionerName": "Dr. John Smith",
	"licenseType": "Medical Doctor",
	"specialties": ["Internal Medicine"],
	"lastUpdated": "2025-01-15T10:30:00.000Z"
}
```

### GET /license-verification/jurisdictions

Get list of supported jurisdictions.

**Response:**

```json
{
	"jurisdictions": ["US", "US-CA", "US-TX", "US-FL", "GB", "CA-ON"]
}
```

## Supported Jurisdictions

### United States

- **Federal**: NPDB (National Practitioner Data Bank)
- **States**: California, Texas, Florida (more can be added)

### International

- **United Kingdom**: General Medical Council (GMC)
- **Canada**: College of Physicians and Surgeons of Ontario (CPSO)

## Configuration

### API Providers

Each provider is configured with:

- Base URL for API endpoints
- Timeout settings
- Retry configuration
- Supported jurisdictions

### Retry Configuration

```typescript
{
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2
}
```

## Error Handling

The service uses custom error types:

```typescript
class LicenseVerificationError extends Error {
  constructor(
    message: string,
    public code: string,
    public provider?: string,
    public details?: Record<string, any>
  )
}
```

Common error codes:

- `NO_PROVIDER`: No API provider available for jurisdiction
- `API_ERROR`: API call failed
- `API_RETRY_EXHAUSTED`: All retry attempts failed
- `VERIFICATION_ERROR`: General verification error

## Manual Review Queue

When API verification fails, licenses are automatically queued for manual review:

```typescript
const queue = new VerificationQueue()

// Get pending requests
const pending = await queue.getPendingRequests('high')

// Assign request to reviewer
await queue.assignRequest(requestId, 'reviewer@example.com')

// Complete manual review
await queue.completeRequest(requestId, 'verified', { notes: 'Verified via phone call' })
```

## Testing

Run the test suite:

```bash
npm test -- license-verification
```

The tests cover:

- Service functionality
- API provider management
- Queue operations
- API endpoint integration

## Future Enhancements

1. **OCR Integration**: Document scanning and OCR for license images
2. **Real-time Notifications**: WebSocket notifications for verification status updates
3. **Advanced Matching**: Fuzzy name matching and similarity scoring
4. **Caching**: Redis-based caching for frequently verified licenses
5. **Analytics**: Verification success rates and performance metrics
6. **Additional Providers**: More jurisdiction-specific API integrations

## Security Considerations

- API keys are stored securely using environment variables
- All API calls use HTTPS
- Sensitive data is not logged
- Rate limiting prevents API abuse
- Audit trail maintains verification history
