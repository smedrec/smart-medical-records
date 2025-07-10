import { SendMail } from '@repo/send-mail'

let emailInstance: SendMail | undefined = undefined

function initializeEmail() {
	if (!emailInstance) {
		emailInstance = new SendMail('mail')
	}
	return emailInstance
}

function getEmailInstance() {
	if (!emailInstance) {
		throw new Error('Audit not initialized. Call initializeAudit first.')
	}
	return emailInstance
}

export { initializeEmail, getEmailInstance }
