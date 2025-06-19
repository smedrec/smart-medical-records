import { FAQSection } from '@/components/home/faq-section'

export const FAQ = () => {
	return (
		<section id="faq" className="container py-24 sm:py-32">
			<div className="flex w-full min-h-screen justify-center items-start bg-background text-foreground">
				<FAQSection />
			</div>
		</section>
	)
}
