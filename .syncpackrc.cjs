// @ts-check
/** @type {import("syncpack").RcFile} */
const config = {
	indent: '\t',
	lintFormatting: false, // handled by prettier
	versionGroups: [
		{
			label: 'local packages',
			packages: ['**'],
			dependencies: ['@repo/*'],
			dependencyTypes: ['!local'], // Exclude the local package itself
			pinVersion: 'workspace:*',
		},
		{
			label: 'pin typescript for eslint',
			dependencies: ['typescript'],
			pinVersion: '5.5.4',
		},
		{
			label: `pin eslint (v9+) and its plugins`,
			dependencies: [
				'eslint',
				'@types/eslint',
				'eslint-config-prettier',
				// 'eslint-plugin-react-hooks', // Removed as it's React-specific
				'eslint-plugin-unused-imports',
				'@typescript-eslint/eslint-plugin',
				'@typescript-eslint/parser',
			],
			// snapTo removes it from syncpack update list, which is the main goal
			snapTo: ['@repo/eslint-config'],
		},
	],
	semverGroups: [
		{
			label: 'pin all deps',
			range: '',
			dependencies: ['**'],
			packages: ['**'],
		},
	],
}

module.exports = config
