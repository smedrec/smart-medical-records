import { and, eq } from 'drizzle-orm'

//import { HTTPException } from 'hono/http-exception'

//import { APIError } from 'better-auth/api';

import { apikey, db, member, organization, person } from '@repo/db'

import type { Organization, Person } from '@solarahealth/fhir-r4'

export async function getActiveOrganization(userId: string): Promise<string | null> {
	try {
		const result = await db.query.member.findFirst({
			where: eq(member.userId, userId),
		})
		if (result) {
			return result.organizationId
		} else {
			return null
			//throw new HTTPException(404, { message: 'The user is not member.' });
			/**throw new APIError('BAD_REQUEST', {
        message: 'User must agree to the TOS before signing up.',
      });*/
		}
	} catch (error) {
		return null
		//throw new HTTPException(500, { message: 'A machine readable error.' });
	}
}

export async function getActiveMemberRole(
	userId: string,
	organizationId: string
): Promise<string | null> {
	try {
		const result = await db.query.member.findFirst({
			where: and(eq(member.userId, userId), eq(member.organizationId, organizationId)),
		})
		if (result) {
			return result.role
		} else {
			return null
			//throw new HTTPException(404, { message: 'The user is not member.' });
			/**throw new APIError('BAD_REQUEST', {
        message: 'User must agree to the TOS before signing up.',
      });*/
		}
	} catch (error) {
		return null
		//throw new HTTPException(500, { message: 'A machine readable error.' });
	}
}

export async function getApiKey(userId: string): Promise<string | null> {
	try {
		const result = await db.query.apikey.findFirst({
			where: and(eq(apikey.userId, userId), eq(apikey.enabled, true)),
		})
		if (result) {
			const now = new Date().getTime()
			const expiresAt = result.expiresAt?.getTime() as number
			if (now > expiresAt) {
				return null
			}
			return result.key
		} else {
			return null
			//throw new HTTPException(404, { message: 'The user is not member.' });
			/**throw new APIError('BAD_REQUEST', {
        message: 'User must agree to the TOS before signing up.',
      });*/
		}
	} catch (error) {
		return null
		//throw new HTTPException(500, { message: 'A machine readable error.' });
	}
}

export async function setupOrganizationResource(
	tenantId: string,
	name: string,
	userId: string
): Promise<string> {
	try {
		const resource: Organization = {
			resourceType: 'Organization',
			active: true,
			id: tenantId,
			text: {
				status: 'generated',
				div: `<div xmlns="http://www.w3.org/1999/xhtml">\n      \n      <p>${name}</p>\n    \n    </div>`,
			},
			name: name,
		}
		const o = await db
			.insert(organization)
			.values({
				tenant: tenantId,
				createdBy: userId,
				updatedBy: userId,
				resource: resource,
			})
			.returning()

		return o[0].id
	} catch (error) {
		console.error('Error setting up organization resource:', error)
		throw new Error(
			`Error setting up organization resource: ${error instanceof Error ? error.message : 'Unknown error'}`
		)
	}
}

export async function setupPersonResource(id: string, name: string): Promise<string> {
	try {
		const resource: Person = {
			resourceType: 'Person',
			active: true,
			id: id,
			text: {
				status: 'generated',
				div: `<div xmlns="http://www.w3.org/1999/xhtml">\n      \n      <p>${name}</p>\n    \n    </div>`,
			},
			name: [
				{
					use: 'official',
					family: name.split(' ')[0],
					given: [name.split(' ')[1]],
				},
			],
		}
		const p = await db
			.insert(person)
			.values({
				user: id,
				createdBy: id,
				updatedBy: id,
				resource: resource,
			})
			.returning()

		return p[0].id
	} catch (error) {
		console.error('Error setting up organization resource:', error)
		throw new Error(
			`Error setting up organization resource: ${error instanceof Error ? error.message : 'Unknown error'}`
		)
	}
}
