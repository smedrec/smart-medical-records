import { ApiError, openApiErrorResponses } from '@/lib/errors'
import { createId } from '@/lib/utils/id'
import { createRoute, z } from '@hono/zod-openapi'

import type { App } from '@/lib/hono'

const route = createRoute({
	tags: ['User'],
	operationId: 'user-upload-avatar',
	method: 'post',
	path: '/user/upload-avatar',
	security: [{ cookieAuth: [] }],
	request: {
		body: {
			required: true,
			description: 'The avatar to upload',
			content: {
				'multipart/form-data': {
					schema: z.object({
						file: z
							.any()
							.refine((file) => {
								if (file.type !== 'image/png') {
									throw new ApiError({
										code: 'BAD_REQUEST',
										message: 'Only PNG files are allowed for avatar uploads',
									})
								}
								return true
							})
							.openapi({ description: 'file' }),
					}),
				},
			},
		},
	},
	responses: {
		201: {
			description: 'Avatar upload successful',
			content: {
				'application/json': {
					schema: z.object({
						key: z.string().openapi({ description: 'Avatar image key' }),
					}),
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route
export type UploadAvatarRequest = z.infer<
	(typeof route.request.body.content)['multipart/form-data']['schema']
>
export type UploadAvatarResponse = z.infer<
	(typeof route.responses)[201]['content']['application/json']['schema']
>

export const registerUploadAvatar = (app: App) =>
	app.openapi(route, async (c) => {
		const { cerbos } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({
				code: 'UNAUTHORIZED',
				message: 'You Need to login first to continue.',
			})

		const role = session.session.activeOrganizationRole

		const { file } = await c.req.parseBody()
		if (file instanceof File) {
			const key = createId('avatar')
			const fileBuffer = await file.arrayBuffer()
			const fullName = file.name
			const ext = fullName.split('.').pop()
			const path = `images/${key}.${ext}`
			try {
				if (!c.env.IMAGES_DEV) {
					throw new ApiError({
						code: 'INTERNAL_SERVER_ERROR',
						message:
							'IMAGES_DEV R2 binding is not configured. Please check the environment configuration.',
					})
				}
				const image = await c.env.IMAGES_DEV.put(path, fileBuffer)
				return c.json(
					{
						key: `${image?.key}`,
					},
					201
				)
			} catch (error) {
				// Handle the ApiError thrown above or other errors
				if (error instanceof ApiError) {
					throw error
				}
				throw new ApiError({
					code: 'INTERNAL_SERVER_ERROR',
					message: `An error occurred while uploading the avatar. ${error instanceof Error ? error.message : 'Unknown error'}`,
				})
			}
		} else {
			throw new ApiError({
				code: 'BAD_REQUEST',
				message: `Invalid file type. Only PNG files are allowed for avatar uploads.`,
			})
		}
	})
