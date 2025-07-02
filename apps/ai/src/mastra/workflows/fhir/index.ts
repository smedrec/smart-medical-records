import { createAvailableSlotsWorkflow } from '@/mastra/workflows/fhir/scheduling-workflow'

export const fhirWorkflows = [createAvailableSlotsWorkflow]

export const allFhirWorkflows = [...fhirWorkflows]
