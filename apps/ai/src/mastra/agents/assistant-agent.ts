import { groq } from '@ai-sdk/groq'
import { Agent } from '@mastra/core/agent'

import { allFhirTools } from '../tools/fhir-tools'

export const assistantAgent = new Agent({
	name: 'assistant-agent',
	instructions: `
    You are an Agent that helps users to manage the Patient, Practitioner and Organization FHIR resources.
  `,
	model: groq('llama-3.3-70b-versatile'),
	tools: Object.fromEntries(allFhirTools.map(tool => [tool.id, tool])),
})
