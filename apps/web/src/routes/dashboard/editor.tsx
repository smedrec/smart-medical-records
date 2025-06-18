import {
	BlockquotePlugin,
	BoldPlugin,
	H1Plugin,
	H2Plugin,
	H3Plugin,
	ItalicPlugin,
	UnderlinePlugin,
} from '@platejs/basic-nodes/react'
import { createFileRoute } from '@tanstack/react-router'
import { Plate, usePlateEditor } from 'platejs/react'
import * as React from 'react'

import { BlockquoteElement } from '@repo/ui/components/ui/blockquote-node'
import { Editor, EditorContainer } from '@repo/ui/components/ui/editor'
import { FixedToolbar } from '@repo/ui/components/ui/fixed-toolbar'
import { H1Element, H2Element, H3Element } from '@repo/ui/components/ui/heading-node'
import { MarkToolbarButton } from '@repo/ui/components/ui/mark-toolbar-button'
import { ToolbarButton } from '@repo/ui/components/ui/toolbar' // Generic toolbar button

import type { Value } from 'platejs'

export const Route = createFileRoute('/dashboard/editor')({
	component: RouteComponent,
})

const initialValue: Value = [
	{
		type: 'p',
		children: [
			{ text: 'Hello! Try out the ' },
			{ text: 'bold', bold: true },
			{ text: ', ' },
			{ text: 'italic', italic: true },
			{ text: ', and ' },
			{ text: 'underline', underline: true },
			{ text: ' formatting.' },
		],
	},
]

function RouteComponent() {
	const editor = usePlateEditor({
		plugins: [
			BoldPlugin,
			ItalicPlugin,
			UnderlinePlugin,
			H1Plugin.withComponent(H1Element),
			H2Plugin.withComponent(H2Element),
			H3Plugin.withComponent(H3Element),
			BlockquotePlugin.withComponent(BlockquoteElement),
		],
		value: initialValue,
	})

	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
				<Plate editor={editor}>
					<FixedToolbar className="flex justify-start gap-1 rounded-t-lg">
						{/* Element Toolbar Buttons */}
						<ToolbarButton onClick={() => editor.tf.h1.toggle()}>H1</ToolbarButton>
						<ToolbarButton onClick={() => editor.tf.h2.toggle()}>H2</ToolbarButton>
						<ToolbarButton onClick={() => editor.tf.h3.toggle()}>H3</ToolbarButton>
						<ToolbarButton onClick={() => editor.tf.blockquote.toggle()}>Quote</ToolbarButton>
						{/* Mark Toolbar Buttons */}
						<MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">
							B
						</MarkToolbarButton>
						<MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">
							I
						</MarkToolbarButton>
						<MarkToolbarButton nodeType="underline" tooltip="Underline (⌘+U)">
							U
						</MarkToolbarButton>
					</FixedToolbar>
					<EditorContainer>
						{/* Styles the editor area */}
						<Editor placeholder="Type your amazing content here..." />
					</EditorContainer>
				</Plate>
			</div>
		</div>
	)
}
