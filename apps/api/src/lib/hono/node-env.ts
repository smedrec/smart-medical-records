import type { MiddlewareHandler } from 'hono'

// This middleware is used to expose the process.env to the hono context
// in a node.js environment.
export const nodeEnv = (): MiddlewareHandler => {
	return async (c, next) => {
		c.env = {
			...c.env,
			...process.env,
		}
		await next()
	}
}
