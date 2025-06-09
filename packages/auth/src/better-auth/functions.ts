import { and, eq } from 'drizzle-orm'

//import { HTTPException } from 'hono/http-exception'

//import { APIError } from 'better-auth/api';

import { db, member } from '@repo/db'

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
