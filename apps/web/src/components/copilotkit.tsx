import { CopilotKit } from '@copilotkit/react-core'
import { CopilotChat } from '@copilotkit/react-ui'

import '@copilotkit/react-ui/styles.css'

export function CopilotKitComponent() {
	return (
		<CopilotKit runtimeUrl={`http://localhost:4111/copilotkit`} agent="assistantAgent">
			<CopilotChat
				labels={{
					title: 'Your Assistant',
					initial: 'Hi! 👋 How can I assist you today?',
				}}
			/>
		</CopilotKit>
	)
}
