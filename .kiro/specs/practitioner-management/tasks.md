# Implementation Plan

- [x] 1. Extend existing auth-db schema for practitioner management
  - Add practitioner-specific tables to existing auth-db schema (license certificates, verification attempts)
  - Create database migrations using existing Drizzle setup in packages/auth-db
  - Extend existing user schema to support practitioner-specific fields (license info, verification status)
  - Create TypeScript interfaces that integrate with existing Better Auth types
  - _Requirements: 1.1, 2.1, 5.1, 6.1, 7.1_

- [x] 2. Extend Cerbos policies for practitioner management permissions
  - Create new Cerbos policies for practitioner license verification and management resources
  - Extend existing practitioner.yaml policy to include license verification actions
  - Add new policies for license certificate resources and verification workflow
  - Update organization.yaml policy to support practitioner management roles
  - Create practitioner-specific middleware using existing Cerbos client integration
  - Add practitioner verification status to existing session management
  - Write unit tests for Cerbos policy validation and middleware
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 3. Leverage existing OIDC provider for enterprise SSO
  - Configure existing Better Auth OIDC provider plugin for healthcare organizations
  - Add SAML support as additional identity provider option
  - Extend existing organization invitation system for practitioner onboarding
  - Create healthcare-specific SSO configuration management
  - Write integration tests for enterprise authentication flows
  - _Requirements: 8.2, 8.5_

- [ ] 4. Develop license verification service
  - Create license verification service with multiple API provider support
  - Implement API clients for major licensing databases (NPI, GMC, etc.)
  - Build retry logic with exponential backoff for API failures
  - Create manual verification queue for fallback scenarios
  - Add license status checking and validation logic
  - Write integration tests with mocked API responses
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 5. Build OCR document processing service
  - Implement OCR service using Tesseract.js for PDF certificate processing
  - Create text extraction and license data parsing functionality
  - Build validation logic to cross-reference OCR results with entered data
  - Implement file upload handling with size and type restrictions
  - Add OCR confidence scoring and error handling
  - Write unit tests for text extraction and validation logic
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 6. Extend existing audit service for practitioner management
  - Leverage existing @repo/audit package and apps/audit application
  - Add practitioner-specific audit event types to existing audit system
  - Create compliance reporting features using existing audit infrastructure
  - Extend existing audit log querying for practitioner verification events
  - Add HIPAA-compliant audit log export capabilities
  - Write unit tests for practitioner audit logging
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 7. Develop practitioner onboarding API endpoints
  - Extend existing Better Auth organization invitation system for practitioner onboarding
  - Create API endpoints for license information submission and validation
  - Build certificate upload and processing endpoints using existing file handling patterns
  - Create practitioner approval/rejection workflow APIs integrated with Better Auth roles
  - Add practitioner status and profile management endpoints
  - Write integration tests for complete onboarding workflow
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 8. Build admin dashboard API endpoints
  - Create API endpoints for pending practitioner approvals using existing organization management
  - Implement practitioner management and role modification APIs with Better Auth integration
  - Build audit log viewing and filtering endpoints leveraging existing audit service
  - Create compliance reporting and export APIs using existing audit infrastructure
  - Add system health and monitoring endpoints
  - Write integration tests for admin functionality
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.5, 7.4, 7.5_

- [ ] 9. Extend existing email service for practitioner notifications
  - Leverage existing @repo/send-mail package for practitioner invitations
  - Build notification templates for various workflow stages using existing email infrastructure
  - Implement email sending for approval/rejection notifications with existing Better Auth email system
  - Add notification preferences and delivery tracking
  - Create admin alerts for failed verifications and system issues
  - Write unit tests for notification service
  - _Requirements: 1.4, 5.4, 5.5_

- [ ] 10. Create FHIR-compatible practitioner resources
  - Extend existing FHIR integration to support Practitioner resources
  - Create FHIR Practitioner resource creation and management
  - Implement license information mapping to FHIR Practitioner qualifications
  - Add FHIR-compliant practitioner search and retrieval endpoints
  - Integrate with existing Smart Client authentication for FHIR operations
  - Write unit tests for FHIR practitioner resource management
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2_

- [ ] 11. Add comprehensive error handling and monitoring
  - Implement structured error handling with custom error classes
  - Create error logging and monitoring integration
  - Build API error response standardization
  - Add request/response logging middleware
  - Implement health check endpoints for all services
  - Write tests for error scenarios and edge cases
  - _Requirements: 3.3, 4.6, 8.4_

- [ ] 12. Create frontend practitioner onboarding interface
  - Build practitioner registration form with license input validation
  - Create certificate upload interface with drag-and-drop functionality
  - Implement real-time verification status display
  - Add progress indicators for multi-step onboarding process
  - Create responsive design for mobile and desktop
  - Write end-to-end tests for user interface workflows
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 4.1, 4.2_

- [ ] 13. Build admin dashboard interface
  - Create practitioner approval dashboard with filtering and search
  - Implement practitioner profile management interface
  - Build audit log viewer with advanced filtering options
  - Create compliance reporting dashboard with export functionality
  - Add real-time notifications for pending approvals
  - Write end-to-end tests for admin workflows
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 7.4, 7.5_

- [ ] 14. Implement security hardening and rate limiting
  - Add rate limiting middleware for all API endpoints
  - Implement CSRF protection for state-changing operations
  - Create input sanitization and validation middleware
  - Add IP-based access restrictions for admin functions
  - Implement session security with secure cookies and timeouts
  - Write security tests for common attack vectors
  - _Requirements: 8.4, 8.5_

- [ ] 15. Add comprehensive testing and quality assurance
  - Create end-to-end test suite covering complete user workflows
  - Implement performance testing for concurrent user scenarios
  - Add security testing for authentication and authorization
  - Create load testing for license verification and OCR processing
  - Build automated testing pipeline with CI/CD integration
  - Write documentation for testing procedures and maintenance
  - _Requirements: All requirements validation_

- [ ] 16. Deploy and configure production environment
  - Set up production database with proper indexing and optimization
  - Configure Redis cluster for high availability
  - Implement SSL/TLS certificates and security headers
  - Set up monitoring and alerting for system health
  - Create backup and disaster recovery procedures
  - Write deployment documentation and runbooks
  - _Requirements: System reliability and compliance_
