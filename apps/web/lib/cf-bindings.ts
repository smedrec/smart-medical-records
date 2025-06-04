/**
 * Will only work when being accessed on the server. Obviously, CF bindings are not available in the browser.
 * @returns
 */
export function getBindings() {
	if (import.meta.env.DEV) {
		const proxyPromise = import('wrangler').then(({ getPlatformProxy }) =>
			getPlatformProxy().then((proxy) => proxy.env)
		)
		return proxyPromise as unknown as Cloudflare
	}

	return process.env as unknown as Cloudflare
}
