import { groq } from '@ai-sdk/groq'
import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'

import { pgStorage } from '../stores/pgvector'
//import { D1Database } from "@cloudflare/workers-types";

//import { D1Store } from "@mastra/cloudflare-d1";
import { weatherTool } from '../tools/weather-tool'

//type Env = {
// Add your bindings here, e.g. Workers KV, D1, Workers AI, etc.
//DB: D1Database;
//};

export const weatherAgent = new Agent({
	name: 'Weather Agent',
	instructions: `
      You are a helpful weather assistant that provides accurate weather information.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If the location name isn’t in English, please translate it
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative

      Use the weatherTool to fetch current weather data.
`,
	model: groq('llama-3.3-70b-versatile'),
	tools: { weatherTool },
	memory: new Memory({
		//storage: new D1Store({
		//  binding: DB, // D1Database binding provided by the Workers runtime
		//  tablePrefix: "dev_", // Optional: isolate tables per environment
		//}),
		storage: pgStorage,
	}),
})
