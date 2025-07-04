/** @type {import("eslint").Linter.Config} */
module.exports = {
	root: true,
	extends: ['@repo/eslint-config/react.cjs'],
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.ts', '.d.ts', '.tsx', '.js', '.jsx'],
			},
		},
	},
}
