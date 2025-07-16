import { GitHubIcon } from "@daveyplate/better-auth-ui";
import { Link } from "@tanstack/react-router";
import { LayoutDashboard, LogIn, Menu } from "lucide-react";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useSession } from "@/hooks/auth-hooks";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../mode-toggle";

interface RouteProps {
	href: string;
	label: string;
}

const routeList: RouteProps[] = [
	{
		href: "#features",
		label: "Features",
	},
	{
		href: "#pricing",
		label: "Pricing",
	},
	{
		href: "#faq",
		label: "FAQ",
	},
];

export function Header() {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const { session } = useSession();
	return (
		<header className="sticky top-0 z-50 border-b px-4 py-3 backdrop-blur">
			<div className="container mx-auto flex items-center justify-between">
				<Link to="/" className="flex items-center gap-2">
					<svg
						className="size-5"
						fill="none"
						height="45"
						viewBox="0 0 60 45"
						width="60"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							className="fill-black dark:fill-white"
							clipRule="evenodd"
							d="M0 0H15V45H0V0ZM45 0H60V45H45V0ZM20 0H40V15H20V0ZM20 30H40V45H20V30Z"
							fillRule="evenodd"
						/>
					</svg>
					<span className="hidden md:flex">SMART MEDICAL RECORD</span>
				</Link>

				{/* mobile */}
				<span className="flex md:hidden">
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger className="px-2">
							<Menu
								className="flex h-5 w-5 md:hidden"
								onClick={() => setIsOpen(true)}
							>
								<span className="sr-only">Menu Icon</span>
							</Menu>
						</SheetTrigger>

						<SheetContent side={"left"}>
							<SheetHeader>
								<SheetTitle className="font-bold text-xl">SMEDREC</SheetTitle>
							</SheetHeader>
							<nav className="mt-4 flex flex-col items-center justify-center gap-2">
								{routeList.map(({ href, label }: RouteProps) => (
									<a
										rel="noreferrer noopener"
										key={label}
										href={href}
										onClick={() => setIsOpen(false)}
										className={buttonVariants({ variant: "ghost" })}
									>
										{label}
									</a>
								))}
							</nav>
						</SheetContent>
					</Sheet>
				</span>

				{/* desktop */}
				<nav className="hidden gap-2 md:flex">
					{routeList.map((route: RouteProps) => (
						<a
							rel="noreferrer noopener"
							href={route.href}
							key={route.label}
							className={`text-[17px] ${buttonVariants({
								variant: "ghost",
							})}`}
						>
							{route.label}
						</a>
					))}
				</nav>

				<div className="flex items-center gap-2">
					<a
						href="https://github.com/smedrec/smart-medical-record"
						target="_blank"
						rel="noreferrer"
					>
						<Button
							variant="outline"
							size="icon"
							className="size-8 rounded-full"
						>
							<GitHubIcon />
						</Button>
					</a>

					<ModeToggle />
					{session ? (
						<Link to="/app" className={cn(buttonVariants(), "hidden lg:flex")}>
							<LayoutDashboard className="me-2 h-4 w-4" />
							<span>Dashboard</span>
						</Link>
					) : (
						<Link
							to="/auth/sign-in"
							className={cn(buttonVariants(), "hidden lg:flex")}
						>
							<LogIn className="me-2 h-4 w-4" />
							<span>Sign In</span>
						</Link>
					)}
				</div>
			</div>
		</header>
	);
}
