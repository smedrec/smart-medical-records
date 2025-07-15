import { MastraClient } from "@mastra/client-js";
import { getHeaders } from "@tanstack/react-start/server";
import { processHeaders } from "@/lib/utils";

const headers = getHeaders();

const ai = new MastraClient({
	baseUrl: process.env.AI_PUBLIC_URL || "http://localhost:4111",
	retries: 3,
	backoffMs: 300,
	maxBackoffMs: 5000,
	headers: processHeaders(headers),
});

export const createMastraClient = () => {
	return new MastraClient({
		baseUrl: process.env.AI_PUBLIC_URL || "http://localhost:4111",
		headers: processHeaders(headers),
	});
};

export { ai };
