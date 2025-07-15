import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-sidebar-border border-t bg-background">
			<div className="container flex items-center justify-between p-4 md:px-6">
				<p className="text-muted-foreground text-xs md:text-sm">
					© {currentYear}{" "}
					<a
						href="/"
						target="_blank"
						rel="noopener noreferrer"
						className={cn(buttonVariants({ variant: "link" }), "inline p-0")}
					>
						José Cordeiro
					</a>
					.
				</p>
				<p className="text-muted-foreground text-xs md:text-sm">
					Developed by{" "}
					<a
						href="https://github.com/joseantcordeiro"
						target="_blank"
						rel="noopener noreferrer"
						className={cn(buttonVariants({ variant: "link" }), "inline p-0")}
					>
						@joseantcordeiro
					</a>
					.
				</p>
			</div>
		</footer>
	);
}
