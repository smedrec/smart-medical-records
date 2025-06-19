'use client'

import RadialOrbitalTimeline from '@/components/home/timeline'
import { Calendar, Clock, Code, FileText, User } from 'lucide-react'

const timelineData = [
	{
		id: 1,
		title: 'Planning',
		date: 'Jan 2024',
		content: 'Project planning and requirements gathering phase.',
		category: 'Planning',
		icon: Calendar,
		relatedIds: [2],
		status: 'completed' as const,
		energy: 100,
	},
	{
		id: 2,
		title: 'Design',
		date: 'Feb 2024',
		content: 'UI/UX design and system architecture.',
		category: 'Design',
		icon: FileText,
		relatedIds: [1, 3],
		status: 'completed' as const,
		energy: 90,
	},
	{
		id: 3,
		title: 'Development',
		date: 'Mar 2024',
		content: 'Core features implementation and testing.',
		category: 'Development',
		icon: Code,
		relatedIds: [2, 4],
		status: 'in-progress' as const,
		energy: 60,
	},
	{
		id: 4,
		title: 'Testing',
		date: 'Apr 2024',
		content: 'User testing and bug fixes.',
		category: 'Testing',
		icon: User,
		relatedIds: [3, 5],
		status: 'pending' as const,
		energy: 30,
	},
	{
		id: 5,
		title: 'Release',
		date: 'May 2024',
		content: 'Final deployment and release.',
		category: 'Release',
		icon: Clock,
		relatedIds: [4],
		status: 'pending' as const,
		energy: 10,
	},
]

export function HowItWorks() {
	return (
		<section id="pricing" className="container py-24 sm:py-32">
			<h2 className="text-3xl md:text-4xl font-bold text-center">
				Get
				<span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
					{' '}
					Unlimited{' '}
				</span>
				Access
			</h2>
			<RadialOrbitalTimeline timelineData={timelineData} />
		</section>
	)
}

export default {
	HowItWorks,
}
