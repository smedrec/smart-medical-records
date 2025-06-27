import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignUpScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-4xl font-bold text-blue-600 mb-12">FMDA</Text>

        <View className="w-full bg-white p-8 rounded-xl shadow-lg">
          <Text className="text-2xl font-semibold text-gray-700 mb-6 text-center">Create Account</Text>

          <TextInput
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 mb-4"
            placeholder="Full Name"
            autoCapitalize="words"
          />

          <TextInput
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 mb-4"
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 mb-4"
            placeholder="Password"
            secureTextEntry
          />

          <TextInput
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 mb-6"
            placeholder="Confirm Password"
            secureTextEntry
          />

          <TouchableOpacity
            className="bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-3 text-center mb-4"
            // onPress={() => { /* Handle sign up */ }}
          >
            <Text className="text-white text-base font-semibold text-center">Sign Up</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center mt-4">
            <Text className="text-sm text-gray-600">Already have an account? </Text>
            <TouchableOpacity>
              <Text className="text-sm text-blue-600 hover:underline">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;
