import { z } from '@hono/zod-openapi'

export const UserSelectResponseSchema = z.object({
	id: z.string().openapi({
		description: 'The user ID',
		example: 'DyNtFA1TzJvpeSt2V4di6hWJ10WQlXdi',
	}),
	name: z.string().openapi({
		description: 'The user name',
		example: 'John Doe',
	}),
	email: z.string().email().openapi({
		description: 'The user email',
		example: 'name@example.com',
	}),
	emailVerified: z
		.boolean()
		.openapi({
			description: 'Whether the user email is verified',
			example: true,
		})
		.nullable(),
	image: z
		.string()
		.url()
		.openapi({
			description: 'The user profile image URL',
			example: 'https://example.com/image.jpg',
		})
		.nullable(),
	role: z.string().openapi({
		description: 'The user role',
		example: 'admin',
	}),
	createdAt: z.string().datetime().openapi({
		description: 'The user creation date',
		example: '2023-10-01T12:00:00Z',
	}),
	updatedAt: z.string().datetime().openapi({
		description: 'The user last update date',
		example: '2023-10-01T12:00:00Z',
	}),
	banned: z
		.boolean()
		.openapi({
			description: 'Whether the user is banned',
			example: false,
		})
		.nullable(),
	banReason: z
		.string()
		.openapi({
			description: 'The reason for the user ban',
			example: 'Violation of terms of service',
		})
		.nullable(),
	banExpires: z
		.string()
		.datetime()
		.openapi({
			description: 'The date when the user ban expires',
			example: '2023-12-31T23:59:59Z',
		})
		.nullable(),
})

export const BaseResourceResponseSchema = z.object({
	id: z.string().length(32).openapi({
		description: 'The unique identifier of the resource',
		example: 'DyNtFA1TzJvpeSt2V4di6hWJ10WQlXdi', // Example ID
	}),
	version: z.number().openapi({
		description: 'The version of the resource',
		example: 1,
	}),
	ts: z.string().datetime().openapi({
		description: 'The timestamp of the resource',
		example: '2023-10-01T12:00:00Z', // Example timestamp
	}),
	status: z.enum(['create', 'updated', 'deleted', 'recreated']).nullable().openapi({
		description: 'The status of the resource',
		example: 'create',
	}),
	resource: z.object({}).openapi({
		description: 'The json object with the resource',
		example: '',
	}),
	organizationId: z.string().length(32).openapi({
		description: 'The ID of the organization associated with the resource',
		example: 'DyNtFA1TzJvpeSt2V4di6hWJ10WQlXdi', // Example organization ID
	}),
	createdBy: z.string().length(32).openapi({
		description: 'The ID of the user who created the resource',
		example: 'DyNtFA1TzJvpeSt2V4di6hWJ10WQlXdi', // Example user ID
	}),
	updatedBy: z.string().length(32).openapi({
		description: 'The ID of the user who last updated the resource',
		example: 'DyNtFA1TzJvpeSt2V4di6hWJ10WQlXdi', // Example user ID
	}),
})
