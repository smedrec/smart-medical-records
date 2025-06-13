import { createAccessControl } from 'better-auth/plugins/access'
import {
	adminAc,
	defaultStatements,
	memberAc,
	ownerAc,
} from 'better-auth/plugins/organization/access'

const statement = {
	...defaultStatements,
	patient: ['read', 'create', 'update', 'delete', 'recreate'],
	practitioner: ['read', 'create', 'update', 'delete', 'recreate'],
} as const

export const ac = createAccessControl(statement)

export const member = ac.newRole({
	...memberAc.statements,
})

export const admin = ac.newRole({
	patient: ['read', 'create', 'update', 'delete', 'recreate'],
	practitioner: ['read', 'create', 'update', 'delete', 'recreate'],
	...adminAc.statements,
})

export const owner = ac.newRole({
	patient: ['read', 'create', 'update', 'delete'],
	practitioner: ['read', 'create', 'update', 'delete', 'recreate'],
	...ownerAc.statements,
})

export const practitioner = ac.newRole({
	patient: ['read', 'create', 'update', 'delete', 'recreate'],
	practitioner: ['read'],
	...memberAc.statements,
})
