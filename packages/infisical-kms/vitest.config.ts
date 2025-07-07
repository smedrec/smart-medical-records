import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true, // Use Vitest globals without importing
		environment: 'node', //  Ensures 'node' environment for tests
		coverage: {
			provider: 'v8', // or 'istanbul'
			reporter: ['text', 'json', 'html'],
			include: ['src/**/*.ts'],
			exclude: [
				'src/test/**/*',
				'src/**/*.types.ts', // Exclude type definition files
				'src/index.ts', // Exclude main export file if it's just re-exporting
			],
		},
		alias: {
			// If you have path aliases in tsconfig.json, configure them here
			// Example: '@/*': './src/*'
		},
	},
})
