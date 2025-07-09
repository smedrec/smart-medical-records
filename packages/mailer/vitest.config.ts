import { defineProject } from 'vitest/config'

// When not merging with workspace config, defineProject is the default export directly.
export default defineProject({
	test: {
		globals: true,
		environment: 'node', // Mailer package is primarily Node.js based (even worker-mailer runs in a Node-like env for tests)
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			reportsDirectory: './coverage',
			include: ['src/**/*.ts'],
			exclude: [
				'src/**/*.test.ts',
				'src/**/index.ts', // Often just exports, adjust if it has logic
				'src/**/base.ts', // Interfaces, adjust if it has logic
			],
			all: true, // Try to cover all files matching include, not just tested ones
		},
		setupFiles: [], // Add setup files if needed in the future
	},
})
