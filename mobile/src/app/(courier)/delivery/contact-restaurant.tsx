import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ContactRestaurantScreen() {
    const router = useRouter();
    const [message, setMessage] = useState('');

    const restaurantInfo = {
        name: 'Burger Palace',
        address: '123 Main St, Downtown',
        phone: '+1 (555) 123-4567',
        orderNumber: '#FR-4521',
    };

    const quickMessages = [
        "I'm here to pick up the order",
        "Where should I park?",
        "Is the order ready?",
        "I'm running a few minutes late",
        "Can you bring the order outside?",
    ];

    const handleCall = () => {
        Linking.openURL(`tel:${restaurantInfo.phone}`);
    };

    const handleSendMessage = (msg: string) => {
        console.log('Sending message:', msg);
        setMessage('');
    };

    const handleOrderNotReady = () => {
        Alert.alert(
            'Order Not Ready',
            'Report that the order is not ready for pickup',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Report', onPress: () => console.log('Reported') },
            ]
        );
    };

    return (
        <View className="flex-1 bg-[#0A0E27]">
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4 border-b border-[#1E293B]">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View className="flex-1 ml-4">
                        <Text className="text-white text-lg font-bold">{restaurantInfo.name}</Text>
                        <Text className="text-gray-400 text-sm">Restaurant</Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleCall}
                        className="w-12 h-12 rounded-full bg-[#3B82F6] items-center justify-center"
                    >
                        <Ionicons name="call" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                    {/* Restaurant Info */}
                    <View className="bg-[#1A1F3A] rounded-2xl p-4 my-6 border border-[#2A2F4A]">
                        <View className="flex-row items-center mb-3">
                            <View className="w-12 h-12 rounded-full bg-[#3B82F6]/20 items-center justify-center mr-4">
                                <Ionicons name="restaurant" size={24} color="#3B82F6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-bold text-base mb-1">
                                    Pickup Location
                                </Text>
                                <Text className="text-gray-400 text-sm">
                                    {restaurantInfo.address}
                                </Text>
                            </View>
                        </View>
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <Ionicons name="call" size={16} color="#64748B" />
                                <Text className="text-gray-400 text-sm ml-2">
                                    {restaurantInfo.phone}
                                </Text>
                            </View>
                            <View className="bg-[#3B82F6]/20 px-3 py-1 rounded-full">
                                <Text className="text-[#3B82F6] text-xs font-bold">
                                    {restaurantInfo.orderNumber}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Quick Messages */}
                    <Text className="text-gray-400 text-xs font-bold tracking-wider mb-3">
                        QUICK MESSAGES
                    </Text>
                    {quickMessages.map((msg, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleSendMessage(msg)}
                            className="bg-[#1A1F3A] rounded-2xl p-4 mb-3 border border-[#2A2F4A] flex-row items-center justify-between"
                        >
                            <Text className="text-white flex-1">{msg}</Text>
                            <Ionicons name="send" size={20} color="#3B82F6" />
                        </TouchableOpacity>
                    ))}

                    {/* Action Buttons */}
                    <View className="gap-3 mt-4 mb-6">
                        <TouchableOpacity
                            onPress={handleOrderNotReady}
                            className="bg-[#1A1F3A] rounded-2xl py-4 border border-[#F59E0B] flex-row items-center justify-center"
                        >
                            <Ionicons name="time" size={20} color="#F59E0B" />
                            <Text className="text-[#F59E0B] font-semibold ml-2">
                                Order Not Ready
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/courier/delivery/report-issue' as any)}
                            className="bg-[#1A1F3A] rounded-2xl py-4 border border-[#EF4444] flex-row items-center justify-center"
                        >
                            <Ionicons name="warning" size={20} color="#EF4444" />
                            <Text className="text-[#EF4444] font-semibold ml-2">
                                Report Issue
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className="h-32" />
                </ScrollView>

                {/* Message Input */}
                <SafeAreaView edges={['bottom']} className="bg-[#0A0E27]">
                    <View className="px-6 py-4 border-t border-[#1E293B]">
                        <View className="flex-row items-center bg-[#1A1F3A] rounded-full px-4 border border-[#2A2F4A]">
                            <TextInput
                                value={message}
                                onChangeText={setMessage}
                                placeholder="Type a message..."
                                placeholderTextColor="#64748B"
                                className="flex-1 text-white py-3"
                                multiline
                            />
                            <TouchableOpacity
                                onPress={() => handleSendMessage(message)}
                                disabled={!message.trim()}
                                className={`w-10 h-10 rounded-full items-center justify-center ml-2 ${message.trim() ? 'bg-[#3B82F6]' : 'bg-[#2A2F4A]'
                                    }`}
                            >
                                <Ionicons
                                    name="send"
                                    size={20}
                                    color={message.trim() ? '#FFF' : '#64748B'}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </SafeAreaView>
        </View>
    );
}
