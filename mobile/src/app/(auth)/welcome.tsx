import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center p-6">
            <StatusBar style="dark" />

            <View className="items-center mb-10 w-full">
                {/* Logo Placeholder */}
                <View className="bg-orange-100 p-6 rounded-full mb-6">
                    <View className="w-20 h-20 bg-orange-500 rounded-full items-center justify-center shadow-lg shadow-orange-300">
                        <Text className="text-4xl font-bold text-white">E</Text>
                    </View>
                </View>

                <Text className="text-3xl font-black text-gray-900 mb-2 text-center">EatVibe</Text>
                <Text className="text-gray-500 text-center text-lg px-4 font-medium leading-6">
                    Delicious food delivered to your doorstep in minutes.
                </Text>
            </View>

            <View className="w-full max-w-sm">
                <TouchableOpacity
                    className="w-full bg-orange-500 py-4 rounded-2xl shadow-lg shadow-orange-300 active:bg-orange-600 mb-4"
                    onPress={() => router.push('/(auth)/login')}
                >
                    <Text className="text-white text-center font-bold text-lg">Log In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="w-full bg-white border-2 border-orange-500 py-4 rounded-2xl active:bg-orange-50"
                    onPress={() => router.push('/(auth)/register')}
                >
                    <Text className="text-orange-500 text-center font-bold text-lg">Create Account</Text>
                </TouchableOpacity>
            </View>

            <View className="absolute bottom-10 w-full items-center">
                <Text className="text-gray-400 text-xs text-center px-10">
                    By continuing, you agree to our Terms of Service & Privacy Policy.
                </Text>
            </View>
        </SafeAreaView>
    );
}
