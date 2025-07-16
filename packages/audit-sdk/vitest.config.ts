import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		setupFiles: ['./src/__tests__/setup.ts'],
		testTimeout: 10000,
		hookTimeout: 10000,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: ['node_modules/', 'dist/', 'examples/', '**/*.test.ts', '**/*.spec.ts'],
		},
	},
})
