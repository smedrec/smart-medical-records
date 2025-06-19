import { About } from '@/components/home/About'
import { Cta } from '@/components/home/Cta'
import { FAQ } from '@/components/home/FAQ'
import { Features } from '@/components/home/Features'
import { Footer } from '@/components/home/Footer'
import { Header } from '@/components/home/header'
import { Hero } from '@/components/home/Hero'
import { HowItWorks } from '@/components/home/HowItWorks'
import { Newsletter } from '@/components/home/Newsletter'
import { Pricing } from '@/components/home/Pricing'
import { ScrollToTop } from '@/components/home/ScrollToTop'
import { Services } from '@/components/home/Services'
import { Sponsors } from '@/components/home/Sponsors'
import { Team } from '@/components/home/Team'
import { Testimonials } from '@/components/home/Testimonials'
import { createFileRoute } from '@tanstack/react-router'

import logo from '../logo.svg'

export const Route = createFileRoute('/')({
	component: App,
})

function App() {
	return (
		<div className="flex grow flex-col text-center">
			<Header />
			<Hero />
			<main className="flex grow flex-col items-center justify-center text-[calc(10px+2vmin)]">
				<Features />
				<Pricing />
				<FAQ />
				<Newsletter />
				<Footer />
				<ScrollToTop />
			</main>
		</div>
	)
}
