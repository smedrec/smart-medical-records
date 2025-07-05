import { Badge } from '@repo/ui/components/ui/badge'
import { ScrollArea } from '@repo/ui/components/ui/scroll-area'
import { Separator } from '@repo/ui/components/ui/separator'

import type { AgentArrayItem } from '@/types/ai'

interface AgentDetailsPanelProps {
	agent: AgentArrayItem
}

export default function AgentDetailsPanel({ agent }: AgentDetailsPanelProps) {
	const isActive = true

	const tools = Object.entries(agent.tools).map(([id, tool]) => ({
		...tool,
	}))

	/**const workflows = Object.entries(agent.workflows).map(([id, workflow]) => ({
		...workflows,
	}))*/

	return (
		<div className="h-full flex flex-col bg-background" data-testid="agent-details">
			<div className="p-6 space-y-4">
				{/* Agent Header */}
				<div className="flex items-center gap-4">
					<div className="flex-1">
						<h3 className="font-semibold text-lg">{agent.name}</h3>
						<Badge variant={isActive ? 'default' : 'secondary'}>
							{isActive ? 'Active' : 'Inactive'}
						</Badge>
					</div>
				</div>

				<Separator />

				<div className="flex-1">
					<div className="font-medium">{agent.provider}</div>
					<div className="font-medium">{agent.modelId}</div>
				</div>

				<Separator />

				{/* Agent Details */}
				<ScrollArea className="flex-1">
					<div className="space-y-4">
						{/* Bio */}
						{agent.instructions && (
							<div>
								<h4 className="font-medium text-sm mb-1">Instructions</h4>
								<p className="text-sm text-muted-foreground">
									<span className="sm:hidden">
										{/* Mobile: Show truncated bio */}
										{((text) => (text.length > 150 ? `${text.substring(0, 150)}...` : text))(
											Array.isArray(agent?.instructions)
												? agent?.instructions.join(' ')
												: agent?.instructions
										)}
									</span>
									<span className="hidden sm:block">
										{/* Desktop: Show full bio */}
										{Array.isArray(agent?.instructions)
											? agent?.instructions.join(' ')
											: agent?.instructions}
									</span>
								</p>
							</div>
						)}

						{/* Tools */}
						{tools && tools.length > 0 && (
							<div>
								<h4 className="font-medium text-sm mb-2">Tools</h4>
								<div className="flex flex-wrap gap-1">
									{tools.map((tool, idx) => (
										<>
											<Badge key={idx} variant="outline" className="text-xs">
												{tool.id}
											</Badge>
											<p className="font-semibold text-lg">{tool.description}</p>
										</>
									))}
								</div>
							</div>
						)}

						{/* Workflows 
						{workflows && agent.workflows.length > 0 && (
							<div>
								<h4 className="font-medium text-sm mb-2">Personality Traits</h4>
								<div className="flex flex-wrap gap-1">
									{agent.workflows.map((workflow, idx) => (
										<Badge key={idx} variant="secondary" className="text-xs">
											{workflow.name}
										</Badge>
									))}
								</div>
							</div>
						)} */}

						{/* Plugins 
						{agent.plugins && agent.plugins.length > 0 && (
							<div>
								<h4 className="font-medium text-sm mb-2">Enabled Plugins</h4>
								<div className="space-y-1">
									{agent.plugins.map((plugin, idx) => (
										<div key={idx} className="text-xs text-muted-foreground">
											• {plugin}
										</div>
									))}
								</div>
							</div>
						)} */}

						{/* Settings 
						{agent.settings && Object.keys(agent.settings).length > 0 && (
							<div>
								<h4 className="font-medium text-sm mb-2">Settings</h4>
								<div className="space-y-1">
									{Object.entries(agent.settings)
										.filter(([key]) => key !== 'avatar' && key !== 'secrets')
										.map(([key, value]) => (
											<div key={key} className="text-xs">
												<span className="text-muted-foreground">{key}:</span>{' '}
												<span className="font-mono">
													{typeof value === 'object' ? JSON.stringify(value) : String(value)}
												</span>
											</div>
										))}
								</div>
							</div>
						)} */}

						{/* Message Examples 
						{agent.messageExamples && agent.messageExamples.length > 0 && (
							<div>
								<h4 className="font-medium text-sm mb-2">Example Messages</h4>
								<div className="space-y-2">
									{agent.messageExamples.slice(0, 3).map((examples, idx) => {
										// messageExamples is an array of arrays, so we need to handle nested structure
										if (Array.isArray(examples) && examples.length > 0) {
											const firstExample = examples[0]
											return (
												<div key={idx} className="text-xs bg-muted p-2 rounded">
													<div className="font-medium">{firstExample.name}</div>
													<div className="text-muted-foreground mt-1">
														{firstExample.content.text}
													</div>
												</div>
											)
										}
										return null
									})}
								</div>
							</div>
						)} */}
					</div>
				</ScrollArea>
			</div>
		</div>
	)
}
