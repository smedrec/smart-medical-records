import { createServerFn } from "@tanstack/react-start";
import { ai } from "@/lib/ai/client";

interface GetMessagesParams {
	threadId: string;
	agentId: string;
}

const getMessages = createServerFn({
	method: "GET",
	response: "data",
})
	.validator((params: GetMessagesParams) => params)
	.handler(async ({ data }: { data: GetMessagesParams }) => {
		try {
			const thread = ai.getMemoryThread(data.threadId, data.agentId);
			const { messages } = await thread.getMessages({ limit: 10 });

			return messages.map((msg) => {
				// Handle content transformation based on message type
				const content = Array.isArray(msg.content)
					? msg.content
							.map((part) => {
								if (part.type === "text") return part.text;
								if (part.type === "image") return "[Image]";
								if (part.type === "file") return "[File]";
								return "";
							})
							.join(" ")
					: msg.content;

				return {
					...msg,
					providerOptions: undefined,
					experimental_providerMetadata: undefined,
					content,
				};
			});
		} catch (error) {
			console.error("Error getting the agent messages:", error);
			throw new Error(error as string);
		}
	});

export { getMessages };
