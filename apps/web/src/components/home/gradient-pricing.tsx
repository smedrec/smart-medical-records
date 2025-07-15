import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BenefitProps {
	text: string;
	checked: boolean;
}

const Benefit = ({ text, checked }: BenefitProps) => {
	return (
		<div className="flex items-center gap-3">
			{checked ? (
				<span className="grid size-4 place-content-center rounded-full bg-primary text-primary-foreground text-sm">
					<Check className="size-3" />
				</span>
			) : (
				<span className="grid size-4 place-content-center rounded-full bg-zinc-200 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
					<X className="size-3" />
				</span>
			)}
			<span className="text-sm text-zinc-600 dark:text-zinc-300">{text}</span>
		</div>
	);
};

interface PricingCardProps {
	tier: string;
	price: string;
	bestFor: string;
	CTA: string;
	benefits: Array<{ text: string; checked: boolean }>;
	className?: string;
}

export const PricingCard = ({
	tier,
	price,
	bestFor,
	CTA,
	benefits,
	className,
}: PricingCardProps) => {
	return (
		<motion.div
			initial={{ filter: "blur(2px)" }}
			whileInView={{ filter: "blur(0px)" }}
			transition={{ duration: 0.5, ease: "easeInOut", delay: 0.25 }}
		>
			<Card
				className={cn(
					"relative h-full w-full overflow-hidden border",
					"dark:border-zinc-700 dark:bg-gradient-to-br dark:from-zinc-950/50 dark:to-zinc-900/80",
					"border-zinc-200 bg-gradient-to-br from-zinc-50/50 to-zinc-100/80",
					"p-6",
					className,
				)}
			>
				<div className="flex flex-col items-center border-zinc-200 border-b pb-6 dark:border-zinc-700">
					<span className="mb-6 inline-block text-zinc-900 dark:text-zinc-50">
						{tier}
					</span>
					<span className="mb-3 inline-block font-medium text-4xl">
						{price}
					</span>
					<span className="bg-gradient-to-br from-zinc-700 to-zinc-900 bg-clip-text text-center text-transparent dark:bg-gradient-to-br dark:from-zinc-200 dark:to-zinc-500">
						{bestFor}
					</span>
				</div>
				<div className="space-y-4 py-9">
					{benefits.map((benefit) => (
						<Benefit key={benefit.text} {...benefit} />
					))}
				</div>
				<Button
					className="w-full"
					variant={tier === "Pro" ? "default" : "ghost"}
				>
					{CTA}
				</Button>
			</Card>
		</motion.div>
	);
};
