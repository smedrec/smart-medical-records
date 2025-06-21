import nodemailer from 'nodemailer'

// Connect to SMTP server
const mailer = async () =>
	nodemailer.createTransport({
		host: process.env.SMTP_HOST!,
		port: 2525,
		secure: false,
		pool: true, // ♻️  enable connection pooling
		maxConnections: 5, // optional – defaults to 5
		maxMessages: 100, // optional – defaults to 100
		auth: {
			user: process.env.SMTP_USER!,
			pass: process.env.SMTP_PASSWORD!,
		},
	})

export const email = {
	send: async ({ to, subject, text }: { to: string; subject: string; text: string }) => {
		const workerMailer = await mailer()
		await workerMailer.sendMail({
			//from: { name: env.FROM_NAME, email: env.FROM_EMAIL },
			from: 'SMEDREC <no-reply@smedrec.com>',
			to,
			subject,
			text,
		})
	},
}
