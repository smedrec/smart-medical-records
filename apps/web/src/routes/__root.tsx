import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import Loader from "@/components/loader";
import { seo } from "@/lib/seo";
import { Providers } from "@/providers";
import appCss from "../index.css?url";

export type RouterAppContext = {};

export const Route = createRootRouteWithContext<RouterAppContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			...seo({
				title:
					"Smart Medical Record | Opensource Medical institutions management FHIR compatible",
				description:
					"Smart Medical Record is a type-safe, client-first, full-stack AI FHIR framework. ",
			}),
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	component: RootDocument,
});

function RootDocument() {
	const isFetching = useRouterState({ select: (s) => s.isLoading });

	return (
		<html lang="en" className="dark">
			<head>
				<HeadContent />
			</head>
			<body>
				<Providers>
					<div className="grid h-svh grid-rows-[auto_1fr]">
						{isFetching ? <Loader /> : <Outlet />}
					</div>
				</Providers>
				<Scripts />
			</body>
		</html>
	);
}
