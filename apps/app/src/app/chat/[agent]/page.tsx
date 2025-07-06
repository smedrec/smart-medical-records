import { ai } from '@/lib/ai'

export default function Page({ params }: { params: { agent: string } }) {
	const agent = ai.getAgent(params.agent)

	return (
		<div>
			<main>
				<h1>{params.agent}</h1>
				{/* ... */}
			</main>
		</div>
	)
}
