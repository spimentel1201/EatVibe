import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

type OrderStatus = 'confirmed' | 'preparing' | 'on_the_way' | 'delivered';

interface OrderStep {
    status: OrderStatus;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    completed: boolean;
}

export default function OrderTrackingScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const orderId = params.id as string;

    const [currentStatus, _setCurrentStatus] = useState<OrderStatus>('preparing');
    const [estimatedTime, _setEstimatedTime] = useState('25-30 min');

    const orderSteps: OrderStep[] = [
        {
            status: 'confirmed',
            label: 'Order Confirmed',
            icon: 'checkmark-circle',
            completed: true,
        },
        {
            status: 'preparing',
            label: 'Preparing',
            icon: 'restaurant',
            completed: currentStatus === 'preparing' || currentStatus === 'on_the_way' || currentStatus === 'delivered',
        },
        {
            status: 'on_the_way',
            label: 'On the way',
            icon: 'bicycle',
            completed: currentStatus === 'on_the_way' || currentStatus === 'delivered',
        },
        {
            status: 'delivered',
            label: 'Delivered',
            icon: 'home',
            completed: currentStatus === 'delivered',
        },
    ];

    // Mock courier data
    const courier = {
        name: 'Carlos Mendoza',
        rating: 4.8,
        phone: '+51 987 654 321',
        avatar: 'https://i.pravatar.cc/150?img=12',
    };

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
                <View className="flex-1">
                    <Text className="text-2xl font-black text-gray-900">Order Tracking</Text>
                    <Text className="text-sm text-gray-500 mt-1">Order #{orderId || '12345'}</Text>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Map Placeholder */}
                <Animated.View
                    entering={FadeIn.duration(400)}
                    className="mx-6 mt-6 h-64 bg-gray-100 rounded-[32px] overflow-hidden relative"
                >
                    {/* Map would go here - using placeholder for now */}
                    <View className="flex-1 items-center justify-center">
                        <Ionicons name="map" size={64} color="#D1D5DB" />
                        <Text className="text-gray-400 mt-4 font-bold">Map View</Text>
                        <Text className="text-gray-400 text-sm">Google Maps integration pending</Text>
                    </View>

                    {/* ETA Badge */}
                    <View className="absolute top-4 left-4 bg-white rounded-full px-4 py-2 shadow-lg">
                        <View className="flex-row items-center">
                            <Ionicons name="time-outline" size={16} color="#FF5722" />
                            <Text className="text-sm font-bold text-gray-900 ml-2">{estimatedTime}</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Order Status Timeline */}
                <Animated.View entering={SlideInDown.delay(200).duration(400)} className="px-6 py-6">
                    <Text className="text-lg font-bold text-gray-900 mb-6">Order Status</Text>
                    <View className="space-y-4">
                        {orderSteps.map((step, index) => (
                            <View key={step.status} className="flex-row items-center">
                                {/* Icon */}
                                <View
                                    className={`w-12 h-12 rounded-full items-center justify-center ${step.completed ? 'bg-[#FF5722]' : 'bg-gray-100'
                                        }`}
                                >
                                    <Ionicons
                                        name={step.icon}
                                        size={24}
                                        color={step.completed ? '#FFFFFF' : '#9CA3AF'}
                                    />
                                </View>

                                {/* Label */}
                                <View className="flex-1 ml-4">
                                    <Text
                                        className={`text-base font-bold ${step.completed ? 'text-gray-900' : 'text-gray-400'
                                            }`}
                                    >
                                        {step.label}
                                    </Text>
                                    {step.completed && currentStatus === step.status && (
                                        <Text className="text-sm text-[#FF5722] mt-1">In progress...</Text>
                                    )}
                                </View>

                                {/* Checkmark */}
                                {step.completed && currentStatus !== step.status && (
                                    <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                                )}

                                {/* Connecting Line */}
                                {index < orderSteps.length - 1 && (
                                    <View
                                        className={`absolute left-6 top-12 w-0.5 h-8 ${step.completed ? 'bg-[#FF5722]' : 'bg-gray-200'
                                            }`}
                                        style={{ marginLeft: -1 }}
                                    />
                                )}
                            </View>
                        ))}
                    </View>
                </Animated.View>

                {/* Courier Info */}
                <Animated.View
                    entering={SlideInDown.delay(400).duration(400)}
                    className="mx-6 mb-6 bg-gray-50 rounded-[32px] p-6"
                >
                    <Text className="text-lg font-bold text-gray-900 mb-4">Your Courier</Text>
                    <View className="flex-row items-center">
                        <Image
                            source={{ uri: courier.avatar }}
                            className="w-16 h-16 rounded-full mr-4"
                        />
                        <View className="flex-1">
                            <Text className="text-base font-bold text-gray-900">{courier.name}</Text>
                            <View className="flex-row items-center mt-1">
                                <Ionicons name="star" size={16} color="#FBBF24" />
                                <Text className="text-sm text-gray-600 ml-1">{courier.rating}</Text>
                            </View>
                        </View>
                        <View className="flex-row space-x-2">
                            <TouchableOpacity className="w-12 h-12 rounded-full bg-[#FF5722] items-center justify-center">
                                <Ionicons name="call" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                            <TouchableOpacity className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center">
                                <Ionicons name="chatbubble" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>

                {/* Order Details */}
                <View className="px-6 pb-8">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Order Details</Text>
                    <View className="bg-gray-50 rounded-[24px] p-4">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-sm text-gray-600">Restaurant</Text>
                            <Text className="text-sm font-bold text-gray-900">Burger King</Text>
                        </View>
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-sm text-gray-600">Items</Text>
                            <Text className="text-sm font-bold text-gray-900">3 items</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-sm text-gray-600">Total</Text>
                            <Text className="text-sm font-bold text-[#FF5722]">S/ 45.90</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
