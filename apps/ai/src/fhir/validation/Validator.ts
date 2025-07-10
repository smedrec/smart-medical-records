import type { RefTypes } from './common-refs'
import type { Validation } from './validation'

export class Validator {
	private validations: Validation[] = []

	public info(message: string, refs?: RefTypes) {
		this.add({
			severity: 'INFO',
			message,
			refs,
		})
	}

	public warn(message: string, refs?: RefTypes) {
		this.add({
			severity: 'WARNING',
			message,
			refs,
		})
	}

	public error(message: string, refs?: RefTypes) {
		this.add({
			severity: 'ERROR',
			message,
			refs,
		})
	}

	public build(): Validation[] {
		return this.validations
	}

	private add(validation: Validation) {
		this.validations.push(validation)
	}
}
