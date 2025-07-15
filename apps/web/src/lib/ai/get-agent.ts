import { createServerFn } from "@tanstack/react-start";
import { ai } from "./client";

interface GetAgentParams {
	agentId: string;
}

const getAgent = createServerFn({ method: "GET", response: "data" })
	.validator((params: GetAgentParams) => params)
	.handler(async ({ data }: { data: GetAgentParams }) => {
		try {
			const agent = ai.getAgent(data.agentId);
			const details = await agent.details();
			return details;
		} catch (error) {
			console.error("Error getting the agent details:", error);
			throw new Error(error as string);
		}
	});

export { getAgent };
