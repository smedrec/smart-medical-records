'use client'

import type { ColumnDef } from '@tanstack/react-table'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type AuditLog = {
	id: number
	timestamp: string
	action: string
	targetResourceType: string
	status: string
}

export const columns: Array<ColumnDef<AuditLog>> = [
	{
		accessorKey: 'id',
		header: 'ID',
	},
	{
		accessorKey: 'timestamp',
		header: 'timestamp',
	},
	{
		accessorKey: 'action',
		header: 'Action',
	},
	{
		accessorKey: 'targetResourceType',
		header: 'Resource Type',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
]
