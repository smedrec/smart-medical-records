import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/pages/coming-soon";

export const Route = createFileRoute("/(legal)/privacy-policy")({
	component: ComingSoon,
});
