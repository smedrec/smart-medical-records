import type { AuditPreset } from './types.js'

/**
 * Predefined audit event configurations for common use cases
 */
export const AUDIT_PRESETS: Record<string, AuditPreset> = {
	// Authentication events
	authentication: {
		name: 'Authentication Events',
		action: 'auth.generic',
		dataClassification: 'INTERNAL',
		requiredFields: ['principalId', 'sessionContext'],
		defaultValues: {
			retentionPolicy: 'auth-logs-1-year',
		},
	},

	// FHIR resource access
	fhir_access: {
		name: 'FHIR Resource Access',
		action: 'fhir.resource.access',
		dataClassification: 'PHI',
		requiredFields: ['principalId', 'targetResourceType', 'targetResourceId'],
		defaultValues: {
			retentionPolicy: 'hipaa-6-years',
		},
		validation: {
			maxStringLength: 5000,
			requiredFields: ['timestamp', 'action', 'status', 'principalId', 'targetResourceType'],
		},
	},

	// System operations
	system: {
		name: 'System Operations',
		action: 'system.operation',
		dataClassification: 'INTERNAL',
		requiredFields: ['action', 'status'],
		defaultValues: {
			retentionPolicy: 'system-logs-2-years',
		},
	},

	// Data operations
	data_operation: {
		name: 'Data Operations',
		action: 'data.operation',
		dataClassification: 'CONFIDENTIAL',
		requiredFields: ['principalId', 'targetResourceType', 'targetResourceId'],
		defaultValues: {
			retentionPolicy: 'data-ops-3-years',
		},
	},

	// Administrative actions
	admin: {
		name: 'Administrative Actions',
		action: 'admin.action',
		dataClassification: 'CONFIDENTIAL',
		requiredFields: ['principalId', 'organizationId'],
		defaultValues: {
			retentionPolicy: 'admin-logs-7-years',
		},
	},

	// Security events
	security: {
		name: 'Security Events',
		action: 'security.event',
		dataClassification: 'CONFIDENTIAL',
		requiredFields: ['principalId', 'sessionContext'],
		defaultValues: {
			retentionPolicy: 'security-logs-7-years',
		},
	},

	// Compliance events
	compliance: {
		name: 'Compliance Events',
		action: 'compliance.event',
		dataClassification: 'CONFIDENTIAL',
		requiredFields: ['principalId', 'action', 'outcomeDescription'],
		defaultValues: {
			retentionPolicy: 'compliance-logs-10-years',
		},
	},

	// Practitioner management
	practitioner: {
		name: 'Practitioner Management',
		action: 'practitioner.management',
		dataClassification: 'CONFIDENTIAL',
		requiredFields: ['principalId', 'targetResourceId'],
		defaultValues: {
			retentionPolicy: 'practitioner-logs-permanent',
		},
	},
}

/**
 * Get a preset by name
 */
export function getPreset(name: string): AuditPreset | undefined {
	return AUDIT_PRESETS[name]
}

/**
 * List all available presets
 */
export function listPresets(): string[] {
	return Object.keys(AUDIT_PRESETS)
}

/**
 * Create a custom preset
 */
export function createPreset(name: string, preset: AuditPreset): void {
	AUDIT_PRESETS[name] = preset
}
