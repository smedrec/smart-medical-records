import { createServerFn } from '@tanstack/react-start'
import { getHeaders } from '@tanstack/react-start/server'

import { fhir } from '@repo/fhir'

type GetResourceParams = {
	resourceType: string
	id: string
}

export const getResource = createServerFn({ method: 'GET' })
	.validator((params: GetResourceParams) => params)
	.handler(async ({ data }) => {
		const { data: resultData } = await (fhir.GET as any)(`/${data.resourceType}/{id}`, {
			params: {
				path: { id: data.id },
			},
			Headers: getHeaders(),
		})
		return resultData
	})

export const getResources = createServerFn({ method: 'GET' })
	.validator((data: { resourceType: string }) => data)
	.handler(async ({ data }) => {
		const { data: resultData } = await (fhir.GET as any)(`/${data.resourceType}`, {
			Headers: getHeaders(),
		})
		return resultData
	})
