import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

import { AppDb, note } from '@repo/app-db'

let appDbService: AppDb | undefined = undefined
export { appDbService }

const defaultPrincipalId = 'anonymous'
const defaultOrganizationId = 'anonymous'

export const writeNoteTool = createTool({
	id: 'write',
	description: 'Write a new note or overwrite an existing one.',
	inputSchema: z.object({
		title: z.string().nonempty().describe('The title of the note.'),
		content: z.string().nonempty().describe('The markdown content of the note.'),
	}),
	outputSchema: z.string().nonempty(),
	execute: async ({ context, runtimeContext }) => {
		const principalId: string = runtimeContext.get('userId') || defaultPrincipalId
		const organizationId: string =
			runtimeContext.get('activeOrganizationId') || defaultOrganizationId

		if (!appDbService) {
			appDbService = new AppDb(process.env.APP_DB_URL)
		}

		const db = appDbService.getDrizzleInstance()
		try {
			const { title, content } = context
			const id = await db
				.insert(note)
				.values({
					title: title,
					markdown: content,
					userId: principalId,
					organizationId: organizationId,
				})
				.returning({ id: note.id })

			return `Successfully wrote to note "${title}".`
		} catch (error: any) {
			return `Error writing note: ${error.message}`
		}
	},
})
