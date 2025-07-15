import { createServerFn } from "@tanstack/react-start";
import { ai } from "@/lib/ai/client";

export type ChatRequest = {
	assistantId: string;
	message: {
		role: "assistant" | "user" | "tool" | "system";
		content: string;
	};
};

export const chat = createServerFn({ method: "GET" })
	.validator((params: ChatRequest) => params)
	.handler(async ({ data }) => {
		try {
			const agent = ai.getAgent(data.assistantId);
			const response = await agent.generate({
				messages: data.message as any,
				memoryOptions: {
					workingMemory: {
						enabled: true,
					},
				},
			});

			return { role: "assistant", content: response.text };
		} catch (error) {
			console.error("Development error:", error);
			throw new Error(error as string);
		}
	});
