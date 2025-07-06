import { ai } from '@/lib/ai'

export async function POST(req: Request) {
	const { messages } = await req.json()
	const supportAgent = ai.getAgent('supportAgent')
	const stream = await supportAgent.stream(messages)

	return stream.processDataStream
}
