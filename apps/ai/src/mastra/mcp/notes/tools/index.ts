import { IToolCallResult } from '@/mastra/tools/types'
import { createTextResponse, DefaultAuthContext } from '@/mastra/tools/utils'
import { createTool } from '@mastra/core/tools'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

import { note } from '@repo/app-db'

import type { RuntimeContextSession } from '@/hono/types'
import type { RuntimeServices, ToolCallResult } from '@/mastra/tools/types'

export const writeNoteTool = createTool({
	id: 'write_note',
	description: 'Write a new note or overwrite an existing one.',
	inputSchema: z.object({
		title: z.string().describe('The title of the note.'),
		content: z.string().describe('The markdown content of the note.'),
	}),
	outputSchema: IToolCallResult,
	execute: async ({ context, runtimeContext }): Promise<ToolCallResult> => {
		const { db } = runtimeContext.get('services') as RuntimeServices
		const session = runtimeContext.get('session') as RuntimeContextSession
		const principalId = session.userId || DefaultAuthContext.principalId
		const organizationId = session.activeOrganizationId || DefaultAuthContext.organizationId

		try {
			await db.app.insert(note).values({
				title: context.title,
				markdown: context.content,
				userId: principalId,
				organizationId: organizationId,
			})
			return createTextResponse(`Successfully wrote to note "${context.title}".`, {
				isError: false,
			})
		} catch (error: any) {
			return createTextResponse(`Error writing note: ${error.message}`, { isError: true })
		}
	},
})

export const updateNoteTool = createTool({
	id: 'write_note',
	description: 'Update the title and/or the content of an existing none to update.',
	inputSchema: z.object({
		title: z.string().describe('The title of the note.'),
		newTitle: z.string().optional().describe('The new title of the note, if applicable.'),
		newContent: z
			.string()
			.optional()
			.describe('The new markdown content of the note to update, if applicable.'),
	}),
	outputSchema: IToolCallResult,
	execute: async ({ context, runtimeContext }): Promise<ToolCallResult> => {
		if (!context.newTitle && !context.newContent) {
			createTextResponse(`Nothing to update, the note remain the same`, { isError: true })
		}
		const { db } = runtimeContext.get('services') as RuntimeServices
		const session = runtimeContext.get('session') as RuntimeContextSession
		const principalId = session.userId || DefaultAuthContext.principalId
		const organizationId = session.activeOrganizationId || DefaultAuthContext.organizationId

		try {
			const update = await db.app
				.update(note)
				.set({
					title: context.newTitle || undefined,
					markdown: context.newContent || undefined,
				})
				.where(
					and(
						eq(note.title, context.title),
						eq(note.userId, principalId),
						eq(note.organizationId, organizationId)
					)
				)
			if (update.length < 1) {
				return createTextResponse(`Note with the title "${context.title}" not found`, {
					isError: true,
				})
			}
			return createTextResponse(`Successfully wrote to note "${context.title}".`, {
				isError: false,
			})
		} catch (error: any) {
			return createTextResponse(`Error writing note: ${error.message}`, { isError: true })
		}
	},
})

export const listNotesTool = createTool({
	id: 'list_notes',
	description: 'List the notes for the current user. This tool does not need any input.',
	outputSchema: IToolCallResult,
	execute: async ({ context, runtimeContext }): Promise<ToolCallResult> => {
		const { db } = runtimeContext.get('services') as RuntimeServices
		const session = runtimeContext.get('session') as RuntimeContextSession
		const principalId = session.userId || DefaultAuthContext.principalId
		const organizationId = session.activeOrganizationId || DefaultAuthContext.organizationId

		try {
			const notes = await db.app.query.note.findMany({
				columns: {
					title: true,
					markdown: true,
				},
				where: and(eq(note.userId, principalId), eq(note.organizationId, organizationId)),
			})

			return createTextResponse(JSON.stringify(notes, null, 2), { isError: false })
		} catch (error: any) {
			return createTextResponse(`Error listing note: ${error.message}`, { isError: true })
		}
	},
})
