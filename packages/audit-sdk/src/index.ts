/**
 * @fileoverview SMEDREC Audit SDK - Comprehensive audit logging for healthcare applications
 *
 * This SDK provides a unified interface for audit logging with built-in security,
 * compliance features, and healthcare-specific functionality.
 *
 * @version 1.0.0
 * @author SMEDREC Team
 */

// Re-export core audit functionality
//export * from '@repo/audit'
//export * from '@repo/audit-db'

// SDK-specific exports
export * from './sdk.js'
export * from './presets.js'
export * from './middleware.js'
export * from './compliance.js'
export * from './utils.js'

// Type exports for better developer experience
export type {
	AuditLogEvent,
	AuditEventStatus,
	DataClassification,
	SessionContext,
	PractitionerAuditEvent,
	SystemAuditAction,
	AuthAuditAction,
	DataAuditAction,
	FHIRAuditAction,
	PractitionerAuditAction,
} from '@repo/audit'

export type { ValidationConfig, AuditValidationError, AuditSanitizationError } from '@repo/audit'

// SDK-specific types
export type { AuditSDKConfig, AuditPreset, ComplianceConfig, MiddlewareOptions } from './types.js'

// Main SDK class as default export
export { AuditSDK as default } from './sdk.js'
