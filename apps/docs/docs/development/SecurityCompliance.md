# Security Compliance Requirements

## Authentication & Authorization

- **better-auth** implementation in [apps/api/src/lib/better-auth/](mdc:apps/api/src/lib/better-auth/)
- OAuth2.0 + SAML 2.0 support for enterprise clients
- JWT tokens with 15-minute expiration
- Refresh tokens stored in HttpOnly cookies

## Data Protection

- **Encryption at Rest**: AES-256 for all patient records
- **Encryption in Transit**: TLS 1.3 with HSTS headers
- **Key Management**:
  - Rotation every 90 days
  - Storage in Cloudflare KV namespace [auth:encryption-keys]
  - Access limited to internal workers only

## Access Control

- RBAC implementation in [apps/api/src/lib/rbac/](mdc:apps/api/src/lib/rbac/)
- Audit logs for all access attempts
- 90-day retention for access logs
- PII access requires MFA authentication

## Network Security

- Rate limiting at API gateway [packages/hono-helpers/src/middleware/rate-limit.ts](mdc:packages/hono-helpers/src/middleware/rate-limit.ts)
- IP allow-list for internal services
- WAF rules for OWASP Top 10 protection
- DDoS mitigation through Cloudflare Workers

## Compliance Standards

- **HIPAA**:
  - Signed BAA with Cloudflare
  - Audit logs in [apps/api/src/lib/logs/hipaa.ts](mdc:apps/api/src/lib/logs/hipaa.ts)
  - PII handling in [apps/api/src/lib/utils/pii.ts](mdc:apps/api/src/lib/utils/pii.ts)

- **GDPR**:
  - Data subject request handling in [apps/api/src/lib/gdpr/](mdc:apps/api/src/lib/gdpr/)
  - Data minimization policy in [apps/api/src/lib/utils/data-minimization.ts](mdc:apps/api/src/lib/utils/data-minimization.ts)
  - Right to be forgotten implementation in [apps/api/src/routes/patient/delete.ts](mdc:apps/api/src/routes/patient/delete.ts)

## Security Testing

- **SAST**:
  - Run via GitHub Actions on every PR
  - Rules from [packages/eslint-config/src/security.config.ts](mdc:packages/eslint-config/src/security.config.ts)

- **DAST**:
  - OWASP ZAP scans nightly
  - Results in [test/artifacts/zap-reports/](mdc:apps/api/src/test/artifacts/zap-reports/)

- **Penetration Testing**:
  - Quarterly third-party audits
  - Reports stored in [security/penetration-tests/](mdc:security/penetration-tests/)
