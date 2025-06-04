import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
	baseURL: 'http://localhost:8801/auth',
})
