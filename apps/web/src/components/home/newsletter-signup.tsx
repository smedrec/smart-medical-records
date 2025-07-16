"use client";

import confetti from "canvas-confetti";
import { Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useState } from "react";

export interface NewsletterSignupProps {
	onSubmit: (email: string) => Promise<boolean>;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
	onSubmit,
}) => {
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!email) {
			setError("Email is required");
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError("Please enter a valid email address");
			return;
		}

		setIsSubmitting(true);

		try {
			await onSubmit(email);
			setIsSubmitted(true);
			void confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
			});
		} catch (_err) {
			setError("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="container py-24 sm:py-32">
			<AnimatePresence mode="wait">
				{!isSubmitted ? (
					<motion.form
						key="form"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						onSubmit={handleSubmit}
						className="flex flex-col gap-4"
					>
						<div className="flex flex-col items-start justify-center gap-1 overflow-y-hidden">
							<motion.h3
								className="text-center font-bold text-4xl md:text-5xl"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
							>
								Subscribe to our newsletter
							</motion.h3>
							<motion.p
								className="mt-4 mb-8 text-center text-muted-foreground text-xl"
								initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
								animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
								transition={{ delay: 0.4 }}
							>
								Stay up to date with our latest news and updates.
							</motion.p>
						</div>
						<div className="space-y-2">
							<motion.div
								className="flex gap-2"
								initial={{ opacity: 0, filter: "blur(3px)" }}
								animate={{ opacity: 1, filter: "blur(0px)" }}
								transition={{ delay: 0.7 }}
							>
								<input
									type="email"
									id="email"
									placeholder="you@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full rounded-md border px-3 py-2 focus-within:ring-0 focus:outline-white/10 focus-visible:ring-0 "
								/>
								<button
									type="submit"
									disabled={isSubmitting}
									className="relative flex items-center justify-center gap-2 overflow-hidden border-black bg-white px-4 py-2 font-medium text-sm dark:text-black"
								>
									<motion.div
										key="default"
										initial={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className="flex items-center px-4"
									>
										<Send className="h-4 w-4" />
										<span className="ml-2">Subscribe</span>
									</motion.div>
								</button>
							</motion.div>
						</div>
						<AnimatePresence>
							{error && (
								<motion.p
									className="text-red-500 text-sm"
									initial={{ opacity: 0, y: 5 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -5 }}
								>
									{error}
								</motion.p>
							)}
						</AnimatePresence>
					</motion.form>
				) : (
					<motion.div
						key="success"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0 }}
						className="text-center"
					>
						<h2 className="mb-2 font-bold text-2xl text-foreground">
							Thank you for subscribing!
						</h2>
						<p className="text-muted-foreground">
							We've sent a confirmation email to your inbox.
						</p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
