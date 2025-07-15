import { createFileRoute } from "@tanstack/react-router";
import { formatDateRange } from "little-date";
import { ChartAreaInteractive } from "@/components/app/chart-area-interactive";

export const Route = createFileRoute("/app/")({
	component: RouteComponent,
});

const events = [
	{
		title: "Team Sync Meeting",
		from: "2025-06-12T09:00:00",
		to: "2025-06-12T10:00:00",
	},
	{
		title: "Design Review",
		from: "2025-06-12T11:30:00",
		to: "2025-06-12T12:30:00",
	},
	{
		title: "Client Presentation",
		from: "2025-06-12T14:00:00",
		to: "2025-06-12T15:00:00",
	},
];

function RouteComponent() {
	return (
		<>
			<div className="grid auto-rows-min gap-4 md:grid-cols-3">
				<div className="aspect-video rounded-xl bg-muted/50" />
				<div className="aspect-video rounded-xl bg-muted/50" />
				<div className="aspect-video rounded-xl bg-muted/50">
					<div className="flex w-full flex-col gap-2">
						{events.map((event) => (
							<div
								key={event.title}
								className="relative rounded-md bg-muted p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full after:bg-primary/70"
							>
								<div className="font-medium">{event.title}</div>
								<div className="text-muted-foreground text-xs">
									{formatDateRange(new Date(event.from), new Date(event.to))}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
				<ChartAreaInteractive />
			</div>
		</>
	);
}
