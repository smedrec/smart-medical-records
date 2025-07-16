import { CheckCircle, Globe, Star, TrendingUp } from "lucide-react";
import { BentoGrid, type BentoItem } from "./bento-grid";

const smedrecFeatures: BentoItem[] = [
	{
		title: "Task Manager",
		meta: "84 completed",
		description: "Automated workflow management by AI assistants",
		icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
		status: "Updated",
		tags: ["Productivity", "Automation"],
		colSpan: 2,
		hasPersistentHover: true,
	},
	{
		title: "Analytics Dashboard",
		meta: "v0.4.1",
		description:
			"Real-time metrics with AI-powered insights and predictive analytics",
		icon: <TrendingUp className="h-4 w-4 text-blue-500" />,
		status: "Live",
		tags: ["Statistics", "Reports", "AI"],
	},

	{
		title: "FHIR Compatibility",
		meta: "Versions R4 and R5",
		description:
			"Open source FHIR standard provides you an robust data model covering most important healthcare domains.",
		icon: <Star className="h-4 w-4 text-purple-500" />,
		tags: ["healthcare", "standard"],
		colSpan: 2,
	},
	{
		title: "Global Network",
		meta: "6 regions",
		description: "Multi-region deployment with edge computing",
		icon: <Globe className="h-4 w-4 text-sky-500" />,
		status: "Beta",
		tags: ["Infrastructure", "Edge"],
	},
];

export const Features = () => {
	return (
		<section id="features" className="container py-24 sm:py-32">
			<h2 className="font-bold text-3xl md:text-center lg:text-4xl">
				Many{" "}
				<span className="bg-gradient-to-b from-primary/60 to-primary bg-clip-text text-transparent">
					Great Features
				</span>
			</h2>
			<BentoGrid items={smedrecFeatures} />
		</section>
	);
};
