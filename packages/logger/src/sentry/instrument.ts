import * as Sentry from '@sentry/browser'

const dsn =
	process.env.SENTRY_DSN ||
	'https://421b3fd8ebba1a65f871a388558c75c5@o291995.ingest.us.sentry.io/4509609375760385'
if (process.env.SENTRY_LOGGING !== 'false') {
	Sentry.onLoad(() => {
		Sentry.init({
			dsn,
			environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
			tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE ?? '') || 1.0,
			sendDefaultPii: process.env.SENTRY_SEND_DEFAULT_PII === 'true',
		})
	})
}

export { Sentry }
