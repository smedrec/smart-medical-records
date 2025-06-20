import { ApiError, openApiErrorResponses } from '@/lib/errors'
import { getOffset, paginatedData, parseQueryInt } from '@/lib/utils/paginated'
import { querySchema } from '@/shared/types'
import { createRoute, z } from '@hono/zod-openapi'
import { asc, eq } from 'drizzle-orm'

import { patient } from '@repo/db'

import { PatientSelectSchema } from './types'

import type { App } from '@/lib/hono'

const route = createRoute({
	tags: ['Patient'],
	operationId: 'patient-get-all',
	method: 'get',
	path: '/patient',
	security: [{ cookieAuth: [] }],
	request: {
		query: querySchema,
	},
	responses: {
		200: {
			description: 'The client',
			content: {
				'application/json': {
					schema: z.array(PatientSelectSchema),
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route
export type PatientGetAllResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerPatientGetAll = (app: App) =>
	app.openapi(route, async (c) => {
		const { auth, db } = c.get('services')
		const session = c.get('session')
		//let pagination: any = undefined;
		//let result: any[] = [];

		if (!session)
			throw new ApiError({
				code: 'UNAUTHORIZED',
				message: 'You Need to login first to continue.',
			})

		const canReadPatient = await auth.api.hasPermission({
			headers: c.req.raw.headers,
			body: {
				permissions: {
					patient: ['read'], // This must match the structure in your access control
				},
			},
		})

		if (!canReadPatient) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to read a patients.',
			})
		}

		const organization = session.session.activeOrganizationId as string

		const limit = parseQueryInt(c.req.query('limit')) || 10
		const page = parseQueryInt(c.req.query('page')) || 1
		const total = await db.$count(patient, eq(patient.organization, organization))
		const offset = getOffset(page, limit)
		const pagination = paginatedData({ size: limit, page, count: total })

		const result = await db
			.select()
			.from(patient)
			.where(eq(patient.organization, organization))
			.orderBy(asc(patient.id)) // order by is mandatory
			.limit(limit) // the number of rows to return
			.offset(offset)

		/**if (page && limit) {
      const offset = getOffset(page, limit);
      result = await db
        .select()
        .from(patient)
        .where(eq(patient.organization, organization))
        .orderBy(asc(patient.id)) // order by is mandatory
        .limit(limit) // the number of rows to return
        .offset(offset);
      const total = await db.$count(patient, eq(patient.organization, organization));
      pagination = paginatedData({ size: limit, page, count: total });
    } else {
      result = await db.select().from(patient).where(eq(patient.organization, organization));
    }*/

		if (result.length < 1)
			throw new ApiError({
				code: 'NOT_FOUND',
				message: 'Patients not found.',
			})

		return c.json(
			{
				result: result,
				pagination: pagination,
			},
			200
		)
	})
