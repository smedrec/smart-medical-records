// vite.config.ts
import path from 'path'
import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	server: {
		port: 3000,
	},
	plugins: [tsconfigPaths(), tailwindcss(), tanstackStart(), cloudflare()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
})
