import { env } from 'cloudflare:workers'
import { WorkerMailer } from 'worker-mailer'

// Connect to SMTP server
const mailer = async () =>
	await WorkerMailer.connect({
		credentials: {
			username: env.SMTP_USER,
			password: env.SMTP_PASSWORD,
		},
		authType: 'plain',
		host: env.SMTP_HOST,
		port: 2525,
		secure: false,
	})

export const emailService = {
	send: async ({
		to,
		subject,
		html,
	}: {
		to: { name: string; email: string }
		subject: string
		html: string
	}) => {
		const workerMailer = await mailer()
		await workerMailer.send({
			from: { name: env.FROM_NAME, email: env.FROM_EMAIL },
			to,
			subject,
			html,
		})
	},
}
