import fs from 'fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'url'
import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const NOTES_DIR = path.resolve(__dirname, '../../../notes')

export const writeNoteTool = createTool({
	id: 'write',
	description: 'Write a new note or overwrite an existing one.',
	inputSchema: z.object({
		title: z.string().nonempty().describe('The title of the note. This will be the filename.'),
		content: z.string().nonempty().describe('The markdown content of the note.'),
	}),
	outputSchema: z.string().nonempty(),
	execute: async ({ context }) => {
		try {
			const { title, content } = context
			const filePath = path.join(NOTES_DIR, `${title}.md`)
			await fs.mkdir(NOTES_DIR, { recursive: true })
			await fs.writeFile(filePath, content, 'utf-8')
			return `Successfully wrote to note "${title}".`
		} catch (error: any) {
			return `Error writing note: ${error.message}`
		}
	},
})
