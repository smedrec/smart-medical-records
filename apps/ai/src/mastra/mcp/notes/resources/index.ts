import { eq } from 'drizzle-orm'

import { db, note } from '../../db'

import type { MCPServerResources, Resource } from '@mastra/mcp'

const listNotes = async (): Promise<Resource[]> => {
	try {
		const notes = await db.select().from(note)
		return notes.map((note) => {
			const title = note.title
			return {
				uri: `notes://${title}`,
				name: title,
				description: `A note about ${title}`,
				mime_type: 'text/markdown',
			}
		})
	} catch (error) {
		console.error('Error listing note resources:', error)
		return []
	}
}

const readNote = async (uri: string): Promise<string | null> => {
	const title = uri.replace('notes://', '')
	try {
		const content = await db.query.note.findFirst({
			where: eq(note.title, title),
			columns: {
				markdown: true,
			},
		})
		return content?.markdown as string | null
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
			console.error(`Error reading resource ${uri}:`, error)
		}
		return null
	}
}

export const resourceHandlers: MCPServerResources = {
	listResources: listNotes,
	getResourceContent: async ({ uri }: { uri: string }) => {
		const content = await readNote(uri)
		if (content === null) return { text: '' }
		return { text: content }
	},
}
