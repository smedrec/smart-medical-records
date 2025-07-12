import { QdrantVector } from '@mastra/qdrant'

const qdrant = new QdrantVector({
	url: process.env.QDRANT_URL!,
	apiKey: process.env.QDRANT_API_KEY,
})

export { qdrant }
