import { and, eq } from 'drizzle-orm'

//import { HTTPException } from 'hono/http-exception'

//import { APIError } from 'better-auth/api';

import { apikey, db, member, organization } from '@repo/db'

import type { Organization } from '@solarahealth/fhir-r4'

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

export async function setupOrganizationResource(organizationId: string): Promise<void> {
	try {
		// Check if the organization already exists
		const existingOrganization = await db.query.organization.findFirst({
			where: eq(organization.id, organizationId),
		})

		const resource: Organization = {
			resourceType: 'Organization',
			active: true,
			id: organizationId,
			text: {
				status: 'generated',
				div: `<div xmlns="http://www.w3.org/1999/xhtml">\n      \n      <p>${existingOrganization?.name}</p>\n    \n    </div>`,
			},
			name: existingOrganization?.name,
		}
		await db
			.update(organization)
			.set({
				resource: resource,
			})
			.where(eq(organization.id, organizationId))
	} catch (error) {
		console.error('Error setting up organization resource:', error)
		throw new Error(
			`Error setting up organization resource: ${error instanceof Error ? error.message : 'Unknown error'}`
		)
	}
}
