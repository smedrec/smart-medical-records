// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		environment: 'node', // Hono can run in Node.js
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			include: ['src/**/*.ts'],
			exclude: [
				'src/index.ts',
				'src/types.ts',
				'src/**/*.types.ts',
				'src/**/types.ts',
				'src/test/**/*', // If tests are co-located in src/test
				'src/**/*.test.ts',
				'src/**/*.spec.ts',
			],
		},
	},
})
