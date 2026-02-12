import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Mock payment methods
const MOCK_PAYMENTS = [
    {
        id: 'pm-1',
        type: 'Visa',
        last4: '4242',
        expiry: '12/28',
        isDefault: true,
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png',
        color: '#1A1F71', // Visa blue
    },
    {
        id: 'pm-2',
        type: 'MasterCard',
        last4: '8888',
        expiry: '09/26',
        isDefault: false,
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png',
        color: '#EB001B', // MasterCard red (or orange-ish)
    },
];

export default function PaymentsScreen() {
    const router = useRouter();
    const [payments, setPayments] = useState(MOCK_PAYMENTS);

    const handleAddPayment = () => {
        // TODO: Navigate to add payment method screen or integrate Stripe
        console.log('Adding new payment method...');
    };

    const handleDelete = (id: string, event: any) => {
        event.stopPropagation();
        setPayments(payments.filter(pm => pm.id !== id));
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
                <Text className="text-2xl font-black text-gray-900">Payment Methods</Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                {payments.length === 0 ? (
                    <View className="items-center justify-center py-20">
                        <Ionicons name="card-outline" size={80} color="#D1D5DB" />
                        <Text className="text-xl font-bold text-gray-900 mt-4">No cards saved</Text>
                        <Text className="text-gray-400 text-center mt-2 px-10">
                            Add a payment method for faster checkout.
                        </Text>
                    </View>
                ) : (
                    <View className="space-y-6">
                        {payments.map((pm, index) => (
                            <Animated.View
                                key={pm.id}
                                entering={FadeInDown.delay(index * 100).duration(400)}
                            >
                                <TouchableOpacity
                                    className="rounded-[24px] p-6 relative overflow-hidden h-48 justify-between shadow-lg shadow-gray-300/50"
                                    style={{ backgroundColor: pm.color }}
                                >
                                    {/* Background Pattern (Simple Circles for now) */}
                                    <View className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
                                    <View className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8" />

                                    <View className="flex-row justify-between items-start">
                                        <Text className="text-white font-bold text-xl tracking-wider italic">{pm.type}</Text>
                                        {/* Ideally use logo image here */}

                                        {pm.isDefault && (
                                            <View className="bg-white/20 px-3 py-1 rounded-full">
                                                <Text className="text-white text-xs font-bold">Default</Text>
                                            </View>
                                        )}
                                    </View>

                                    <View className="flex-row items-center space-x-4">
                                        <Text className="text-white text-xl tracking-[4px]">••••</Text>
                                        <Text className="text-white text-xl tracking-[4px]">••••</Text>
                                        <Text className="text-white text-xl tracking-[4px]">••••</Text>
                                        <Text className="text-white text-xl font-bold tracking-widest">{pm.last4}</Text>
                                    </View>

                                    <View className="flex-row justify-between items-end">
                                        <View>
                                            <Text className="text-white/60 text-xs font-bold uppercase mb-1">Card Holder</Text>
                                            <Text className="text-white font-bold text-base">ALEXANDER PEREZ</Text>
                                            {/* Ideally dynamic name from user profile */}
                                        </View>
                                        <View>
                                            <Text className="text-white/60 text-xs font-bold uppercase mb-1">Expires</Text>
                                            <Text className="text-white font-bold text-base">{pm.expiry}</Text>
                                        </View>

                                        <TouchableOpacity
                                            onPress={(e) => handleDelete(pm.id, e)}
                                            className="bg-white/20 p-2 rounded-full"
                                        >
                                            <Ionicons name="trash-outline" size={18} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Add Payment Button */}
            <View className="px-6 py-6 border-t border-gray-100">
                <TouchableOpacity
                    onPress={handleAddPayment}
                    className="bg-[#FF5722] h-14 rounded-full items-center justify-center shadow-lg shadow-orange-500/30 flex-row"
                >
                    <Ionicons name="add" size={24} color="white" className="mr-2" />
                    <Text className="text-white font-black text-lg">Add New Card</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
