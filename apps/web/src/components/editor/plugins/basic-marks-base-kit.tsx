import {
	BaseBoldPlugin,
	BaseCodePlugin,
	BaseHighlightPlugin,
	BaseItalicPlugin,
	BaseKbdPlugin,
	BaseStrikethroughPlugin,
	BaseSubscriptPlugin,
	BaseSuperscriptPlugin,
	BaseUnderlinePlugin,
} from '@platejs/basic-nodes'

import { CodeLeafStatic } from '@repo/ui/components/code-node-static'
import { HighlightLeafStatic } from '@repo/ui/components/highlight-node-static'
import { KbdLeafStatic } from '@repo/ui/components/kbd-node-static'

export const BaseBasicMarksKit = [
	BaseBoldPlugin,
	BaseItalicPlugin,
	BaseUnderlinePlugin,
	BaseCodePlugin.withComponent(CodeLeafStatic),
	BaseStrikethroughPlugin,
	BaseSubscriptPlugin,
	BaseSuperscriptPlugin,
	BaseHighlightPlugin.withComponent(HighlightLeafStatic),
	BaseKbdPlugin.withComponent(KbdLeafStatic),
]
