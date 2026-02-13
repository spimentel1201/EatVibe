import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// import Animated, { FadeInDown } from 'react-native-reanimated';

const MOCK_ORDERS = [
    {
        id: 'ORD-001',
        restaurant: 'Burger King',
        date: 'Today, 12:30 PM',
        status: 'Delivering',
        price: 45.90,
        items: '2x Whopper, 1x Large Fries',
        isActive: true,
    },
    {
        id: 'ORD-002',
        restaurant: 'Pizza Hut',
        date: 'Yesterday, 8:15 PM',
        status: 'Completed',
        price: 64.00,
        items: '1x Family Pepperoni, 1x Garlic Bread',
        isActive: false,
    },
    {
        id: 'ORD-003',
        restaurant: 'KFC',
        date: 'Feb 10, 2:45 PM',
        status: 'Completed',
        price: 38.50,
        items: '3x Chicken Bucket, 2x Coleslaw',
        isActive: false,
    },
];

export default function OrdersScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

    const filteredOrders = MOCK_ORDERS.filter((order) =>
        activeTab === 'active' ? order.isActive : !order.isActive
    );

    const handleTrackOrder = (orderId: string) => {
        router.push(`/order/tracking?id=${orderId}` as any);
    };

    const handleReorder = (orderId: string) => {
        // TODO: Implement reorder logic
        console.log('Reordering:', orderId);
    };

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

                {/* Tabs */}
                <View className="flex-row items-center mb-8 mt-2">
                    <TouchableOpacity
                        onPress={() => setActiveTab('active')}
                        className={`mr-8 pb-2 ${activeTab === 'active' ? 'border-b-4 border-[#FF5722]' : ''}`}
                    >
                        <Text className={`text-lg font-black ${activeTab === 'active' ? 'text-gray-900' : 'text-gray-400'}`}>
                            Active
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('past')}
                        className={`pb-2 ${activeTab === 'past' ? 'border-b-4 border-[#FF5722]' : ''}`}
                    >
                        <Text className={`text-lg font-black ${activeTab === 'past' ? 'text-gray-900' : 'text-gray-400'}`}>
                            Past Orders
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Orders List */}
                <View>
                    {filteredOrders.map((order, index) => (
                        <View
                            key={order.id}
                        >
                            <TouchableOpacity
                                onPress={() => order.isActive && handleTrackOrder(order.id)}
                                className="bg-gray-50/50 rounded-[32px] p-6 mb-6 border border-gray-100 shadow-sm shadow-gray-200/50"
                            >
                                <View className="flex-row justify-between items-start mb-4">
                                    <View>
                                        <Text className="text-xl font-black text-gray-900">{order.restaurant}</Text>
                                        <Text className="text-gray-400 text-xs font-bold uppercase mt-1 tracking-widest">
                                            {order.date}
                                        </Text>
                                    </View>
                                    <View
                                        className={`px-4 py-1.5 rounded-full ${order.status === 'Delivering' ? 'bg-orange-100' : 'bg-green-100'
                                            }`}
                                    >
                                        <Text
                                            className={`font-bold text-xs ${order.status === 'Delivering' ? 'text-orange-600' : 'text-green-600'
                                                }`}
                                        >
                                            {order.status}
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center border-t border-gray-100 pt-4 mt-2">
                                    <View className="flex-1">
                                        <Text className="text-gray-500 text-sm italic" numberOfLines={1}>
                                            {order.items}
                                        </Text>
                                        <Text className="text-gray-900 font-black text-lg mt-1">
                                            S/ {order.price.toFixed(2)}
                                        </Text>
                                    </View>
                                    {order.isActive ? (
                                        <TouchableOpacity
                                            onPress={() => handleTrackOrder(order.id)}
                                            className="bg-[#FF5722] px-6 py-3 rounded-full"
                                        >
                                            <Text className="text-white font-bold">Track</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            onPress={() => handleReorder(order.id)}
                                            className="bg-gray-900 px-6 py-3 rounded-full"
                                        >
                                            <Text className="text-white font-bold">Reorder</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Empty State */}
                {filteredOrders.length === 0 && (
                    <View className="py-20 items-center">
                        <Ionicons name="receipt-outline" size={80} color="#D1D5DB" />
                        <Text className="text-xl font-bold text-gray-900 mt-6">
                            {activeTab === 'active' ? 'No active orders' : 'No past orders'}
                        </Text>
                        <Text className="text-gray-400 text-center mt-2 px-10">
                            {activeTab === 'active'
                                ? 'Hungry? Order something delicious and it will appear here!'
                                : 'Your order history will appear here'}
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
