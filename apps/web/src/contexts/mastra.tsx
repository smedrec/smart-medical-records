import { createMastraClient } from '@/lib/ai/client'
import React, { createContext, useContext } from 'react'

import type { MastraClient } from '@mastra/client-js'
import type { ReactNode } from 'react'

type MastraClientContextType = {
	client: MastraClient
}

const MastraClientContext = createContext<MastraClientContextType | undefined>(undefined)

export const MastraClientProvider = ({
	children,
	baseUrl,
	headers,
}: {
	children: ReactNode
	baseUrl?: string
	headers?: Record<string, string>
}) => {
	const client = createMastraClient(baseUrl, headers)

	return <MastraClientContext.Provider value={{ client }}>{children}</MastraClientContext.Provider>
}

export const useMastraClient = () => {
	const context = useContext(MastraClientContext)
	if (context === undefined) {
		throw new Error('useMastraClient must be used within a MastraClientProvider')
	}
	return context.client
}
