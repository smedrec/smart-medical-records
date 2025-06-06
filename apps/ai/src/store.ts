import { MDocument } from '@mastra/rag'
import { embedMany } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { mastra } from './mastra'

// Load the paper
const paperUrl = 'https://arxiv.org/html/1706.03762'
const response = await fetch(paperUrl)
const paperText = await response.text()

// Create document and chunk it
const doc = MDocument.fromText(paperText)
const chunks = await doc.chunk({
	strategy: 'recursive',
	size: 512,
	overlap: 50,
	separator: '\n',
})
console.log('Number of chunks:', chunks.length)

// Generate embeddings
const { embeddings } = await embedMany({
	model: ollama.embedding('nomic-embed-text:latest'),
	values: chunks.map((chunk) => chunk.text),
})

// Get the vector store instance from Mastra
const vectorStore = mastra.getVector('mongoVector')

// Create an index for our paper chunks
await vectorStore.createIndex({
	indexName: 'papers',
	dimension: 1536,
})

// Store embeddings
await vectorStore.upsert({
	indexName: 'papers',
	vectors: embeddings,
	metadata: chunks.map((chunk) => ({
		text: chunk.text,
		source: 'transformer-paper',
	})),
})
