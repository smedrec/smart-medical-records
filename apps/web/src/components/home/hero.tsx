import { HeroSection } from "@/components/home/hero-section";

export const Hero = () => {
	return (
		<HeroSection
			title="Smart Medical Record"
			subtitle={{
				regular: "Intelligent healthcare ",
				gradient: "cross-disciplinary patient care",
			}}
			description="empowering healthcare providers to deliver better outcomes."
			ctaText="Get Started"
			ctaHref="/signup"
			bottomImage={{
				light: "https://www.launchuicomponents.com/app-light.png",
				dark: "https://www.launchuicomponents.com/app-dark.png",
			}}
			gridOptions={{
				angle: 65,
				opacity: 0.4,
				cellSize: 50,
				lightLineColor: "#4a4a4a",
				darkLineColor: "#2a2a2a",
			}}
		/>
	);
};
