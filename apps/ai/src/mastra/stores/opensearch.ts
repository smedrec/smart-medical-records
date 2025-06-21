import { OpenSearchVector } from '@mastra/opensearch'

export const opensearch = new OpenSearchVector({
	url: process.env.OPENSEARCH_URL!,
})
