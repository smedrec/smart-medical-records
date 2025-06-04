import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from '@tanstack/react-start/config'
import nitroCloudflareBindings from 'nitro-cloudflare-dev'
import { cloudflare } from 'unenv'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	server: {
		preset: 'cloudflare-module',
		unenv: cloudflare,
		modules: [nitroCloudflareBindings],
	},
	vite: {
		plugins: [
			tsConfigPaths({
				projects: ['./tsconfig.json'],
			}),
			tailwindcss(),
		],
	},
})
