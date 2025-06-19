import MaintenanceError from '@/components/errors/maintenance-error'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(errors)/503')({
	component: MaintenanceError,
})
