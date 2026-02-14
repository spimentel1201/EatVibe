import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';

interface OrderDetails {
    orderId: string;
    restaurant: {
        name: string;
        address: string;
        distance: number;
        estimatedTime: number;
        coordinates: { latitude: number; longitude: number };
        instructions?: string;
    };
    customer: {
        name: string;
        address: string;
        distance: number;
        estimatedTime: number;
        coordinates: { latitude: number; longitude: number };
        instructions?: string;
    };
    items: {
        name: string;
        quantity: number;
    }[];
    earnings: {
        baseFare: number;
        distance: number;
        surge?: number;
        estimatedTip: number;
        total: number;
    };
    pickupTime: string;
    deliveryTime: string;
}

export default function OrderDetailsScreen() {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(30);

    // Mock data
    const orderData: OrderDetails = {
        orderId: 'FR-4521',
        restaurant: {
            name: 'Burger Palace',
            address: '123 Main St, Downtown',
            distance: 0.8,
            estimatedTime: 5,
            coordinates: { latitude: 37.7849, longitude: -122.4094 },
            instructions: 'Use side entrance for pickup',
        },
        customer: {
            name: 'John D.',
            address: '456 Oak Ave, Apt 4B',
            distance: 2.4,
            estimatedTime: 12,
            coordinates: { latitude: 37.7749, longitude: -122.4194 },
            instructions: 'Ring doorbell twice, leave at door',
        },
        items: [
            { name: 'Classic Burger', quantity: 2 },
            { name: 'French Fries', quantity: 1 },
            { name: 'Coke', quantity: 2 },
        ],
        earnings: {
            baseFare: 5.00,
            distance: 2.50,
            surge: 1.50,
            estimatedTip: 3.00,
            total: 12.00,
        },
        pickupTime: '6:30 PM',
        deliveryTime: '6:45 PM',
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleDecline();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleAccept = () => {
        router.replace('/courier/delivery/active' as any);
    };

    const handleDecline = () => {
        Alert.alert(
            'Order Declined',
            'This order has been declined and offered to another courier.',
            [
                {
                    text: 'OK',
                    onPress: () => router.replace('/courier/dashboard' as any),
                },
            ]
        );
    };

    const handleContactRestaurant = () => {
        // TODO: Implement contact restaurant
        console.log('Contact restaurant');
    };

    const darkMapStyle = [
        { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
    ];

    return (
        <View className="flex-1 bg-[#0A0E27]">
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <View className="px-6 py-4">
                    <View className="flex-row items-center justify-between mb-4">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <View className="flex-1 ml-4">
                            <Text className="text-gray-400 text-xs font-semibold tracking-wider">
                                ORDER DETAILS
                            </Text>
                            <Text className="text-white text-lg font-bold">
                                Order #{orderData.orderId}
                            </Text>
                        </View>
                        <View className="bg-[#EF4444] rounded-full w-16 h-16 items-center justify-center">
                            <Text className="text-white text-2xl font-bold">{timeLeft}</Text>
                            <Text className="text-white text-xs">sec</Text>
                        </View>
                    </View>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Map */}
                    <View className="px-6 mb-6">
                        <View className="rounded-3xl overflow-hidden" style={{ height: 200 }}>
                            <MapView
                                provider={PROVIDER_DEFAULT}
                                style={{ flex: 1 }}
                                customMapStyle={darkMapStyle}
                                initialRegion={{
                                    latitude: (orderData.restaurant.coordinates.latitude + orderData.customer.coordinates.latitude) / 2,
                                    longitude: (orderData.restaurant.coordinates.longitude + orderData.customer.coordinates.longitude) / 2,
                                    latitudeDelta: 0.02,
                                    longitudeDelta: 0.02,
                                }}
                                scrollEnabled={false}
                                zoomEnabled={false}
                            >
                                <Marker coordinate={orderData.restaurant.coordinates}>
                                    <View className="w-10 h-10 rounded-full bg-[#3B82F6] items-center justify-center border-2 border-white">
                                        <Ionicons name="restaurant" size={20} color="#FFF" />
                                    </View>
                                </Marker>
                                <Marker coordinate={orderData.customer.coordinates}>
                                    <View className="w-10 h-10 rounded-full bg-[#10B981] items-center justify-center border-2 border-white">
                                        <Ionicons name="home" size={20} color="#FFF" />
                                    </View>
                                </Marker>
                                <Polyline
                                    coordinates={[orderData.restaurant.coordinates, orderData.customer.coordinates]}
                                    strokeColor="#3B82F6"
                                    strokeWidth={3}
                                    lineDashPattern={[5, 5]}
                                />
                            </MapView>
                        </View>
                    </View>

                    {/* Restaurant Info */}
                    <View className="px-6 mb-6">
                        <View className="bg-[#1A1F3A] rounded-2xl p-4 border border-[#2A2F4A]">
                            <View className="flex-row items-center justify-between mb-3">
                                <View className="flex-1">
                                    <View className="flex-row items-center mb-1">
                                        <View className="w-8 h-8 rounded-full bg-[#3B82F6] items-center justify-center mr-3">
                                            <Ionicons name="restaurant" size={16} color="#FFF" />
                                        </View>
                                        <Text className="text-white font-bold text-base">PICKUP</Text>
                                    </View>
                                    <Text className="text-white text-lg font-bold ml-11">
                                        {orderData.restaurant.name}
                                    </Text>
                                    <Text className="text-gray-400 text-sm ml-11">
                                        {orderData.restaurant.address}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={handleContactRestaurant}
                                    className="w-10 h-10 rounded-full bg-[#2A2F4A] items-center justify-center"
                                >
                                    <Ionicons name="call" size={20} color="#3B82F6" />
                                </TouchableOpacity>
                            </View>
                            <View className="flex-row items-center ml-11">
                                <Ionicons name="navigate" size={16} color="#64748B" />
                                <Text className="text-gray-400 text-sm ml-2">
                                    {orderData.restaurant.distance} mi • {orderData.restaurant.estimatedTime} min
                                </Text>
                            </View>
                            {orderData.restaurant.instructions && (
                                <View className="mt-3 ml-11 bg-[#2A2F4A] rounded-xl p-3">
                                    <Text className="text-[#F59E0B] text-xs font-bold mb-1">
                                        SPECIAL INSTRUCTIONS
                                    </Text>
                                    <Text className="text-gray-300 text-sm">
                                        {orderData.restaurant.instructions}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Customer Info */}
                    <View className="px-6 mb-6">
                        <View className="bg-[#1A1F3A] rounded-2xl p-4 border border-[#2A2F4A]">
                            <View className="flex-row items-center justify-between mb-3">
                                <View className="flex-1">
                                    <View className="flex-row items-center mb-1">
                                        <View className="w-8 h-8 rounded-full bg-[#10B981] items-center justify-center mr-3">
                                            <Ionicons name="home" size={16} color="#FFF" />
                                        </View>
                                        <Text className="text-white font-bold text-base">DELIVERY</Text>
                                    </View>
                                    <Text className="text-white text-lg font-bold ml-11">
                                        {orderData.customer.name}
                                    </Text>
                                    <Text className="text-gray-400 text-sm ml-11">
                                        {orderData.customer.address}
                                    </Text>
                                </View>
                            </View>
                            <View className="flex-row items-center ml-11">
                                <Ionicons name="navigate" size={16} color="#64748B" />
                                <Text className="text-gray-400 text-sm ml-2">
                                    {orderData.customer.distance} mi • {orderData.customer.estimatedTime} min
                                </Text>
                            </View>
                            {orderData.customer.instructions && (
                                <View className="mt-3 ml-11 bg-[#2A2F4A] rounded-xl p-3">
                                    <Text className="text-[#F59E0B] text-xs font-bold mb-1">
                                        DELIVERY INSTRUCTIONS
                                    </Text>
                                    <Text className="text-gray-300 text-sm">
                                        {orderData.customer.instructions}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Order Items */}
                    <View className="px-6 mb-6">
                        <Text className="text-gray-400 text-xs font-bold tracking-wider mb-3">
                            ORDER ITEMS ({orderData.items.length})
                        </Text>
                        <View className="bg-[#1A1F3A] rounded-2xl p-4 border border-[#2A2F4A]">
                            {orderData.items.map((item, index) => (
                                <View
                                    key={index}
                                    className={`flex-row justify-between items-center ${index < orderData.items.length - 1 ? 'mb-3 pb-3 border-b border-[#2A2F4A]' : ''
                                        }`}
                                >
                                    <Text className="text-white text-base">
                                        {item.quantity}x {item.name}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Earnings Breakdown */}
                    <View className="px-6 mb-6">
                        <Text className="text-gray-400 text-xs font-bold tracking-wider mb-3">
                            EARNINGS BREAKDOWN
                        </Text>
                        <View className="bg-[#1A1F3A] rounded-2xl p-4 border border-[#2A2F4A]">
                            <View className="flex-row justify-between items-center mb-3">
                                <Text className="text-gray-400 text-base">Base Fare</Text>
                                <Text className="text-white text-lg font-semibold">
                                    ${orderData.earnings.baseFare.toFixed(2)}
                                </Text>
                            </View>
                            <View className="flex-row justify-between items-center mb-3">
                                <Text className="text-gray-400 text-base">Distance Bonus</Text>
                                <Text className="text-white text-lg font-semibold">
                                    ${orderData.earnings.distance.toFixed(2)}
                                </Text>
                            </View>
                            {orderData.earnings.surge && (
                                <View className="flex-row justify-between items-center mb-3">
                                    <Text className="text-[#F59E0B] text-base">Surge Pricing</Text>
                                    <Text className="text-[#F59E0B] text-lg font-bold">
                                        +${orderData.earnings.surge.toFixed(2)}
                                    </Text>
                                </View>
                            )}
                            <View className="flex-row justify-between items-center mb-3">
                                <Text className="text-gray-400 text-base">Estimated Tip</Text>
                                <Text className="text-[#10B981] text-lg font-bold">
                                    ${orderData.earnings.estimatedTip.toFixed(2)}
                                </Text>
                            </View>
                            <View className="h-px bg-[#2A2F4A] my-2" />
                            <View className="flex-row justify-between items-center">
                                <Text className="text-white text-lg font-bold">Total Earnings</Text>
                                <Text className="text-[#10B981] text-2xl font-bold">
                                    ${orderData.earnings.total.toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="h-32" />
                </ScrollView>

                {/* Bottom Actions */}
                <SafeAreaView edges={['bottom']} className="bg-[#0A0E27]">
                    <View className="px-6 py-4 border-t border-[#1E293B]">
                        <TouchableOpacity
                            onPress={handleAccept}
                            className="bg-[#10B981] rounded-full py-4 mb-3"
                        >
                            <Text className="text-white font-bold text-center text-lg">
                                ACCEPT ORDER
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleDecline}
                            className="bg-transparent border-2 border-[#EF4444] rounded-full py-4"
                        >
                            <Text className="text-[#EF4444] font-bold text-center text-base">
                                DECLINE
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </SafeAreaView>
        </View>
    );
}
