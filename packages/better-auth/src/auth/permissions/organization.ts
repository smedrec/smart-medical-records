import { createAccessControl } from 'better-auth/plugins/access'
import {
	adminAc,
	defaultStatements,
	memberAc,
	ownerAc,
} from 'better-auth/plugins/organization/access'

const statement = {
	...defaultStatements,
} as const

export const ac = createAccessControl(statement)

export const member = ac.newRole({
	...memberAc.statements,
})

export const admin = ac.newRole({
	...adminAc.statements,
})

export const owner = ac.newRole({
	...ownerAc.statements,
})

export const practitioner = ac.newRole({
	...memberAc.statements,
})

export const patient = ac.newRole({
	...memberAc.statements,
})
