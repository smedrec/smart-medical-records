import { updateApiClientApiKey } from '@/lib/api-client-config'
import SocketIOManager from '@/lib/socketio-manager'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import type { ReactNode } from 'react'

export const connectionStatusActions = {
	setUnauthorized: (message: string) => {
		console.warn('setUnauthorized called before ConnectionContext is ready', message)
	},
	setOfflineStatus: (isOffline: boolean) => {
		console.warn('setOfflineStatus called before ConnectionContext is ready', isOffline)
	},
}

export type ConnectionStatusType =
	| 'loading'
	| 'connected'
	| 'reconnecting'
	| 'error'
	| 'unauthorized'

interface ConnectionContextType {
	status: ConnectionStatusType
	error: string | null
	setUnauthorizedFromApi: (message: string) => void
	setOfflineStatusFromProvider: (isOffline: boolean) => void
	refreshApiClient: (newApiKey?: string | null) => void
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined)

export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
	const [status, setStatus] = useState<ConnectionStatusType>('loading')
	const [error, setError] = useState<string | null>(null)
	const isFirstConnect = useRef(true)
	const socketManager = SocketIOManager.getInstance()

	const setUnauthorizedFromApi = useCallback(
		(message: string) => {
			setStatus('unauthorized')
			setError(message)
			toast.error(
				<>
					<h1>Authorization Required</h1>
					<div className="flex items-center gap-2">
						<span>Please provide a valid API Key.</span>
					</div>
				</>
			)
		},
		[toast]
	)

	const setOfflineStatusFromProvider = useCallback(
		(isOffline: boolean) => {
			if (isOffline) {
				if (status !== 'error' && status !== 'unauthorized') {
					setStatus('error')
					setError('Network connection appears to be offline.')
					toast.error(
						<>
							<h1>Network Offline</h1>
							<div className="flex items-center gap-2">
								<span>Please check your internet connection.</span>
							</div>
						</>
					)
				}
			} else {
				if (status === 'error' && error?.includes('offline')) {
				}
			}
		},
		[status, error, toast]
	)

	const refreshApiClient = useCallback((newApiKey?: string | null) => {
		try {
			// Update localStorage if a new API key is provided
			if (newApiKey !== undefined) {
				updateApiClientApiKey(newApiKey)
			}

			// Refresh the ElizaClient instance with new configuration
			// Client refresh not needed with direct client pattern

			console.log('API client refreshed with new configuration')
		} catch (error) {
			console.error('Failed to refresh API client:', error)
		}
	}, [])

	useEffect(() => {
		connectionStatusActions.setUnauthorized = setUnauthorizedFromApi
		connectionStatusActions.setOfflineStatus = setOfflineStatusFromProvider
	}, [setUnauthorizedFromApi, setOfflineStatusFromProvider])

	useEffect(() => {
		const onConnect = () => {
			setStatus('connected')
			setError(null)
			if (connectionStatusActions.setOfflineStatus) {
				connectionStatusActions.setOfflineStatus(false)
			}

			if (isFirstConnect.current) {
				isFirstConnect.current = false
			} else {
				toast.success(
					<>
						<h1>Connection Restored</h1>
						<div className="flex items-center gap-2">
							<span>Successfully reconnected to the Eliza server.</span>
						</div>
					</>
				)
			}
		}

		const onDisconnect = (reason: string) => {
			setStatus('error')
			setError(`Connection lost: ${reason}`)
			if (connectionStatusActions.setOfflineStatus) {
				connectionStatusActions.setOfflineStatus(true)
			}
			toast.error(
				<>
					<h1>Connection Lost</h1>
					<div className="flex items-center gap-2">
						<span>Attempting to reconnect to server…</span>
					</div>
				</>
			)
		}

		const onReconnectAttempt = () => {
			setStatus('reconnecting')
			setError('Reconnecting...')
		}

		const onConnectError = (err: Error) => {
			setStatus('error')
			setError(err.message)
			if (connectionStatusActions.setOfflineStatus) {
				connectionStatusActions.setOfflineStatus(true)
			}
		}

		const onUnauthorized = (reason: string) => {
			setStatus('unauthorized')
			setError(`Unauthorized: ${reason}`)
			toast.error(
				<>
					<h1>Unauthorized</h1>
					<div className="flex items-center gap-2">
						<span>Please log in again.</span>
					</div>
				</>
			)
		}

		socketManager.on('connect', onConnect)
		socketManager.on('disconnect', onDisconnect)
		socketManager.on('reconnect', onConnect)
		socketManager.on('reconnect_attempt', onReconnectAttempt)
		socketManager.on('connect_error', onConnectError)
		socketManager.on('unauthorized', onUnauthorized)

		if (SocketIOManager.isConnected()) {
			onConnect()
		}

		return () => {
			socketManager.off('connect', onConnect)
			socketManager.off('disconnect', onDisconnect)
			socketManager.off('reconnect', onConnect)
			socketManager.off('reconnect_attempt', onReconnectAttempt)
			socketManager.off('connect_error', onConnectError)
			socketManager.off('unauthorized', onUnauthorized)
		}
	}, [toast, socketManager, setOfflineStatusFromProvider])

	return (
		<ConnectionContext.Provider
			value={{
				status,
				error,
				setUnauthorizedFromApi,
				setOfflineStatusFromProvider,
				refreshApiClient,
			}}
		>
			{children}
		</ConnectionContext.Provider>
	)
}

export const useConnection = () => {
	const ctx = useContext(ConnectionContext)
	if (!ctx) {
		throw new Error('useConnection must be inside ConnectionProvider')
	}
	return ctx
}
