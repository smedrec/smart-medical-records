/** @type {import("eslint").Linter.Config} */
module.exports = {
	root: true,
	extends: ['@smedrec/eslint-config/library.js'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: true,
	},
}
