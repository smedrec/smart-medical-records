import { and, eq } from 'drizzle-orm'

//import { HTTPException } from 'hono/http-exception'

//import { APIError } from 'better-auth/api';

import { activeOrganization, apikey, AuthDb, member, smartFhirClient } from '@repo/auth-db'
import { InfisicalKmsClient } from '@repo/infisical-kms'
import { SmartClient } from '@repo/smart-client'

import type { DecryptResponse } from '@repo/infisical-kms'
import type { SmartClientConfig } from '@repo/smart-client'

//import { createSmartFhirClient, fhir } from '@repo/fhir'

//import type { Organization, Person } from '@solarahealth/fhir-r4'

// Using environment variable AUTH_DB_URL
const authDbService = new AuthDb()
const db = authDbService.getDrizzleInstance()

const kms = new InfisicalKmsClient({
	baseUrl: process.env.INFISICAL_URL!,
	keyId: process.env.KMS_KEY_ID!,
	accessToken: process.env.INFISICAL_ACCESS_TOKEN!,
})

async function getSmartClientAccessToken(organizationId: string): Promise<string> {
	const result = await db
		.select()
		.from(smartFhirClient)
		.where(eq(smartFhirClient.organizationId, organizationId))

	if (result.length < 1)
		throw new Error('The organization does not have the smart fhir client configured.')

	const privateKey: DecryptResponse = await kms.decrypt(result[0].privateKey!)

	const config: SmartClientConfig = {
		clientId: result[0].clientId,
		iss: result[0].iss, // Must match clientId
		scope: result[0].scope,
		privateKey: privateKey.plaintext, // Load your private key securely
		fhirBaseUrl: result[0].fhirBaseUrl!, // e.g., "https://sandbox.fhir.org/r4"
		//kid: process.env.FHIR_KID, // Optional
		// signingAlgorithm: 'ES384', // Optional
	}

	try {
		// Option 1: Discover .well-known/smart-configuration using fhirBaseUrl's origin
		const client = await SmartClient.init(config)

		// Option 2: Provide an explicit issuer URL for .well-known/smart-configuration discovery
		// const explicitIssUrl = 'https://auth.example.com/auth/realms/myrealm';
		// const client = await SmartClient.init(config, explicitIssUrl);

		console.log('SmartClient initialized successfully.')

		const token = await client.getAccessToken()
		return token
	} catch (error) {
		console.error('Failed to initialize SmartClient:', error)
		// Handle initialization error (e.g., server unreachable, invalid config)
		throw error
	}
}

export async function getActiveOrganization(userId: string): Promise<
	| {
			role: string
			userId: string
			organizationId: string
	  }
	| undefined
> {
	try {
		const result = await db.query.activeOrganization.findFirst({
			where: eq(activeOrganization.userId, userId),
		})
		if (result) {
			return result
		} else {
			const result = await db.query.member.findFirst({
				where: eq(member.userId, userId),
			})
			if (result) {
				await db
					.insert(activeOrganization)
					.values({ userId: userId, organizationId: result.organizationId, role: result.role })
					.onConflictDoUpdate({
						target: activeOrganization.userId,
						set: { organizationId: result.organizationId, role: result.role },
					})
			}

			return result
			//throw new HTTPException(404, { message: 'The user is not member.' });
			/**throw new APIError('BAD_REQUEST', {
        message: 'User must agree to the TOS before signing up.',
      });*/
		}
	} catch (error) {
		return undefined
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

export { getSmartClientAccessToken }
/**
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

function getLastWord(str: string): string {
	const words = str.split(' ')
	return words[words.length - 1]
}

function removeLastWord(str: string): string[] {
	const words = str.split(' ')
	if (words.length > 1) {
		words.pop()
		return words
	} else {
		return []
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
					family: getLastWord(name),
					given: removeLastWord(name),
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

export async function authorizeSmartClient(userId: string): Promise<string> {
	return await createSmartFhirClient({})
}
 */
