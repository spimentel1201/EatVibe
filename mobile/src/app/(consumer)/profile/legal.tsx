import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function LegalScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const type = params.type as 'terms' | 'privacy' || 'terms';

    const title = type === 'terms' ? 'Terms of Service' : 'Privacy Policy';

    // Mock content based on type
    const content = type === 'terms' ? (
        <View className="space-y-4">
            <Text className="text-gray-900 font-bold text-lg">1. Acceptance of Terms</Text>
            <Text className="text-gray-600 leading-6">
                By accessing and using EatVibe, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </Text>

            <Text className="text-gray-900 font-bold text-lg mt-4">2. Service Description</Text>
            <Text className="text-gray-600 leading-6">
                EatVibe allows you to order food from local restaurants and have it delivered to your doorstep. We act as an intermediary between you and the restaurant.
            </Text>

            <Text className="text-gray-900 font-bold text-lg mt-4">3. User Account</Text>
            <Text className="text-gray-600 leading-6">
                You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or device, and you agree to accept responsibility for all activities that occur under your account or password.
            </Text>

            <Text className="text-gray-900 font-bold text-lg mt-4">4. Refunds and Cancellations</Text>
            <Text className="text-gray-600 leading-6">
                Orders can be cancelled within 5 minutes of placing them. Refunds are processed according to our specific refund policy which depends on the restaurant's preparation status.
            </Text>
        </View>
    ) : (
        <View className="space-y-4">
            <Text className="text-gray-900 font-bold text-lg">1. Information We Collect</Text>
            <Text className="text-gray-600 leading-6">
                We collect information you provide directly to us, such as your name, email address, phone number, and delivery address when you create an account or place an order.
            </Text>

            <Text className="text-gray-900 font-bold text-lg mt-4">2. How We Use Information</Text>
            <Text className="text-gray-600 leading-6">
                We use the information we collect to provide, maintain, and improve our services, such as to process your orders, communicate with you, and personalize your experience.
            </Text>

            <Text className="text-gray-900 font-bold text-lg mt-4">3. Information Sharing</Text>
            <Text className="text-gray-600 leading-6">
                We may share your information with restaurants and couriers to fulfill your orders. We do not sell your personal information to third parties.
            </Text>

            <Text className="text-gray-900 font-bold text-lg mt-4">4. Data Security</Text>
            <Text className="text-gray-600 leading-6">
                We use reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
            </Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            {/* Header */}
            <View className="flex-row items-center px-6 py-4 border-b border-gray-100">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-4"
                >
                    <Ionicons name="arrow-back" size={20} color="#1F2937" />
                </TouchableOpacity>
                <Text className="text-2xl font-black text-gray-900">{title}</Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.duration(400)} className="pb-12">
                    {content}

                    <Text className="text-gray-400 text-sm mt-8 text-center">
                        Last updated: Feb 12, 2026
                    </Text>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}
