import type { RefTypes } from './common-refs'

export type Severity = 'OK' | 'INFO' | 'WARNING' | 'ERROR'

export type Validation = {
	message: string
	severity: Severity
	refs?: RefTypes
}

export function validation(message: string, severity: Severity, refs?: RefTypes): Validation {
	return {
		message,
		severity,
		refs,
	}
}
