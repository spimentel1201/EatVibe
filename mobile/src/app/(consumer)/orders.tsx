import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { orderApi } from '@/features/order/api/orderApi';
import { OrderResponse } from '@/features/order/types';
import { useEffect } from 'react';
import { RefreshControl, ActivityIndicator } from 'react-native';

// MOCK_ORDERS removed


export default function OrdersScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const data = await orderApi.getOrdersByCustomer(user.id);
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const isActiveOrder = (status: any) => {
        return ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'].includes(status);
    };

    const filteredOrders = orders.filter((order) =>
        activeTab === 'active' ? isActiveOrder(order.status) : !isActiveOrder(order.status)
    );

    const handleTrackOrder = (orderId: string) => {
        router.push({
            pathname: '/order/tracking',
            params: { id: orderId }
        } as any);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getItemsSummary = (items: any[]) => {
        if (!items || items.length === 0) return 'No items';
        return items.map(i => `${i.quantity}x ${i.productName}`).join(', ');
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchOrders} tintColor="#FF5722" />}
            >
                {/* Header */}
                <View className="py-6 flex-row justify-between items-center">
                    <Text className="text-3xl font-black text-gray-900">My Orders</Text>
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
                    {filteredOrders.map((order) => (
                        <View
                            key={order.id}
                        >
                            <TouchableOpacity
                                onPress={() => isActiveOrder(order.status) && handleTrackOrder(order.id)}
                                disabled={!isActiveOrder(order.status)}
                                className="bg-gray-50/50 rounded-[32px] p-6 mb-6 border border-gray-100 shadow-sm shadow-gray-200/50"
                            >
                                <View className="flex-row justify-between items-start mb-4">
                                    <View>
                                        <Text className="text-xl font-black text-gray-900">
                                            {/* TODO: Fetch restaurant name or store it in Order */}
                                            Restaurant
                                        </Text>
                                        <Text className="text-gray-400 text-xs font-bold uppercase mt-1 tracking-widest">
                                            {formatDate(order.createdAt)}
                                        </Text>
                                    </View>
                                    <View
                                        className={`px-4 py-1.5 rounded-full ${order.status === 'OUT_FOR_DELIVERY' ? 'bg-orange-100' : 'bg-green-100'
                                            }`}
                                    >
                                        <Text
                                            className={`font-bold text-xs ${order.status === 'OUT_FOR_DELIVERY' ? 'text-orange-600' : 'text-green-600'
                                                }`}
                                        >
                                            {order.status.replace(/_/g, ' ')}
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center border-t border-gray-100 pt-4 mt-2">
                                    <View className="flex-1">
                                        <Text className="text-gray-500 text-sm italic" numberOfLines={1}>
                                            {getItemsSummary(order.items)}
                                        </Text>
                                        <Text className="text-gray-900 font-black text-lg mt-1">
                                            S/ {order.totalAmount.toFixed(2)}
                                        </Text>
                                    </View>
                                    {isActiveOrder(order.status) ? (
                                        <TouchableOpacity
                                            onPress={() => handleTrackOrder(order.id)}
                                            className="bg-[#FF5722] px-6 py-3 rounded-full"
                                        >
                                            <Text className="text-white font-bold">Track</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            // onPress={() => handleReorder(order.id)}
                                            className="bg-gray-900 px-6 py-3 rounded-full opacity-50"
                                            disabled
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
                {filteredOrders.length === 0 && !isLoading && (
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
                {isLoading && (
                    <View className="py-20 items-center">
                        <ActivityIndicator size="large" color="#FF5722" />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
