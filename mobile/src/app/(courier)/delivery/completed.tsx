import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DeliveryCompletedScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Animation values
    const [scaleAnim] = useState(new Animated.Value(0));
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(50));

    // Mock data (would come from params in real app)
    const deliveryData = {
        orderId: 'FR-8829',
        customerName: 'Sarah K.',
        totalEarnings: 8.50,
        percentageAboveAverage: 15,
        breakdown: {
            baseFare: 5.00,
            distanceBonus: 1.50,
            distance: 3.2,
            customerTip: 2.00,
        },
        stats: {
            distance: 3.2,
            duration: 18, // minutes
        },
    };

    useEffect(() => {
        // Success animation sequence
        Animated.sequence([
            // Scale in checkmark
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            // Fade in content
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    const handleFindNextOrder = () => {
        router.replace('/courier/dashboard' as any);
    };

    const handleGoOffline = () => {
        // TODO: Update courier status to offline
        router.replace('/courier/dashboard' as any);
    };

    const handleViewReceipt = () => {
        router.push(`/courier/trips/${params.tripId || 'latest'}` as any);
    };

    return (
        <View className="flex-1 bg-[#0A0E27]">
            <SafeAreaView edges={['top', 'bottom']} className="flex-1">
                <View className="flex-1 px-6 justify-center">
                    {/* Success Icon with Animated Circles */}
                    <Animated.View
                        className="items-center mb-8"
                        style={{
                            transform: [{ scale: scaleAnim }],
                        }}
                    >
                        {/* Outer circle */}
                        <View className="w-40 h-40 rounded-full bg-[#065F46]/20 items-center justify-center">
                            {/* Middle circle */}
                            <View className="w-32 h-32 rounded-full bg-[#065F46]/40 items-center justify-center">
                                {/* Inner circle with checkmark */}
                                <View className="w-24 h-24 rounded-full bg-[#10B981] items-center justify-center">
                                    <Ionicons name="checkmark" size={60} color="#FFF" />
                                </View>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Title and Subtitle */}
                    <Animated.View
                        className="items-center mb-8"
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        <Text className="text-white text-4xl font-bold mb-2">
                            Delivery Complete!
                        </Text>
                        <Text className="text-gray-400 text-base">
                            Order #{deliveryData.orderId} delivered to {deliveryData.customerName}
                        </Text>
                    </Animated.View>

                    {/* Total Earnings Card */}
                    <Animated.View
                        className="bg-[#1A1F3A] rounded-3xl p-6 mb-6 border border-[#2A2F4A]"
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        <Text className="text-gray-400 text-xs font-bold tracking-widest text-center mb-2">
                            TOTAL EARNINGS
                        </Text>
                        <Text className="text-[#10B981] text-6xl font-bold text-center mb-2">
                            ${deliveryData.totalEarnings.toFixed(2)}
                        </Text>
                        <View className="flex-row items-center justify-center">
                            <Ionicons name="trending-up" size={14} color="#10B981" />
                            <Text className="text-[#10B981] text-xs font-bold ml-1">
                                +{deliveryData.percentageAboveAverage}% ABOVE AVERAGE
                            </Text>
                        </View>
                    </Animated.View>

                    {/* Earnings Breakdown */}
                    <Animated.View
                        className="mb-6"
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        {/* Base Fare */}
                        <View className="flex-row justify-between items-center py-3 border-b border-[#1A1F3A]">
                            <Text className="text-gray-400 text-base">Base Fare</Text>
                            <Text className="text-white text-lg font-semibold">
                                ${deliveryData.breakdown.baseFare.toFixed(2)}
                            </Text>
                        </View>

                        {/* Distance Bonus */}
                        <View className="flex-row justify-between items-center py-3 border-b border-[#1A1F3A]">
                            <Text className="text-gray-400 text-base">
                                Distance Bonus ({deliveryData.breakdown.distance} mi)
                            </Text>
                            <Text className="text-white text-lg font-semibold">
                                ${deliveryData.breakdown.distanceBonus.toFixed(2)}
                            </Text>
                        </View>

                        {/* Customer Tip - Highlighted */}
                        <View className="flex-row justify-between items-center py-3 bg-[#1E3A8A]/30 rounded-xl px-4 mt-2">
                            <View className="flex-row items-center">
                                <Ionicons name="gift" size={20} color="#3B82F6" />
                                <Text className="text-[#3B82F6] text-base font-semibold ml-2">
                                    Customer Tip
                                </Text>
                            </View>
                            <Text className="text-[#3B82F6] text-lg font-bold">
                                ${deliveryData.breakdown.customerTip.toFixed(2)}
                            </Text>
                        </View>
                    </Animated.View>

                    {/* Rating Prompt */}
                    <Animated.View
                        className="items-center mb-6"
                        style={{
                            opacity: fadeAnim,
                        }}
                    >
                        <Text className="text-white text-lg font-semibold mb-3">
                            How was the dropoff?
                        </Text>
                        <View className="flex-row gap-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity
                                    key={star}
                                    className="w-12 h-12 items-center justify-center"
                                >
                                    <Ionicons
                                        name="star-outline"
                                        size={32}
                                        color="#64748B"
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Animated.View>

                    {/* Action Buttons */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                        }}
                    >
                        {/* Find Next Order Button */}
                        <TouchableOpacity
                            onPress={handleFindNextOrder}
                            className="bg-[#3B82F6] rounded-full py-4 mb-4 flex-row items-center justify-center"
                        >
                            <Text className="text-white font-bold text-base mr-2">
                                FIND NEXT ORDER
                            </Text>
                            <Ionicons name="arrow-forward" size={20} color="#FFF" />
                        </TouchableOpacity>

                        {/* Go Offline Button */}
                        <TouchableOpacity
                            onPress={handleGoOffline}
                            className="py-4 items-center"
                        >
                            <Text className="text-gray-400 font-semibold text-base">
                                GO OFFLINE
                            </Text>
                        </TouchableOpacity>

                        {/* View Receipt Link */}
                        <TouchableOpacity
                            onPress={handleViewReceipt}
                            className="py-2 items-center"
                        >
                            <Text className="text-[#3B82F6] text-sm">
                                View Receipt
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </SafeAreaView>
        </View>
    );
}
