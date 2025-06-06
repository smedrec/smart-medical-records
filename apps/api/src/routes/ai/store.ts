import { createRoute, z } from '@hono/zod-openapi'
import { MDocument } from '@mastra/rag'
import { embedMany } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { aiClient } from '../../lib/ai'
import { ApiError, openApiErrorResponses } from '../../lib/errors'
import { idParamsSchema } from '../../shared/types'
import { AiStoreSchema } from './types'

import type { App } from '../../lib/hono'

const route = createRoute({
	tags: ['AI'],
	operationId: 'ai-store',
	method: 'post',
	path: '/ai/store/{id}',
	security: [{ cookieAuth: [] }],
	request: {
		params: idParamsSchema,
		body: {
			required: true,
			description: 'Index and data to store',
			content: {
				'application/json': {
					schema: AiStoreSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: 'The store response',
			content: {
				'application/json': {
					schema: z.object({
						chunks: z.number().openapi({}),
					}),
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route
export type AiStoreRequest = z.infer<
	(typeof route.request.body.content)['application/json']['schema']
>
export type AiStoreResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerAiStore = (app: App) =>
	app.openapi(route, async (c) => {
		//const { auth } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({ code: 'UNAUTHORIZED', message: 'You Need to login first to continue.' })

		/**const canCreateAssistant = await auth.api.hasPermission({
      headers: c.req.raw.headers,
      body: {
        permissions: {
          assistant: ['create'], // This must match the structure in your access control
        },
      },
    })

    if (!canCreateAssistant) {
      throw new ApiError({
        code: 'FORBIDDEN',
        message: 'You do not have permissions to create a assistant.',
      })
    } */

		const { id } = c.req.valid('param')
		const data = c.req.valid('json')
		const response = await fetch(data.paperUrl)
		const paperText = await response.text()

		// Create document and chunk it
		const doc = MDocument.fromText(paperText)
		const chunks = await doc.chunk({
			strategy: 'recursive',
			size: 512,
			overlap: 50,
			separator: '\n',
		})

		// Generate embeddings
		const { embeddings } = await embedMany({
			model: ollama.embedding('nomic-embed-text:latest'),
			values: chunks.map((chunk) => chunk.text),
		})

		const vectorStore = aiClient.getVector(id)

		try {
			// Store embeddings
			await vectorStore.upsert({
				indexName: data.index,
				vectors: embeddings,
				metadata: chunks.map((chunk) => ({
					text: chunk.text,
					source: 'transformer-paper',
				})),
			})
			//console.log('Response:', response)
			return c.json({ chunks: chunks.length }, 200)
		} catch (error) {
			console.error('Development error:', error)
			throw new ApiError({ code: 'INTERNAL_SERVER_ERROR', message: error as string })
		}
	})
