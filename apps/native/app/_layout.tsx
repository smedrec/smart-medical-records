import '@/polyfills'

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import type { Theme } from '@react-navigation/native'

import '../global.css'

import { setAndroidNavigationBar } from '@/lib/android-navigation-bar'
import { NAV_THEME } from '@/lib/constants'
import { useColorScheme } from '@/lib/use-color-scheme'
import React, { useRef } from 'react'
import { Platform } from 'react-native'

const LIGHT_THEME: Theme = {
	...DefaultTheme,
	colors: NAV_THEME.light,
}
const DARK_THEME: Theme = {
	...DarkTheme,
	colors: NAV_THEME.dark,
}

export const unstable_settings = {
	initialRouteName: '(drawer)',
}

const queryClient = new QueryClient()

export default function RootLayout() {
	const hasMounted = useRef(false)
	const { colorScheme, isDarkColorScheme } = useColorScheme()
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false)

	useIsomorphicLayoutEffect(() => {
		if (hasMounted.current) {
			return
		}

		if (Platform.OS === 'web') {
			document.documentElement.classList.add('bg-background')
		}
		setAndroidNavigationBar(colorScheme)
		setIsColorSchemeLoaded(true)
		hasMounted.current = true
	}, [])

	if (!isColorSchemeLoaded) {
		return null
	}
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
				<StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
				<GestureHandlerRootView style={{ flex: 1 }}>
					<Stack>
						<Stack.Screen name="(drawer)" options={{ headerShown: false }} />
						<Stack.Screen name="modal" options={{ title: 'Modal', presentation: 'modal' }} />
					</Stack>
				</GestureHandlerRootView>
			</ThemeProvider>
		</QueryClientProvider>
	)
}

const useIsomorphicLayoutEffect =
	Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect
