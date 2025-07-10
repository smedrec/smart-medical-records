import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
	lang: 'en-US',

	title: 'SMEDREC',
	description: 'Smart Medical Records',

	theme: defaultTheme({
		logo: 'https://vuejs.press/images/hero.png',

		navbar: ['/', '/get-started', '/agents/', '/development/'],

		sidebar: [
			{
				text: 'Introduction',
				children: ['/get-started.md'],
			},
			{
				text: 'AI Agents',
				children: [
					'/agents/fhir-test.md',
					'/agents/assistant-agent.md',
					'/agents/patient-report-agent.md',
					'/agents/scheduling-agent.md',
				],
			},
			{
				text: 'Development',
				children: ['/development/'], // VuePress resolves this to /development/README.md
			},
			{
				title: 'MCP FHIR Server', // Title for the sidebar group
				collapsable: false, // Optional: whether the group is collapsable
				children: [
					'/mcp-fhir-server/', // Link to README.md in mcp-fhir-server
					'/mcp-fhir-server/authentication.md',
					'/mcp-fhir-server/fhir-client.md',
					'/mcp-fhir-server/mcp-tools.md',
					'/mcp-fhir-server/security.md',
					'/mcp-fhir-server/deployment.md',
				],
			},
			{
				text: 'Applications',
				children: ['/apps/api.md', '/apps/audit.md'],
			},
			{
				text: 'Packages',
				children: [
					'/packages/audit.md',
					'/packages/auditdb.md',
					'/packages/mailer.md',
					'/packages/cerbos.md',
				],
			},
			{
				text: 'Databases',
				children: ['/databases/transparent-encryption.md'],
			},
		],
	}),

	bundler: viteBundler(),
})
