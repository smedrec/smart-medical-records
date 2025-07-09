import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const LoginScreen = () => {
	return (
		<SafeAreaView className="flex-1 bg-gray-100">
			<View className="flex-1 justify-center items-center p-6">
				<Text className="text-4xl font-bold text-blue-600 mb-12">FMDA</Text>

				<View className="w-full bg-white p-8 rounded-xl shadow-lg">
					<Text className="text-2xl font-semibold text-gray-700 mb-6 text-center">Login</Text>

					<TextInput
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 mb-4"
						placeholder="Email"
						keyboardType="email-address"
						autoCapitalize="none"
					/>

					<TextInput
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 mb-6"
						placeholder="Password"
						secureTextEntry
					/>

					<TouchableOpacity
						className="bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-3 text-center mb-4"
						// onPress={() => { /* Handle login */ }}
					>
						<Text className="text-white text-base font-semibold text-center">Sign In</Text>
					</TouchableOpacity>

					<View className="flex-row justify-between items-center mt-4">
						<TouchableOpacity>
							<Text className="text-sm text-blue-600 hover:underline">Forgot Password?</Text>
						</TouchableOpacity>
						<TouchableOpacity>
							<Text className="text-sm text-blue-600 hover:underline">Sign Up</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</SafeAreaView>
	)
}

export default LoginScreen
