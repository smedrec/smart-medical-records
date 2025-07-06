import { redactUrl } from './url.js'

import type { Context } from 'hono'
import type { HonoApp } from '../types.js'

export interface LogDataRequest {
	url: string
	method: string
	path: string
	/** Hono route for the request */
	routePath: string
	/* URL search params */
	searchParams: string
	headers: string
	/** Eyeball IP address of the request */
	ip?: string
	timestamp: string
}

/**
 * Get logdata from request
 */
export function getRequestLogData<T extends HonoApp>(
	c: Context<T>,
	requestStartTimestamp: number
): LogDataRequest {
	const redactedUrl = redactUrl(c.req.url)
	return {
		url: redactedUrl.toString(),
		method: c.req.method,
		path: c.req.path,
		routePath: c.req.routePath,
		searchParams: redactedUrl.searchParams.toString(),
		headers: (() => {
			const obj: Record<string, string> = {};
			c.req.raw.headers.forEach((value, key) => {
				obj[key] = value;
			});
			return JSON.stringify(obj);
		})(),
		ip:
			c.req.header('cf-connecting-ip') ||
			c.req.header('x-real-ip') ||
			c.req.header('x-forwarded-for'),
		timestamp: new Date(requestStartTimestamp).toISOString(),
	}
}
