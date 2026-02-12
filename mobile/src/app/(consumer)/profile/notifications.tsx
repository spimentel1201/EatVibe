import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function NotificationSettingsScreen() {
    const router = useRouter();

    // Notification preferences state
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [promosEnabled, setPromosEnabled] = useState(false);
    const [orderUpdates, setOrderUpdates] = useState(true);
    const [deliveryUpdates, setDeliveryUpdates] = useState(true);

    const toggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, value: boolean) => {
        setter(!value);
        // TODO: Sync with backend
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
                <Text className="text-2xl font-black text-gray-900">Notifications</Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.duration(400)} className="space-y-8">

                    {/* General Section */}
                    <View>
                        <Text className="text-gray-500 font-bold uppercase text-xs mb-4">General</Text>
                        <View className="bg-gray-50 rounded-[24px] p-5 border border-gray-100 space-y-6">
                            <View className="flex-row justify-between items-center">
                                <View className="flex-1 pr-4">
                                    <Text className="text-lg font-bold text-gray-900">Push Notifications</Text>
                                    <Text className="text-gray-500 text-sm mt-1">Receive alerts on your device</Text>
                                </View>
                                <Switch
                                    trackColor={{ false: '#E5E7EB', true: '#FFCCBC' }}
                                    thumbColor={pushEnabled ? '#FF5722' : '#9CA3AF'}
                                    onValueChange={() => toggle(setPushEnabled, pushEnabled)}
                                    value={pushEnabled}
                                />
                            </View>

                            <View className="w-full h-px bg-gray-200" />

                            <View className="flex-row justify-between items-center">
                                <View className="flex-1 pr-4">
                                    <Text className="text-lg font-bold text-gray-900">Email Notifications</Text>
                                    <Text className="text-gray-500 text-sm mt-1">Receive updates via email</Text>
                                </View>
                                <Switch
                                    trackColor={{ false: '#E5E7EB', true: '#FFCCBC' }}
                                    thumbColor={emailEnabled ? '#FF5722' : '#9CA3AF'}
                                    onValueChange={() => toggle(setEmailEnabled, emailEnabled)}
                                    value={emailEnabled}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Orders Section */}
                    <View>
                        <Text className="text-gray-500 font-bold uppercase text-xs mb-4">Orders & Delivery</Text>
                        <View className="bg-gray-50 rounded-[24px] p-5 border border-gray-100 space-y-6">
                            <View className="flex-row justify-between items-center">
                                <View className="flex-1 pr-4">
                                    <Text className="text-lg font-bold text-gray-900">Order Updates</Text>
                                    <Text className="text-gray-500 text-sm mt-1">Status changes and preparation</Text>
                                </View>
                                <Switch
                                    trackColor={{ false: '#E5E7EB', true: '#FFCCBC' }}
                                    thumbColor={orderUpdates ? '#FF5722' : '#9CA3AF'}
                                    onValueChange={() => toggle(setOrderUpdates, orderUpdates)}
                                    value={orderUpdates}
                                />
                            </View>

                            <View className="w-full h-px bg-gray-200" />

                            <View className="flex-row justify-between items-center">
                                <View className="flex-1 pr-4">
                                    <Text className="text-lg font-bold text-gray-900">Courier Updates</Text>
                                    <Text className="text-gray-500 text-sm mt-1">Location and arrival alerts</Text>
                                </View>
                                <Switch
                                    trackColor={{ false: '#E5E7EB', true: '#FFCCBC' }}
                                    thumbColor={deliveryUpdates ? '#FF5722' : '#9CA3AF'}
                                    onValueChange={() => toggle(setDeliveryUpdates, deliveryUpdates)}
                                    value={deliveryUpdates}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Marketing Section */}
                    <View>
                        <Text className="text-gray-500 font-bold uppercase text-xs mb-4">Marketing</Text>
                        <View className="bg-gray-50 rounded-[24px] p-5 border border-gray-100">
                            <View className="flex-row justify-between items-center">
                                <View className="flex-1 pr-4">
                                    <Text className="text-lg font-bold text-gray-900">Promotions & Offers</Text>
                                    <Text className="text-gray-500 text-sm mt-1">Discounts and special deals</Text>
                                </View>
                                <Switch
                                    trackColor={{ false: '#E5E7EB', true: '#FFCCBC' }}
                                    thumbColor={promosEnabled ? '#FF5722' : '#9CA3AF'}
                                    onValueChange={() => toggle(setPromosEnabled, promosEnabled)}
                                    value={promosEnabled}
                                />
                            </View>
                        </View>
                    </View>

                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}
