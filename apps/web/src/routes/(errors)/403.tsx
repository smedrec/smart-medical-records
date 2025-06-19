import ForbiddenError from '@/components/errors/forbidden'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(errors)/403')({
	component: ForbiddenError,
})
