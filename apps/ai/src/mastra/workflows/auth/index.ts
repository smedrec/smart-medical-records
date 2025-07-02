import { newOrganizationWorkflow } from '@/mastra/workflows/auth/new-organization-workflow'
import { newUserWorkflow } from '@/mastra/workflows/auth/new-user-workflow'

export const authWorkflows = [newUserWorkflow, newOrganizationWorkflow]

export const allAuthWorkflows = [...authWorkflows]
