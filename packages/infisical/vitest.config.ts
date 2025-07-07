import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		coverage: {
			provider: 'v8', // or 'istanbul'
			reporter: ['text', 'json', 'html'],
			include: ['src/**/*.ts'],
			exclude: [
				'src/test/**/*',
				'src/**/*.types.ts', // Assuming types don't need coverage
				'src/index.ts', // Typically exports, might not have direct testable logic
			],
		},
		// If you have path aliases in tsconfig.json, configure them here if needed
		// resolve: {
		//   alias: {
		//     '@': './src', // Example alias
		//   },
		// },
	},
})
