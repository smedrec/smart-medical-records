import { logMiddleware } from '@/lib/loggingMiddleware'
import { registerGlobalMiddleware } from '@tanstack/react-start'

registerGlobalMiddleware({
	middleware: [logMiddleware],
})
