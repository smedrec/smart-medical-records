'use client'

import type { ColumnDef } from '@tanstack/react-table'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Patient = {
	id: string
	email: string
	name: string
}

export const columns: Array<ColumnDef<Patient>> = [
	{
		accessorKey: 'id',
		header: 'ID',
	},
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
]
