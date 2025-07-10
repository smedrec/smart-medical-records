import type { OperationOutcome } from '@/fhir/v4.0.1'
import type { Validation } from './validation/validation'

function handleError(message: string, err: unknown): string {
	if (err instanceof Error) {
		return `${message}: ${err.message}`
	} else if (typeof err == 'string') {
		return `${message}: ${err}`
	} else {
		return `${message}: An unknown error occurred: ${err}`
	}
}

function handleOperationOutcomeError(operationOutcome: OperationOutcome): Validation {
	const errorMessage = operationOutcome.issue
		? operationOutcome.issue
				.map((issue) => {
					return issue.details?.text ?? 'Unknown error'
				})
				.join('\n')
		: 'Unknown error'

	return {
		message: 'OperationOutcome: ' + errorMessage,
		severity: 'ERROR',
	}
}

export { handleError, handleOperationOutcomeError }
