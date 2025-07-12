import cubeLeg from '/assets/cube-leg.png'

import { Card, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/ui/card'

import { ChartIcon, MagnifierIcon, WalletIcon } from './Icons'

import type { JSX } from 'react'

interface ServiceProps {
	title: string
	description: string
	icon: JSX.Element
}

const serviceList: ServiceProps[] = [
	{
		title: 'Centralized & Standardized Data',
		description:
			'Use the cloud providers (azure. aws, gcp) to create a unified client health data repository fully compatible with FHIR R4/R5 standards to ensure interoperability and data integrity.',
		icon: <ChartIcon />,
	},
	{
		title: 'Enhanced Collaboration',
		description:
			'Streamline and optimize collaboration workflows between Licensed Practitioners and Medical Assistants for efficient patient management.',
		icon: <WalletIcon />,
	},
	{
		title: 'Global Accessibility',
		description:
			'Support 50+ languages, including right-to-left (RTL) scripts,to cater to diverse global healthcare organizations.',
		icon: <MagnifierIcon />,
	},
	{
		title: 'Regulatory Compliance',
		description:
			'Achieve and maintain full HIPAA and GDPR compliance from launch, ensuring robust data privacy and security.',
		icon: <MagnifierIcon />,
	},
	{
		title: 'Intelligent Interface',
		description: 'AI-powered interface to assist users with tasks, insights, and data processing.',
		icon: <MagnifierIcon />,
	},
]

export const Services = () => {
	return (
		<section id="services" className="container py-24 sm:py-32">
			<div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
				<div>
					<h2 className="text-3xl md:text-4xl font-bold">
						<span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
							Patient-Centric{' '}
						</span>
						Services
					</h2>

					<p className="text-muted-foreground text-xl mt-4 mb-8 ">
						To establish an integrated, intelligent healthcare registry that facilitates
						comprehensive, multilingual, and cross-disciplinary patient care, ultimately empowering
						healthcare providers to deliver better outcomes.
					</p>

					<div className="flex flex-col gap-8">
						{serviceList.map(({ icon, title, description }: ServiceProps) => (
							<Card key={title}>
								<CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
									<div className="mt-1 bg-primary/20 p-1 rounded-2xl">{icon}</div>
									<div>
										<CardTitle>{title}</CardTitle>
										<CardDescription className="text-md mt-2">{description}</CardDescription>
									</div>
								</CardHeader>
							</Card>
						))}
					</div>
				</div>

				<img
					src={cubeLeg}
					className="w-[300px] md:w-[500px] lg:w-[600px] object-contain"
					alt="About services"
				/>
			</div>
		</section>
	)
}
