import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type DriverStatus = 'offline' | 'online';

export default function DriverDashboardScreen() {
    const [status, setStatus] = useState<DriverStatus>('offline');


    // Mock data
    const todayEarnings = 120.50;
    const earningsChange = 12; // percentage
    const totalTrips = 12;
    const hoursOnline = '4h 22m';

    const handleGoOnline = () => {
        setStatus('online');
        // TODO: Update backend status
    };

    const handleGoOffline = () => {
        setStatus('offline');
        // TODO: Update backend status
    };

    return (
        <View className="flex-1 bg-[#0A0E27]">
            {/* Status Bar */}
            <SafeAreaView edges={['top']}>
                <View className="px-6 py-2">
                    <Text className="text-white text-sm">9:41</Text>
                </View>
            </SafeAreaView>

            {/* Stats Cards */}
            <View className="px-4 pt-4 pb-6 flex-row gap-3">
                {/* Today's Earnings */}
                <View className="flex-1 bg-[#1A1F3A] rounded-3xl p-5 border border-[#2A2F4A]">
                    <Text className="text-gray-400 text-xs font-semibold mb-2 tracking-wider">
                        TODAY'S EARNINGS
                    </Text>
                    <Text className="text-[#10B981] text-4xl font-bold mb-1">
                        ${todayEarnings.toFixed(2)}
                    </Text>
                    <View className="flex-row items-center">
                        <Ionicons name="trending-up" size={14} color="#10B981" />
                        <Text className="text-[#10B981] text-xs ml-1">
                            +{earningsChange}% vs yesterday
                        </Text>
                    </View>
                </View>

                {/* Total Trips */}
                <View className="flex-1 bg-[#1A1F3A] rounded-3xl p-5 border border-[#2A2F4A]">
                    <Text className="text-gray-400 text-xs font-semibold mb-2 tracking-wider">
                        TOTAL TRIPS
                    </Text>
                    <View className="flex-row items-baseline mb-1">
                        <Text className="text-white text-4xl font-bold">{totalTrips}</Text>
                        <Text className="text-gray-500 text-lg ml-2">completed</Text>
                    </View>
                    <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-[#6366F1] mr-2" />
                        <Text className="text-[#6366F1] text-xs">
                            {hoursOnline} online
                        </Text>
                    </View>
                </View>
            </View>

            {/* High Demand Zone Badge */}
            <View className="items-center mb-6">
                <View className="bg-[#4C1D95] rounded-full px-6 py-3 flex-row items-center border border-[#6366F1]">
                    <View className="w-2 h-2 rounded-full bg-[#6366F1] mr-2" />
                    <Text className="text-white font-bold text-sm tracking-wider">
                        HIGH DEMAND ZONE
                    </Text>
                </View>
            </View>

            {/* Map Area with Grid Pattern */}
            <View className="flex-1 items-center justify-center relative">
                {/* Grid Background Pattern */}
                <View className="absolute inset-0 items-center justify-center">
                    {/* Radial grid lines - simplified representation */}
                    <View className="w-full h-full items-center justify-center">
                        {/* Purple glow effect */}
                        <View className="absolute w-64 h-64 rounded-full bg-[#6366F1]/20 blur-3xl" />

                        {/* Concentric circles */}
                        {[1, 2, 3, 4, 5].map((i) => (
                            <View
                                key={i}
                                className="absolute rounded-full border border-[#1E293B]/50"
                                style={{
                                    width: i * 80,
                                    height: i * 80,
                                }}
                            />
                        ))}

                        {/* Grid lines - vertical */}
                        <View className="absolute inset-0 flex-row justify-around">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <View
                                    key={`v-${i}`}
                                    className="w-px h-full bg-[#1E293B]/30"
                                />
                            ))}
                        </View>

                        {/* Grid lines - horizontal */}
                        <View className="absolute inset-0 flex-col justify-around">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                                <View
                                    key={`h-${i}`}
                                    className="h-px w-full bg-[#1E293B]/30"
                                />
                            ))}
                        </View>
                    </View>
                </View>

                {/* Driver Location Indicator */}
                <View className="z-10 items-center justify-center">
                    <View className="w-16 h-16 rounded-full bg-[#6366F1] items-center justify-center border-4 border-white shadow-lg">
                        <Ionicons name="navigate" size={28} color="#FFF" />
                    </View>
                    {/* Pulse animation circle */}
                    <View className="absolute w-24 h-24 rounded-full border-2 border-[#6366F1]/30" />
                </View>
            </View>

            {/* Status Section */}
            <View className="items-center pb-8">
                <Text className="text-gray-400 text-sm font-semibold tracking-widest mb-6">
                    YOU ARE CURRENTLY {status === 'offline' ? 'OFFLINE' : 'ONLINE'}
                </Text>

                {status === 'offline' ? (
                    <TouchableOpacity
                        onPress={handleGoOnline}
                        className="w-32 h-32 rounded-full bg-[#3B82F6] items-center justify-center shadow-2xl"
                        style={{
                            shadowColor: '#3B82F6',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.5,
                            shadowRadius: 16,
                        }}
                    >
                        <Text className="text-white font-bold text-lg tracking-wider">GO</Text>
                        <Text className="text-white font-bold text-sm tracking-wider">ONLINE</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={handleGoOffline}
                        className="w-32 h-32 rounded-full bg-[#EF4444] items-center justify-center shadow-2xl"
                        style={{
                            shadowColor: '#EF4444',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.5,
                            shadowRadius: 16,
                        }}
                    >
                        <Text className="text-white font-bold text-lg tracking-wider">GO</Text>
                        <Text className="text-white font-bold text-sm tracking-wider">OFFLINE</Text>
                    </TouchableOpacity>
                )}
            </View>

        </View>
    );
}
