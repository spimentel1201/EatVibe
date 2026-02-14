import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function IncomingOrderScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Mock order data
    const order = {
        id: params.id || 'ORD-12345',
        earnings: 8.50,
        isHighDemand: true,
        totalDistance: 3.2, // km
        estimatedTime: 15, // minutes
        restaurant: {
            name: 'Burger King',
            distance: 0.8, // km from courier
            address: '1242 Oak Street',
        },
        delivery: {
            address: '1242 Oak Street',
            distance: 2.4, // km to customer
        },
        items: 2,
        hasLargeOrderBonus: true,
    };

    // Timer countdown (auto-reject after 30 seconds)
    const [timeLeft, setTimeLeft] = useState(30);
    const [progress] = useState(new Animated.Value(0));

    useEffect(() => {
        // Start progress animation
        Animated.timing(progress, {
            toValue: 1,
            duration: 30000, // 30 seconds
            useNativeDriver: false,
        }).start();

        // Countdown timer
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleReject(); // Auto-reject
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleAccept = () => {
        // TODO: Accept order and navigate to active delivery screen
        console.log('Order accepted:', order.id);
        router.push(`/courier/delivery/active?id=${order.id}` as any);
    };

    const handleReject = () => {
        // TODO: Reject order and return to dashboard
        console.log('Order rejected:', order.id);
        router.back();
    };

    const handleSwipeUp = () => {
        // TODO: Show detailed order information modal
        console.log('Show order details');
    };

    // Calculate progress percentage for circle
    const progressPercentage = (timeLeft / 30) * 100;

    return (
        <View className="flex-1 bg-[#0D1F1A]">
            {/* Background Map Pattern (simplified) */}
            <View className="absolute inset-0">
                {/* Grid lines - vertical */}
                <View className="absolute inset-0 flex-row justify-around">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <View
                            key={`v-${i}`}
                            className="w-px h-full bg-[#1E3A2E]/20"
                        />
                    ))}
                </View>

                {/* Grid lines - horizontal */}
                <View className="absolute inset-0 flex-col justify-around">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                        <View
                            key={`h-${i}`}
                            className="h-px w-full bg-[#1E3A2E]/20"
                        />
                    ))}
                </View>

                {/* Curved road-like paths */}
                <View className="absolute top-1/4 left-0 right-0 h-32 border-t-2 border-b-2 border-[#1E3A2E]/30 transform rotate-12" />
                <View className="absolute top-1/2 left-0 right-0 h-24 border-t-2 border-b-2 border-[#1E3A2E]/30 transform -rotate-6" />
            </View>

            {/* Header */}
            <SafeAreaView edges={['top']}>
                <View className="px-6 py-2 flex-row justify-between items-center">
                    <Text className="text-white text-sm">9:41</Text>
                    <TouchableOpacity
                        onPress={handleReject}
                        className="bg-[#1E3A2E] px-6 py-2 rounded-full"
                    >
                        <Text className="text-gray-400 font-semibold text-sm">REJECT</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Main Content */}
            <View className="flex-1 items-center justify-start pt-12">
                {/* Earnings Circle with Progress */}
                <View className="items-center mb-8">
                    <View className="relative items-center justify-center">
                        {/* Progress Circle Background */}
                        <View className="w-56 h-56 rounded-full border-4 border-[#1E3A2E]" />

                        {/* Progress Circle (Animated) */}
                        <View
                            className="absolute w-56 h-56 rounded-full border-4 border-[#10B981]"
                            style={{
                                borderTopColor: 'transparent',
                                borderRightColor: progressPercentage > 25 ? '#10B981' : 'transparent',
                                borderBottomColor: progressPercentage > 50 ? '#10B981' : 'transparent',
                                borderLeftColor: progressPercentage > 75 ? '#10B981' : 'transparent',
                                transform: [{ rotate: `${(1 - timeLeft / 30) * 360}deg` }],
                            }}
                        />

                        {/* Center Content */}
                        <View className="absolute items-center">
                            <Text className="text-[#10B981] text-sm font-semibold mb-2">EARN</Text>
                            <Text className="text-[#10B981] text-6xl font-bold">
                                ${order.earnings.toFixed(2)}
                            </Text>
                            {order.isHighDemand && (
                                <View className="mt-3 bg-[#10B981] px-4 py-1 rounded-full">
                                    <Text className="text-[#0D1F1A] font-bold text-xs">HIGH DEMAND</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                {/* Distance and Time Info */}
                <View className="bg-[#1E3A2E]/60 rounded-full px-8 py-4 flex-row items-center gap-8 mb-8">
                    <View className="flex-row items-center">
                        <Ionicons name="navigate" size={20} color="#10B981" />
                        <Text className="text-white font-bold text-lg ml-2">
                            {order.totalDistance}
                        </Text>
                        <Text className="text-gray-400 text-sm ml-1">km total</Text>
                    </View>

                    <View className="w-px h-6 bg-gray-600" />

                    <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={20} color="#10B981" />
                        <Text className="text-white font-bold text-lg ml-2">
                            {order.estimatedTime}
                        </Text>
                        <Text className="text-gray-400 text-sm ml-1">min</Text>
                    </View>
                </View>

                {/* Order Details Card */}
                <View className="mx-6 bg-[#1E3A2E]/80 rounded-3xl p-6 mb-6" style={{ width: width - 48 }}>
                    {/* Restaurant Pickup */}
                    <View className="flex-row items-start mb-4">
                        <View className="w-3 h-3 rounded-full bg-[#EF4444] mt-1 mr-3" />
                        <View className="flex-1">
                            <View className="flex-row items-center mb-1">
                                <Text className="text-white font-bold text-base mr-2">
                                    {order.restaurant.name}
                                </Text>
                                <Text className="text-gray-400 text-sm">
                                    • {order.restaurant.distance} km away
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Delivery Destination */}
                    <View className="flex-row items-start mb-4">
                        <View className="w-3 h-3 rounded-full bg-[#10B981] mt-1 mr-3" />
                        <View className="flex-1">
                            <View className="flex-row items-center mb-1">
                                <Text className="text-white font-semibold text-base mr-2">
                                    {order.delivery.address}
                                </Text>
                                <Text className="text-gray-400 text-sm">
                                    • {order.delivery.distance} km delivery
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Order Info */}
                    <View className="flex-row items-center pt-4 border-t border-[#2A4A3E]">
                        <Ionicons name="bag-outline" size={18} color="#9CA3AF" />
                        <Text className="text-gray-400 text-sm ml-2">
                            {order.items} items
                        </Text>
                        {order.hasLargeOrderBonus && (
                            <>
                                <Text className="text-gray-600 mx-2">•</Text>
                                <Text className="text-[#10B981] text-sm font-semibold italic">
                                    Large Order Bonus Included
                                </Text>
                            </>
                        )}
                    </View>
                </View>

                {/* Spacer */}
                <View className="flex-1" />
            </View>

            {/* Bottom Section */}
            <SafeAreaView edges={['bottom']} className="px-6 pb-6">
                {/* Accept Button */}
                <TouchableOpacity
                    onPress={handleAccept}
                    className="bg-[#10B981] rounded-full py-5 items-center justify-center mb-4"
                    style={{
                        shadowColor: '#10B981',
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.4,
                        shadowRadius: 16,
                    }}
                >
                    <View className="flex-row items-center">
                        <Text className="text-[#0D1F1A] font-bold text-lg tracking-wider mr-2">
                            ACCEPT DELIVERY
                        </Text>
                        <Ionicons name="arrow-forward" size={20} color="#0D1F1A" />
                    </View>
                </TouchableOpacity>

                {/* Swipe Up Hint */}
                <TouchableOpacity onPress={handleSwipeUp} className="items-center py-2">
                    <Text className="text-gray-500 text-xs font-semibold tracking-widest mb-2">
                        SWIPE UP TO VIEW MORE DETAILS
                    </Text>
                    <View className="w-12 h-1 bg-gray-600 rounded-full" />
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
}
