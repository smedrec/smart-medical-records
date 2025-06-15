import path from 'node:path'
import { defineWorkersProject } from '@cloudflare/vitest-pool-workers/config'
import { env } from 'cloudflare:workers'

const mode = env.ENVIRONMENT || 'development'

export default defineWorkersProject({
	test: {
		poolOptions: {
			workers: {
				wrangler: { configPath: `${__dirname}/wrangler.jsonc` },
				miniflare: {
					bindings: {
						ENVIRONMENT: 'VITEST',
					},
				},
			},
		},
	},
	/**
	 * In development, we need to use Node.js's postgres package instead of the cloudflare one.
	 * https://github.com/remix-run/remix/issues/9245#issuecomment-2179517678
	 * https://vite.dev/config/ssr-options.html#ssr-noexternal
	 */
	ssr: {
		...(mode === 'development' && {
			noExternal: ['postgres'],
		}),
	},
	resolve: {
		alias: {
			...(mode === 'development' && {
				postgres: path.resolve(__dirname, '../../packages/db/node_modules/postgres/src/index.js'),
			}),
		},
	},
})
