import { and, eq } from 'drizzle-orm'

//import { HTTPException } from 'hono/http-exception'

//import { APIError } from 'better-auth/api';

import { activeOrganization, apikey, db, member } from '@repo/db'
import { fhir } from '@repo/fhir'

import type { Organization, Person } from '@solarahealth/fhir-r4'

export async function getActiveOrganization(userId: string): Promise<string | null> {
	try {
		const result = await db.query.activeOrganization.findFirst({
			where: eq(activeOrganization.userId, userId),
		})
		if (result) {
			return result.organizationId
		} else {
			const result = await db.query.member.findFirst({
				where: eq(member.userId, userId),
			})
			if (result) {
				await db
					.insert(activeOrganization)
					.values({ userId: userId, organizationId: result.organizationId })
					.onConflictDoUpdate({
						target: activeOrganization.userId,
						set: { organizationId: result.organizationId },
					})
			}

			return result?.organizationId || null
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

export async function setupOrganizationResource(name: string, userId: string): Promise<string> {
	try {
		const resource: Organization = {
			resourceType: 'Organization',
			active: true,
			text: {
				status: 'generated',
				div: `<div xmlns="http://www.w3.org/1999/xhtml">\n      \n      <p>${name}</p>\n    \n    </div>`,
			},
			name: name,
		}
		const {
			data, // only present if 2XX response
			error, // only present if 4XX or 5XX response
		} = await fhir.POST('/Organization', {
			body: resource as any,
			headers: {
				'Content-Type': 'application/fhir+json',
			},
		})

		if (!data?.id) {
			throw new Error('Failed to create organization resource: missing id')
		}
		return data.id
	} catch (error) {
		console.error('Error setting up organization resource:', error)
		throw new Error(
			`Error setting up organization resource: ${error instanceof Error ? error.message : 'Unknown error'}`
		)
	}
}

export async function setupPersonResource(name: string, email: string): Promise<string> {
	try {
		const resource: Person = {
			resourceType: 'Person',
			active: true,
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
			telecom: [
				{
					system: 'email',
					value: email,
					rank: 1,
				},
			],
		}
		const {
			data, // only present if 2XX response
			error, // only present if 4XX or 5XX response
		} = await fhir.POST('/Person', {
			body: resource as any,
			headers: {
				'Content-Type': 'application/fhir+json',
			},
		})

		if (!data?.id) {
			throw new Error('Failed to create person resource: missing id')
		}
		return data?.id
	} catch (error) {
		console.error('Error setting up fhir person resource:', error)
		throw new Error(
			`Error setting up person resource: ${error instanceof Error ? error.message : 'Unknown error'}`
		)
	}
}
