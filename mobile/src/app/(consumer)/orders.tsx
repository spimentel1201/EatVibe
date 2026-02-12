import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const MOCK_ORDERS = [
    {
        id: 'ORD-001',
        restaurant: 'Burger King',
        date: 'Today, 12:30 PM',
        status: 'Delivering',
        price: 45.90,
        items: '2x Whopper, 1x Large Fries'
    },
    {
        id: 'ORD-002',
        restaurant: 'Pizza Hut',
        date: 'Yesterday, 8:15 PM',
        status: 'Completed',
        price: 64.00,
        items: '1x Family Pepperoni, 1x Garlic Bread'
    }
];

export default function OrdersScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="py-6 flex-row justify-between items-center">
                    <Text className="text-3xl font-black text-gray-900">My Orders</Text>
                    <TouchableOpacity className="bg-gray-50 p-3 rounded-full border border-gray-100">
                        <Ionicons name="filter-outline" size={20} color="#1F2937" />
                    </TouchableOpacity>
                </View>

                {/* Tabs (Simple) */}
                <View className="flex-row items-center space-x-6 mb-8 mt-2">
                    <TouchableOpacity className="border-b-4 border-[#FF5722] pb-2">
                        <Text className="text-lg font-black text-gray-900">Active</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="pb-2">
                        <Text className="text-lg font-bold text-gray-400">Past Orders</Text>
                    </TouchableOpacity>
                </View>

                {/* Orders List */}
                <View>
                    {MOCK_ORDERS.map((order) => (
                        <TouchableOpacity
                            key={order.id}
                            className="bg-gray-50/50 rounded-[32px] p-6 mb-6 border border-gray-100 shadow-sm shadow-gray-200/50"
                        >
                            <View className="flex-row justify-between items-start mb-4">
                                <View>
                                    <Text className="text-xl font-black text-gray-900">{order.restaurant}</Text>
                                    <Text className="text-gray-400 text-xs font-bold uppercase mt-1 tracking-widest">{order.date}</Text>
                                </View>
                                <View className={`px-4 py-1.5 rounded-full ${order.status === 'Delivering' ? 'bg-orange-100' : 'bg-green-100'}`}>
                                    <Text className={`font-bold text-xs ${order.status === 'Delivering' ? 'text-orange-600' : 'text-green-600'}`}>
                                        {order.status}
                                    </Text>
                                </View>
                            </View>

                            <View className="flex-row items-center border-t border-gray-100 pt-4 mt-2">
                                <View className="flex-1">
                                    <Text className="text-gray-500 text-sm italic" numberOfLines={1}>{order.items}</Text>
                                    <Text className="text-gray-900 font-black text-lg mt-1">S/ {order.price.toFixed(2)}</Text>
                                </View>
                                <TouchableOpacity className="bg-[#FF5722] px-6 py-3 rounded-full">
                                    <Text className="text-white font-bold">Track</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Empty State Mock for help */}
                {MOCK_ORDERS.length === 0 && (
                    <View className="py-20 items-center">
                        <Ionicons name="receipt-outline" size={80} color="#D1D5DB" />
                        <Text className="text-xl font-bold text-gray-900 mt-6">No orders yet</Text>
                        <Text className="text-gray-400 text-center mt-2 px-10">
                            Hungry? Order something delicious and it will appear here!
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
