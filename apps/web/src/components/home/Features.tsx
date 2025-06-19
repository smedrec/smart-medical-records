import { BentoGrid } from '@/components/home/bento-grid'
import { CheckCircle, Clock, Globe, Star, TrendingUp, Video } from 'lucide-react'

import type { BentoItem } from '@/components/home/bento-grid'

const itemsSample: BentoItem[] = [
	{
		title: 'Analytics Dashboard',
		meta: 'v2.4.1',
		description: 'Real-time metrics with AI-powered insights and predictive analytics',
		icon: <TrendingUp className="w-4 h-4 text-blue-500" />,
		status: 'Live',
		tags: ['Statistics', 'Reports', 'AI'],
		colSpan: 2,
		hasPersistentHover: true,
	},
	{
		title: 'Task Manager',
		meta: '84 completed',
		description: 'Automated workflow management with priority scheduling',
		icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
		status: 'Updated',
		tags: ['Productivity', 'Automation'],
	},
	{
		title: 'Media Library',
		meta: '12GB used',
		description: 'Cloud storage with intelligent content processing',
		icon: <Video className="w-4 h-4 text-purple-500" />,
		tags: ['Storage', 'CDN'],
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
			<BentoGrid items={itemsSample} />
		</section>
	)
}
