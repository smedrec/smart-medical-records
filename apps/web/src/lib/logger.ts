import { logger } from '@repo/logger'

// Add client-specific context to logs
const clientLogger = {
	info: (msg: string, ...args: any[]) => {
		logger.info({ source: '@smedrec/web' }, msg, ...args)
	},
	error: (msg: string, ...args: any[]) => {
		logger.error({ source: '@smedrec/web' }, msg, ...args)
	},
	warn: (msg: string, ...args: any[]) => {
		logger.warn({ source: '@smedrec/web' }, msg, ...args)
	},
	debug: (msg: string, ...args: any[]) => {
		logger.debug({ source: '@smedrec/web' }, msg, ...args)
	},
}

export default clientLogger
