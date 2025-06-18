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
			'platejs/react': path.resolve(__dirname, 'node_modules/platejs/dist/react'),
			'@platejs/core/react': path.resolve(__dirname, 'node_modules/@platejs/core/dist/react'),
			'@platejs/list/react': path.resolve(__dirname, 'node_modules/@platejs/list/dist/react'),

			// Non-/react base aliases:
			platejs: path.resolve(__dirname, 'node_modules/platejs'),
			'@platejs/core': path.resolve(__dirname, 'node_modules/@platejs/core'),
			'@platejs/list': path.resolve(__dirname, 'node_modules/@platejs/list'),
		},
	},
	build: {
		rollupOptions: {
			external: ['@repo/fhir'],
		},
	},
})
