import { createServerFn } from "@tanstack/react-start";
import type { AgentArrayItem } from "@/types";
import { ai } from "./client";

const getAgents = createServerFn({ method: "GET" }).handler(async () => {
	try {
		const resultData = await ai.getAgents();
		const agentsArray: AgentArrayItem[] = Object.entries(resultData).map(
			([id, agent]) => ({
				id,
				...agent,
			}),
		);
		return agentsArray;
	} catch (error) {
		console.error("Error getting the agents:", error);
		throw new Error(error as string);
	}
});

export { getAgents };
