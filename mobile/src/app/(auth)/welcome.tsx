import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 px-6 justify-between py-10">

                {/* HERO SECTION */}
                <View className="items-center mt-10">
                    {/* Logo Circle */}
                    <View className="bg-[#FF5722] p-4 rounded-full mb-6 shadow-xl shadow-orange-200">
                        <Ionicons name="bicycle" size={40} color="white" />
                    </View>

                    <Text className="text-4xl font-extrabold text-gray-900 mb-3 text-center tracking-tight">FoodRush</Text>
                    <Text className="text-gray-500 text-center text-lg px-4 leading-6">
                        Order your favorite meals from top restaurants in your area.
                    </Text>
                </View>

                {/* ILLUSTRATION PLACEHOLDER (Optional) */}
                <View className="flex-1 justify-center items-center opacity-10">
                    <Ionicons name="fast-food" size={120} color="#FF5722" />
                </View>

                {/* BOTTOM BUTTONS */}
                <View className="w-full space-y-4 mb-8">
                    {/* Continue with Google */}
                    <TouchableOpacity
                        className="flex-row items-center justify-center bg-white border border-gray-200 py-4 rounded-full"
                        activeOpacity={0.7}
                    >
                        <Ionicons name="logo-google" size={22} color="black" style={{ marginRight: 12 }} />
                        <Text className="text-gray-900 font-bold text-lg">Continue with Google</Text>
                    </TouchableOpacity>

                    {/* Continue with Email */}
                    <TouchableOpacity
                        className="flex-row items-center justify-center bg-[#FF5722] py-4 rounded-full shadow-lg shadow-orange-500/30"
                        activeOpacity={0.8}
                        onPress={() => router.push('/(auth)/login')}
                    >
                        <Ionicons name="mail" size={22} color="white" style={{ marginRight: 12 }} />
                        <Text className="text-white font-bold text-lg">Continue with Email</Text>
                    </TouchableOpacity>

                    {/* Terms */}
                    <Text className="text-gray-400 text-xs text-center mt-4 px-8">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </Text>

                    {/* Register */}
                    <View className="flex-row justify-center mt-2">
                        <Text className="text-gray-600 text-base">Don't have an account? </Text>
                        <Link href="/(auth)/register" asChild>
                            <TouchableOpacity>
                                <Text className="text-[#FF5722] font-bold text-base">Sign Up</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>

            </View>
        </SafeAreaView>
    );
}
