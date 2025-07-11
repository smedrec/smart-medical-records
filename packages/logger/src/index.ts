import pino from 'pino'

import { Sentry } from './sentry/instrument.js'

import type { DestinationStream, LogFn } from 'pino'
import type { LogEntry } from './types.js'

// Local utility function to avoid circular dependency
function parseBooleanFromText(value: string | undefined | null): boolean {
	if (!value) return false
	const normalized = value.toLowerCase().trim()
	return normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on'
}

// Custom destination that maintains recent logs in memory
/**
 * Class representing an in-memory destination stream for logging.
 * Implements DestinationStream interface.
 */
class InMemoryDestination implements DestinationStream {
	private logs: LogEntry[] = []
	private maxLogs = 1000 // Keep last 1000 logs
	private stream: DestinationStream | null

	/**
	 * Constructor for creating a new instance of the class.
	 * @param {DestinationStream|null} stream - The stream to assign to the instance. Can be null.
	 */
	constructor(stream: DestinationStream | null) {
		this.stream = stream
	}

	/**
	 * Writes a log entry to the memory buffer and forwards it to the pretty print stream if available.
	 *
	 * @param {string | LogEntry} data - The data to be written, which can be either a string or a LogEntry object.
	 * @returns {void}
	 */
	write(data: string | LogEntry): void {
		// Parse the log entry if it's a string
		let logEntry: LogEntry
		let stringData: string

		if (typeof data === 'string') {
			stringData = data
			try {
				logEntry = JSON.parse(data)
			} catch (e) {
				// If it's not valid JSON, just pass it through
				if (this.stream) {
					this.stream.write(data)
				}
				return
			}
		} else {
			logEntry = data
			stringData = JSON.stringify(data)
		}

		// Add timestamp if not present
		if (!logEntry.time) {
			logEntry.time = Date.now()
		}

		// Filter out service registration logs unless in debug mode
		const isDebugMode = (process?.env?.LOG_LEVEL || '').toLowerCase() === 'debug'
		const isLoggingDiagnostic = Boolean(process?.env?.LOG_DIAGNOSTIC)

		if (isLoggingDiagnostic) {
			// When diagnostic mode is on, add a marker to every log to see what's being processed
			logEntry.diagnostic = true
		}

		if (!isDebugMode) {
			// Check if this is a service or agent log that we want to filter
			if (logEntry.agentName && logEntry.agentId) {
				const msg = logEntry.msg || ''
				// Filter only service/agent registration logs, not all agent logs
				if (
					typeof msg === 'string' &&
					(msg.includes('registered successfully') ||
						msg.includes('Registering') ||
						msg.includes('Success:') ||
						msg.includes('linked to') ||
						msg.includes('Started'))
				) {
					if (isLoggingDiagnostic) {
						console.error('Filtered log:', stringData)
					}
					// This is a service registration/agent log, skip it
					return
				}
			}
		}

		// Add to memory buffer
		this.logs.push(logEntry)

		// Maintain buffer size
		if (this.logs.length > this.maxLogs) {
			this.logs.shift()
		}

		// Forward to pretty print stream if available
		if (this.stream) {
			this.stream.write(stringData)
		}
	}

	/**
	 * Retrieves the recent logs from the system.
	 *
	 * @returns {LogEntry[]} An array of LogEntry objects representing the recent logs.
	 */
	recentLogs(): LogEntry[] {
		return this.logs
	}

	/**
	 * Clears all logs from memory.
	 *
	 * @returns {void}
	 */
	clear(): void {
		this.logs = []
	}
}

const customLevels: Record<string, number> = {
	fatal: 60,
	error: 50,
	warn: 40,
	info: 30,
	log: 29,
	progress: 28,
	success: 27,
	debug: 20,
	trace: 10,
} as const // Use "as const" to get literal types for keys

type CustomLevel = keyof typeof customLevels

const raw = parseBooleanFromText(process?.env?.LOG_JSON_FORMAT) || false

// Set default log level to info to allow regular logs, but still filter service logs
const isDebugMode = (process?.env?.LOG_LEVEL || '').toLowerCase() === 'debug'
const effectiveLogLevel = isDebugMode ? 'debug' : process?.env?.DEFAULT_LOG_LEVEL || 'info'

// Create a function to generate the pretty configuration
const createPrettyConfig = () => ({
	colorize: true,
	translateTime: 'yyyy-mm-dd HH:MM:ss',
	ignore: 'pid,hostname',
	levelColors: {
		60: 'red', // fatal
		50: 'red', // error
		40: 'yellow', // warn
		30: 'blue', // info
		29: 'green', // log
		28: 'cyan', // progress
		27: 'greenBright', // success
		20: 'magenta', // debug
		10: 'grey', // trace
		'*': 'white', // default for any unspecified level
	},
	customPrettifiers: {
		level: (inputData: any) => {
			let level
			if (typeof inputData === 'object' && inputData !== null) {
				level = inputData.level || inputData.value
			} else {
				level = inputData
			}

			const levelNames: Record<number, string> = {
				10: 'TRACE',
				20: 'DEBUG',
				27: 'SUCCESS',
				28: 'PROGRESS',
				29: 'LOG',
				30: 'INFO',
				40: 'WARN',
				50: 'ERROR',
				60: 'FATAL',
			}

			if (typeof level === 'number') {
				return levelNames[level] || `LEVEL${level}`
			}

			if (level === undefined || level === null) {
				return 'UNKNOWN'
			}

			return String(level).toUpperCase()
		},
		// Add a custom prettifier for error messages
		msg: (msg: string | object) => {
			if (typeof msg === 'string') {
				// Replace "ERROR (TypeError):" pattern with just "ERROR:"
				return msg.replace(/ERROR \([^)]+\):/g, 'ERROR:')
			}
			return JSON.stringify(msg)
		},
	},
	messageFormat: '{msg}',
})

const createStream = async () => {
	if (raw) {
		return undefined
	}
	// dynamically import pretty to avoid importing it in the browser
	const pretty = await import('pino-pretty')
	return pretty.default(createPrettyConfig())
}

// Create options with appropriate level
const options: pino.LoggerOptions<CustomLevel> = {
	level: effectiveLogLevel as CustomLevel, // Use more restrictive level unless in debug mode
	customLevels,
	hooks: {
		logMethod(
			inputArgs: [string | Record<string, unknown>, ...unknown[]],
			method: pino.LogFn
		): void {
			const [arg1, ...rest] = inputArgs
			if (process.env.SENTRY_LOGGING !== 'false') {
				if (arg1 instanceof Error) {
					Sentry.captureException(arg1)
				} else {
					for (const item of rest) {
						if (item instanceof Error) {
							Sentry.captureException(item)
						}
					}
				}
			}

			const formatError = (err: Error) => ({
				message: `(${err.name}) ${err.message}`,
				stack: err.stack?.split('\n').map((line) => line.trim()),
			})

			// The first argument to logMethod. inputArgs is [any, ...any[]]
			const firstRealArg = inputArgs[0]
			const restArgs = inputArgs.slice(1)

			if (firstRealArg instanceof Error) {
				// logger.info(new Error("foo"))
				// Becomes: pino.info({ err: ErrorDetails }, "Error message");
				method({ err: formatError(firstRealArg) }, `(${firstRealArg.name}) ${firstRealArg.message}`)
			} else if (typeof firstRealArg === 'object' && firstRealArg !== null) {
				// logger.info({ a: 1 }, "message %s", "val")
				// Or logger.info({ a: 1, err: new Error("...") })
				// Becomes: pino.info({ a: 1 }, "message %s", "val");
				// Or pino.info({ a: 1, err: ErrorDetails }, "Error message if not in obj");
				let message = ''
				const formattingArgs = []
				let autoMessageFromError = ''

				if (firstRealArg.err instanceof Error) {
					// If error is embedded, ensure its message contributes if no other message part exists
					autoMessageFromError = `(${firstRealArg.err.name}) ${firstRealArg.err.message}`
				}

				for (const item of restArgs) {
					if (typeof item === 'string') {
						message += (message ? ' ' : '') + item
					} else {
						// Non-string arguments are formatting arguments for pino (e.g., %s, %d, %o)
						formattingArgs.push(item)
					}
				}

				const finalMessage = message.trim() || autoMessageFromError

				if (finalMessage || formattingArgs.length > 0) {
					method(firstRealArg, finalMessage, ...formattingArgs)
				} else {
					// Only an object was passed, e.g. logger.info({a:1})
					method(firstRealArg)
				}
			} else {
				// logger.info("message %s", "val", {obj: "val"})
				// Or logger.info("message", new Error("foo"))
				// Becomes: pino.info({obj: "val"}, "message %s", "val")
				// Or pino.info({err: ErrorDetails}, "message (ErrorName) ErrorMessage")

				const messageParts: unknown[] = []
				const context: Record<string, unknown> = {}
				let hasContext = false

				// First arg is part of the message if it's not an object
				messageParts.push(firstRealArg)

				for (const item of restArgs) {
					if (item instanceof Error) {
						Object.assign(context, { err: formatError(item) })
						// Append error message to main message string as pino does not automatically do this
						// when err is in context but not the primary subject.
						messageParts.push(`(${item.name}) ${item.message}`)
						hasContext = true
					} else if (typeof item === 'object' && item !== null) {
						Object.assign(context, item)
						hasContext = true
					} else {
						messageParts.push(item)
					}
				}

				// Construct the message string from all non-object parts
				// Any remaining objects are in 'context'
				const messageStr = messageParts
					.filter((p) => typeof p !== 'object' || p === null || p === undefined) // filter out context objects already handled
					.map((p) => String(p))
					.join(' ')

				if (hasContext) {
					method(context, messageStr)
				} else {
					method(messageStr)
				}
			}
		},
	},
}

// allow runtime logger to inherent options set here
const createLogger = (bindings: Record<string, unknown> | boolean = false) => {
	const opts: pino.LoggerOptions<CustomLevel> = { ...options }
	if (typeof bindings === 'object' && bindings !== null) {
		opts.base = bindings
		opts.transport = {
			target: 'pino-pretty',
			options: { colorize: true, translateTime: 'SYS:standard', ignore: 'pid,hostname' },
		}
	} else if (bindings === true) {
		opts.transport = {
			target: 'pino-pretty',
			options: { colorize: true, translateTime: 'SYS:standard', ignore: 'pid,hostname' },
		}
	}
	const newLogger = pino<CustomLevel>(opts)
	return newLogger
}

// Create basic logger initially
let logger: pino.Logger<CustomLevel> | LoggerWithClear = pino<CustomLevel>(options)

type LoggerWithClear = pino.Logger<CustomLevel> & {
	clear: () => void
}

const pinoDestinationSymbol = Symbol.for('pino-destination')

// Function to enhance a logger instance
function enhanceLoggerWithClear(
	loggerInstance: pino.Logger<CustomLevel>,
	destination: InMemoryDestination
): LoggerWithClear {
	const enhancedLogger = loggerInstance as pino.Logger<CustomLevel> & {
		clear?: () => void
	} as LoggerWithClear
	;(enhancedLogger as any)[pinoDestinationSymbol] = destination
	enhancedLogger.clear = () => {
		const dest = (enhancedLogger as any)[pinoDestinationSymbol] as InMemoryDestination | undefined
		if (dest instanceof InMemoryDestination) {
			dest.clear()
		}
	}
	return enhancedLogger
}

// Enhance logger with custom destination in Node.js environment
if (typeof process !== 'undefined') {
	let stream: DestinationStream | null = null

	if (!raw) {
		try {
			// eslint-disable-next-line @typescript-eslint/no-require-imports
			const pretty = require('pino-pretty')
			stream = pretty.default ? pretty.default(createPrettyConfig()) : null
		} catch (e) {
			void createStream().then((prettyStream) => {
				const destination = new InMemoryDestination(prettyStream || null)
				const newLoggerBase = pino<CustomLevel>(options, destination)
				logger = enhanceLoggerWithClear(newLoggerBase, destination)
			})
		}
	}

	if (stream !== null || raw) {
		const destination = new InMemoryDestination(stream)
		const newLoggerBase = pino<CustomLevel>(options, destination)
		logger = enhanceLoggerWithClear(newLoggerBase, destination)
	}
}

export { createLogger, logger }

export default logger
