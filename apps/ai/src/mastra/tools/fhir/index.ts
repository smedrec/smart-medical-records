import { fhirPatientReportSearchTool } from '@/mastra/tools/fhir/patient-report-search'
import { fhirResourceCreateTool } from '@/mastra/tools/fhir/resource-create'
import { fhirResourceDeleteTool } from '@/mastra/tools/fhir/resource-delete'
import { fhirResourceReadTool } from '@/mastra/tools/fhir/resource-read'
import { fhirResourceSearchTool } from '@/mastra/tools/fhir/resource-search'
import { fhirResourceUpdateTool } from '@/mastra/tools/fhir/resource-update'
import { fhirResourceValidateTool } from '@/mastra/tools/fhir/resource-validate'

export const fhirResourceTools = [
	fhirResourceReadTool,
	fhirResourceSearchTool,
	fhirResourceValidateTool,
	fhirResourceCreateTool,
	fhirResourceUpdateTool,
	fhirResourceDeleteTool,
	fhirPatientReportSearchTool,
]

export const allFhirTools = [...fhirResourceTools]
