import { createFileRoute } from "@tanstack/react-router";
import { FAQ } from "@/components/home/faq";
import { Features } from "@/components/home/features";
import { Footer } from "@/components/home/footer";
import { Header } from "@/components/home/header";
import { Hero } from "@/components/home/hero";
import { Newsletter } from "@/components/home/newsletter";
import { Pricing } from "@/components/home/pricing";
import { ScrollToTop } from "@/components/home/scroll-to-top";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
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
	);
}
