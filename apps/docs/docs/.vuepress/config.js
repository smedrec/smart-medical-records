import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
	lang: 'en-US',

	title: 'SMEDREC',
	description: 'Smart Medical Records',

	theme: defaultTheme({
		logo: 'https://vuejs.press/images/hero.png',

		navbar: ['/', '/get-started', '/development/'],
	}),

	bundler: viteBundler(),
})
