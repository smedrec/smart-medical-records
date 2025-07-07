import type { MailerSendOptions } from '@repo/mailer'

/**
 * Defines the structure for an event that triggers sending an email.
 * This event is typically placed onto a queue for asynchronous processing.
 */
export interface SendMailEvent {
	/**
	 * The unique identifier of the principal (e.g., user) initiating the action
	 * or on whose behalf the email is being sent.
	 */
	principalId: string
	/**
	 * The unique identifier of the organization associated with this email event.
	 * This can be used for tenant-specific logic or logging.
	 */
	organizationId: string
	/**
	 * A string describing the action that triggered this email.
	 * For example, "user_registration", "password_reset", "order_confirmation".
	 */
	action: string
	/**
	 * The detailed options for the email to be sent, conforming to the `MailerSendOptions`
	 * interface from the `@repo/mailer` package. This includes recipient(s), subject, body, etc.
	 */
	emailDetails: MailerSendOptions
}
