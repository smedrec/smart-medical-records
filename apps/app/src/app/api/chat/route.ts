import { ai } from '@/lib/ai'

export async function POST(req: Request) {
	const mastra = await ai()
	const { messages } = await req.json()
	const supportAgent = mastra.getAgent('assistantAgent')
	const stream = await supportAgent.stream(messages)

	return stream.processDataStream
}
