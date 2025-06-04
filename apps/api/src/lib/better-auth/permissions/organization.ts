import { createAccessControl } from 'better-auth/plugins/access'
import {
	adminAc,
	defaultStatements,
	memberAc,
	ownerAc,
} from 'better-auth/plugins/organization/access'

const statement = {
	...defaultStatements,
	assistant: ['create', 'share', 'update', 'delete', 'read'],
	therapist: ['create', 'share', 'update', 'delete', 'read'],
	patient: ['create', 'share', 'update', 'delete', 'read'],
} as const

export const ac = createAccessControl(statement)

export const member = ac.newRole({
	...memberAc.statements,
})

export const admin = ac.newRole({
	assistant: ['create', 'update', 'delete'],
	therapist: ['create', 'update', 'delete'],
	patient: ['create', 'update', 'delete'],
	...adminAc.statements,
})

export const owner = ac.newRole({
	assistant: ['create', 'update', 'delete'],
	therapist: ['create', 'update', 'delete'],
	patient: ['create', 'update', 'delete'],
	...ownerAc.statements,
})

export const assistant = ac.newRole({
	patient: ['read'],
	...memberAc.statements,
})
