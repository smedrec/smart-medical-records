import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

import { db, note } from '../../db'

import type { FhirSessionData } from '../../../../hono/middleware/fhir-auth'

const defaultPrincipalId = 'anonymous'
const defaultOrganizationId = 'anonymous'

export const writeNoteTool = createTool({
	id: 'write',
	description: 'Write a new note or overwrite an existing one.',
	inputSchema: z.object({
		title: z.string().describe('The title of the note.'),
		content: z.string().describe('The markdown content of the note.'),
	}),
	outputSchema: z.string(),
	execute: async ({ context, runtimeContext }) => {
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const organizationId = fhirSessionData.activeOrganizationId || defaultOrganizationId

		try {
			const { title, content } = context
			await db.insert(note).values({
				title: title,
				markdown: content,
				userId: principalId,
				organizationId: organizationId,
			})
			return `Successfully wrote to note "${title}".`
		} catch (error: any) {
			return `Error writing note: ${error.message}`
		}
	},
})
