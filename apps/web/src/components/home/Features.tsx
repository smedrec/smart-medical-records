import { BentoGrid } from '@/components/home/bento-grid'
import { CheckCircle, Clock, Globe, Star, TrendingUp } from 'lucide-react'

import type { BentoItem } from '@/components/home/bento-grid'

const smedrecFeatures: BentoItem[] = [
	{
		title: 'Task Manager',
		meta: '84 completed',
		description: 'Automated workflow management by AI assistants',
		icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
		status: 'Updated',
		tags: ['Productivity', 'Automation'],
		colSpan: 2,
		hasPersistentHover: true,
	},
	{
		title: 'Analytics Dashboard',
		meta: 'v0.4.1',
		description: 'Real-time metrics with AI-powered insights and predictive analytics',
		icon: <TrendingUp className="w-4 h-4 text-blue-500" />,
		status: 'Live',
		tags: ['Statistics', 'Reports', 'AI'],
	},

	{
		title: 'FHIR Compatibility',
		meta: 'Versions R4 and R5',
		description:
			'Open source FHIR standard provides you an robust data model covering most important healthcare domains.',
		icon: <Star className="w-4 h-4 text-purple-500" />,
		tags: ['healthcare', 'standard'],
		colSpan: 2,
	},
	{
		title: 'Global Network',
		meta: '6 regions',
		description: 'Multi-region deployment with edge computing',
		icon: <Globe className="w-4 h-4 text-sky-500" />,
		status: 'Beta',
		tags: ['Infrastructure', 'Edge'],
	},
]

export const Features = () => {
	return (
		<section id="features" className="container py-24 sm:py-32">
			<h2 className="text-3xl lg:text-4xl font-bold md:text-center">
				Many{' '}
				<span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
					Great Features
				</span>
			</h2>
			<BentoGrid items={smedrecFeatures} />
		</section>
	)
}
