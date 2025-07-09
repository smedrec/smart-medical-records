import { SendMail } from '@repo/send-mail'

let emailInstance: SendMail | undefined = undefined

export function initializeEmail() {
	if (!emailInstance) {
		emailInstance = new SendMail('mail', process.env.MAIL_REDIS_URL!)
	}
	return emailInstance
}

export function getEmailInstance() {
	if (!emailInstance) {
		throw new Error('Audit not initialized. Call initializeAudit first.')
	}
	return emailInstance
}
