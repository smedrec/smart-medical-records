import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { ClipboardList, LogIn, MessageCircle, UserCircle } from 'lucide-react-native' // Import icons
import React from 'react'

import ChatScreen from '../screens/ChatScreen'
import DataDisplayScreen from '../screens/DataDisplayScreen'
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'
import LoginScreen from '../screens/LoginScreen' // Assuming you might have a profile or settings screen
import SignUpScreen from '../screens/SignUpScreen'

const Tab = createBottomTabNavigator()

// Placeholder for Profile/Settings screen
const ProfileScreenPlaceholder = () => <LoginScreen /> // Reuse Login for now

// This will be the navigator after authentication
const MainAppTabs = () => {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let IconComponent
					if (route.name === 'Chat') {
						IconComponent = MessageCircle
					} else if (route.name === 'Data') {
						IconComponent = ClipboardList
					} else if (route.name === 'Profile') {
						IconComponent = UserCircle
					}
					return IconComponent ? (
						<IconComponent color={color} size={focused ? size + 2 : size} />
					) : null
				},
				tabBarActiveTintColor: '#3b82f6', // blue-500
				tabBarInactiveTintColor: 'gray',
				headerShown: false, // We handle headers in each screen
				tabBarStyle: {
					backgroundColor: 'white',
					borderTopWidth: 1,
					borderTopColor: '#e5e7eb', // gray-200
				},
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: '500',
				},
			})}
		>
			<Tab.Screen name="Chat" component={ChatScreen} />
			<Tab.Screen name="Data" component={DataDisplayScreen} />
			<Tab.Screen
				name="Profile"
				component={ProfileScreenPlaceholder}
				options={{ tabBarLabel: 'Account' }}
			/>
		</Tab.Navigator>
	)
}

// For now, we assume a simple state for authentication status.
// This will be replaced by better-auth integration later.
const AppNavigator = ({ isAuthenticated = false }) => {
	// Based on isAuthenticated, we'll show Auth screens or Main App
	// This is a simplified version. A full app would use a StackNavigator for auth flow.

	if (!isAuthenticated) {
		// In a real app, you'd have a stack navigator for Login, SignUp, ForgotPassword
		// For simplicity now, we'll just show Login, but you can switch these out to test:
		// return <LoginScreen />;
		// return <SignUpScreen />;
		// return <ForgotPasswordScreen />;

		// To see the main app for development, we can temporarily bypass auth:
		return (
			<NavigationContainer>
				<MainAppTabs />
			</NavigationContainer>
		)
		// Or, to show login:
		// return <LoginScreen />;
	}

	return (
		<NavigationContainer>
			<MainAppTabs />
		</NavigationContainer>
	)
}

export default AppNavigator
