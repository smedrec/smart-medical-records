import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true, // Allows use of describe, it, expect, etc., without importing
		environment: 'node', // Specifies the testing environment as Node.js
		coverage: {
			provider: 'v8', // Use V8's built-in coverage
			reporter: ['text', 'json', 'html', 'lcov'], // Output formats for coverage reports
			include: ['src/**/*.ts'], // Files to include in coverage analysis
			exclude: [
				// Files/patterns to exclude from coverage analysis
				'src/test/**/*', // Test files themselves
				'src/**/*.types.ts', // TypeScript definition files
				'src/db/types.ts', // Types file if it only contains type definitions
				'src/index.ts', // Entry point if it only exports modules
			],
			all: true, // Ensure all files in `include` are processed, even if not tested
			lines: 80, // Minimum line coverage percentage
			functions: 80, // Minimum function coverage percentage
			branches: 80, // Minimum branch coverage percentage
			statements: 80, // Minimum statement coverage percentage
		},
	},
})
