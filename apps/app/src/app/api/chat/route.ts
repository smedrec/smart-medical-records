import { groq } from '@ai-sdk/groq'
import { frontendTools } from '@assistant-ui/react-ai-sdk'
import { streamText } from 'ai'

export const runtime = 'edge'
export const maxDuration = 30

export async function POST(req: Request) {
	const { messages, system, tools } = await req.json()

	const result = streamText({
		model: groq('llama-3.3-70b-versatile'),
		messages,
		// forward system prompt and tools from the frontend
		toolCallStreaming: true,
		system,
		tools: {
			...frontendTools(tools),
		},
		onError: console.log,
	})

	return result.toDataStreamResponse()
}
