"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";
import { useState } from "react";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.List
		ref={ref}
		className={cn(
			"inline-flex h-10 items-center justify-center rounded-md p-1 text-muted-foreground",
			className,
		)}
		{...props}
	/>
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Trigger
		ref={ref}
		className={cn(
			"inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 font-medium text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border data-[state=active]:text-foreground",
			className,
		)}
		{...props}
	/>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Content
		ref={ref}
		className={cn(
			"mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
			className,
		)}
		{...props}
	/>
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

type ViewType = "general" | "icons" | "library";

interface FAQItem {
	question: string;
	answer: string;
	id: string;
}

interface FAQSection {
	category: string;
	items: FAQItem[];
}

interface FAQAccordionProps {
	category: string;
	items: FAQItem[];
}

const FAQ_SECTIONS: Record<ViewType, FAQSection> = {
	general: {
		category: "General",
		items: [
			{
				id: "what-is",
				question: "What is ShapeX UI?",
				answer:
					"ShapeX UI is a comprehensive design system and UI kit that helps designers and developers create consistent, beautiful interfaces.",
			},
			{
				id: "why-need",
				question: "Why do I need a UI kit?",
				answer:
					"A UI kit helps maintain consistency across your projects, speeds up your workflow, and ensures best practices in design and development.",
			},
			{
				id: "what does it offer",
				question: "What is this UI library, and what does it offer?",
				answer:
					"This UI library is built on top of ShadCN UI and includes 30+ pre-designed components such as headers, footers, login forms, sign-up forms, FAQs, CTAs, contact sections, and more. It allows developers to quickly build high-quality user interfaces with ease.",
			},
			{
				id: "tech stack",
				question: "Is this library compatible with my project’s tech stack?",
				answer:
					"Yes, the library is compatible with modern JavaScript frameworks like React.js and Next.js. It is designed to integrate seamlessly with Tailwind CSS, as it is built on ShadCN UI principles.",
			},
			{
				id: "design needs",
				question: "Can I customize the components to fit my design needs?",
				answer:
					"Absolutely! All components are fully customizable and allow you to tweak styles, variants, and layouts using Tailwind CSS or additional configurations.",
			},
			{
				id: "dark mode",
				question: "Does this library support dark mode?",
				answer:
					"Yes, the library fully supports dark mode out of the box. You can toggle between light and dark themes or configure the components to match your application's theme.",
			},
			{
				id: "mobile-friendly",
				question: "Are the components responsive and mobile-friendly?",
				answer:
					"Yes, all components are designed to be fully responsive, ensuring that they look great on devices of all sizes, from desktops to mobile phones.",
			},
			{
				id: "open-source or paid",
				question: "Is this library open-source or paid?",
				answer: "The library is open-source.",
			},
			{
				id: "request new features",
				question:
					"How can I contribute to or request new features for the library?",
				answer:
					"Contributions are welcome! You can open issues or pull requests on our GitHub repository.",
			},
		],
	},
	icons: {
		category: "Icons",
		items: [
			{
				id: "icon-formats",
				question: "What icon formats are supported?",
				answer:
					"Our icons are available in multiple formats including SVG, PDF, and AI files.",
			},
		],
	},
	library: {
		category: "Library",
		items: [
			{
				id: "library-access",
				question: "How do I access the library?",
				answer:
					"The library is available through our web platform after logging in to your account.",
			},
		],
	},
};

const FAQAccordion: React.FC<FAQAccordionProps> = ({ category, items }) => (
	<div className="">
		<Badge variant={"outline"} className="rounded-md px-6 py-2">
			{category}
		</Badge>
		<Accordion type="single" collapsible className="w-full">
			{items.map((faq) => (
				<AccordionItem key={faq.id} value={faq.id}>
					<AccordionTrigger className="text-left hover:no-underline">
						{faq.question}
					</AccordionTrigger>
					<AccordionContent>{faq.answer}</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	</div>
);

export const FAQSection = () => {
	const [activeView, setActiveView] = useState<ViewType>("general");

	return (
		<div className="container mx-auto max-w-4xl px-4 py-16">
			<header className="mb-12 text-center">
				<p className="mb-2 font-medium text-primary text-sm">FAQs</p>
				<h1 className="mb-4 font-bold text-4xl tracking-tight">
					Frequently asked questions
				</h1>
				<p className="text-muted-foreground text-xl">
					Need help with something? Here are our most frequently asked
					questions.
				</p>
			</header>

			<div className="sticky top-2 flex justify-center">
				<Tabs
					defaultValue="general"
					onValueChange={(value) => setActiveView(value as ViewType)}
					className="mb-8 max-w-xl rounded-xl border bg-background"
				>
					<TabsList className="h-12 w-full justify-start p-1">
						<TabsTrigger value="general">General FAQs</TabsTrigger>
						<TabsTrigger value="icons">UI Icons</TabsTrigger>
						<TabsTrigger value="library">Library</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<FAQAccordion
				category={FAQ_SECTIONS[activeView].category}
				items={FAQ_SECTIONS[activeView].items}
			/>
		</div>
	);
};
