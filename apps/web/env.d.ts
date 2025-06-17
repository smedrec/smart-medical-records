/* eslint-disable @typescript-eslint/consistent-type-imports */
type LocalEnv = import('./src/context').Env

// Add Env to Cloudflare namespace so that we can access it via
// import { env } from 'cloudflare:workers'
declare namespace Cloudflare {
	interface Env extends LocalEnv {}
}

declare module '*.svg' {
	const content: string
	export default content
}
