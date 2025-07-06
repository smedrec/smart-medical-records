// vitest.config.ts
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
        'src/index.ts', // or main entry point
        'src/types.ts',
        'src/**/*.types.ts',
        'src/**/types.ts',
        'src/test/**/*',
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
      ],
    },
  },
})
