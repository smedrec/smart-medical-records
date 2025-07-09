import React, { useCallback, useState } from 'react'
import {
	FlatList,
	KeyboardAvoidingView,
	Platform,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// import { MessageSquare, Send } from 'lucide-react-native'; // Example, if using lucide-react-native

interface Message {
	id: string
	text: string
	sender: 'user' | 'fmda'
	timestamp: Date
}

const ChatScreen = () => {
	const [messages, setMessages] = useState<Message[]>([])
	const [inputText, setInputText] = useState('')

	const handleSend = useCallback(() => {
		if (inputText.trim().length === 0) return

		const newMessage: Message = {
			id: Math.random().toString(),
			text: inputText.trim(),
			sender: 'user',
			timestamp: new Date(),
		}
		setMessages((prevMessages) => [newMessage, ...prevMessages])
		setInputText('')

		// Simulate FMDA response
		setTimeout(() => {
			const fmdaResponse: Message = {
				id: Math.random().toString(),
				text: `FMDA received: "${newMessage.text}"`,
				sender: 'fmda',
				timestamp: new Date(),
			}
			setMessages((prevMessages) => [fmdaResponse, ...prevMessages])
		}, 1000)
	}, [inputText])

	const renderMessage = ({ item }: { item: Message }) => (
		<View
			className={`my-2 p-3 rounded-xl max-w-[80%] ${
				item.sender === 'user' ? 'bg-blue-500 self-end' : 'bg-gray-300 self-start'
			}`}
		>
			<Text className={item.sender === 'user' ? 'text-white' : 'text-gray-800'}>{item.text}</Text>
			<Text
				className={`text-xs mt-1 ${item.sender === 'user' ? 'text-blue-200 text-right' : 'text-gray-500 text-left'}`}
			>
				{item.timestamp.toLocaleTimeString()}
			</Text>
		</View>
	)

	return (
		<SafeAreaView className="flex-1 bg-gray-100">
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				className="flex-1"
				keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
			>
				<View className="p-4 border-b border-gray-200 bg-white">
					<Text className="text-xl font-semibold text-center text-blue-600">FMDA Chat</Text>
				</View>

				<FlatList
					data={messages}
					renderItem={renderMessage}
					keyExtractor={(item) => item.id}
					inverted
					className="flex-1 p-4"
					contentContainerClassName="flex-grow justify-end"
				/>

				<View className="flex-row items-center p-3 border-t border-gray-200 bg-white">
					<TextInput
						className="flex-1 bg-gray-100 border border-gray-300 rounded-full py-3 px-4 mr-2 text-gray-800"
						placeholder="Type your message..."
						value={inputText}
						onChangeText={setInputText}
						onSubmitEditing={handleSend} // Allows sending with keyboard 'send' button
						blurOnSubmit={false} // Keep keyboard open on send for faster messaging
					/>
					<TouchableOpacity onPress={handleSend} className="bg-blue-500 rounded-full p-3">
						{/* Replace with an actual send icon later */}
						<Text className="text-white font-semibold">Send</Text>
						{/* <Send color="white" size={24} /> */}
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}

export default ChatScreen
