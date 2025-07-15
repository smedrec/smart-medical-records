import { FAQSection } from "./faq-section";

export const FAQ = () => {
	return (
		<section id="faq" className="container py-24 sm:py-32">
			<div className="flex min-h-screen w-full items-start justify-center text-foreground">
				<FAQSection />
			</div>
		</section>
	);
};
