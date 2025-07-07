// @ts-check

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tsEslintParser from '@typescript-eslint/parser' // Import the parser

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // This configuration will be merged with configurations found in parent directories
  // (i.e., the root eslint.config.ts).
  {
    files: ['**/*.ts'], // Apply only to TypeScript files in this package
    languageOptions: {
      parser: tsEslintParser, // Explicitly set the parser
      parserOptions: {
        // Override the project setting to point to the local tsconfig.eslint.json
        project: path.resolve(__dirname, 'tsconfig.eslint.json'),
        tsconfigRootDir: __dirname,
        sourceType: 'module', // Ensure this is set, typically inherited
      },
    },
    // We assume plugins like '@typescript-eslint' are inherited globally
    // If not, they might need to be re-declared here as well.
  },
  {
    ignores: ['eslint.config.js'],
  }
]
