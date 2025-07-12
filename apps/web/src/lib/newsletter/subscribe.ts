import { app } from '@/lib/app'
import { createServerFn } from '@tanstack/react-start'

interface SubscribeParams {
	email: string
	list: string
	metadata: Array<Record<string, any>>
}

const subscribe = createServerFn({ method: 'POST' })
	.validator((params: SubscribeParams) => params)
	.handler(async ({ data }) => {
		const { email, list, metadata } = data
		try {
			const data = await app.newsletterSubscribe(email, list, metadata)
			return data.success
		} catch (error) {
			console.error('Error subscribe to newsletter:', error)
			throw new Error(error as string)
		}
	})

export { subscribe }
