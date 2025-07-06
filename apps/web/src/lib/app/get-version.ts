import { app } from '@/lib/app'
import { createServerFn } from '@tanstack/react-start'

const getVersion = createServerFn({ method: 'GET' }).handler(async () => {
	try {
		const data = await app.version()
		return data
	} catch (error) {
		console.error('Error getting the api version:', error)
		throw new Error(error as string)
	}
})

export { getVersion }
