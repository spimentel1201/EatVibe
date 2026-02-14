import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type FilterType = 'today' | 'week' | 'all';
type TripStatus = 'done' | 'cancelled' | 'in_progress';

interface Trip {
    id: string;
    time: string;
    restaurant: string;
    address: string;
    earnings: number;
    status: TripStatus;
    date: string;
}

interface DayGroup {
    label: string;
    date: string;
    trips: Trip[];
}

export default function TripHistoryScreen() {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState<FilterType>('today');


    // Mock data
    const todayStats = {
        totalEarnings: 36.45,
        totalTrips: 3,
        totalTime: '2H 18M',
    };

    const tripHistory: DayGroup[] = [
        {
            label: 'TODAY, OCT 24',
            date: '2024-10-24',
            trips: [
                {
                    id: '1',
                    time: '18:42',
                    restaurant: 'Burger King',
                    address: '123 Maple St, North Hills',
                    earnings: 12.50,
                    status: 'done',
                    date: '2024-10-24',
                },
                {
                    id: '2',
                    time: '17:15',
                    restaurant: 'Sushi Zen',
                    address: '456 Oak Ave, Downtown',
                    earnings: 8.20,
                    status: 'done',
                    date: '2024-10-24',
                },
                {
                    id: '3',
                    time: '16:30',
                    restaurant: 'Pasta Palace',
                    address: '789 Pine Rd, East Side',
                    earnings: 15.75,
                    status: 'done',
                    date: '2024-10-24',
                },
            ],
        },
        {
            label: 'YESTERDAY, OCT 23',
            date: '2024-10-23',
            trips: [
                {
                    id: '4',
                    time: '20:10',
                    restaurant: 'Taco Town',
                    address: '221 Baker St',
                    earnings: 10.10,
                    status: 'done',
                    date: '2024-10-23',
                },
                {
                    id: '5',
                    time: '19:30',
                    restaurant: 'Pizza Paradise',
                    address: '555 Main St',
                    earnings: 14.25,
                    status: 'done',
                    date: '2024-10-23',
                },
            ],
        },
    ];

    const getStatusBadge = (status: TripStatus) => {
        switch (status) {
            case 'done':
                return { text: 'DONE', color: '#10B981', bg: '#065F46' };
            case 'cancelled':
                return { text: 'CANCELLED', color: '#EF4444', bg: '#7F1D1D' };
            case 'in_progress':
                return { text: 'IN PROGRESS', color: '#3B82F6', bg: '#1E3A8A' };
            default:
                return { text: 'UNKNOWN', color: '#6B7280', bg: '#374151' };
        }
    };

    const handleTripPress = (tripId: string) => {
        // TODO: Navigate to trip details
        router.push(`/(courier)/trips/${tripId}` as any);
    };

    return (
        <View className="flex-1 bg-[#0A0E27]">
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <View className="px-6 py-4 flex-row justify-between items-center">
                    <Text className="text-white text-3xl font-bold">
                        Trip History
                    </Text>
                    <TouchableOpacity className="w-12 h-12 rounded-full bg-[#1A1F3A] items-center justify-center">
                        <Ionicons name="calendar-outline" size={24} color="#3B82F6" />
                    </TouchableOpacity>
                </View>

                {/* Filter Pills */}
                <View className="px-6 mb-6">
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={() => setActiveFilter('today')}
                            className={`px-6 py-3 rounded-full ${activeFilter === 'today'
                                ? 'bg-[#3B82F6]'
                                : 'bg-[#1A1F3A] border border-[#2A2F4A]'
                                }`}
                        >
                            <Text
                                className={`font-semibold ${activeFilter === 'today' ? 'text-white' : 'text-gray-400'
                                    }`}
                            >
                                Today
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setActiveFilter('week')}
                            className={`px-6 py-3 rounded-full ${activeFilter === 'week'
                                ? 'bg-[#3B82F6]'
                                : 'bg-[#1A1F3A] border border-[#2A2F4A]'
                                }`}
                        >
                            <Text
                                className={`font-semibold ${activeFilter === 'week' ? 'text-white' : 'text-gray-400'
                                    }`}
                            >
                                This Week
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setActiveFilter('all')}
                            className={`px-6 py-3 rounded-full ${activeFilter === 'all'
                                ? 'bg-[#3B82F6]'
                                : 'bg-[#1A1F3A] border border-[#2A2F4A]'
                                }`}
                        >
                            <Text
                                className={`font-semibold ${activeFilter === 'all' ? 'text-white' : 'text-gray-400'
                                    }`}
                            >
                                All
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Trip Groups */}
                    {tripHistory.map((group, groupIndex) => (
                        <View key={groupIndex} className="mb-6">
                            {/* Date Header */}
                            <View className="px-6 mb-3">
                                <Text className="text-gray-500 text-xs font-bold tracking-wider">
                                    {group.label}
                                </Text>
                            </View>

                            {/* Trip Cards */}
                            <View className="px-6 gap-3">
                                {group.trips.map((trip) => {
                                    const statusBadge = getStatusBadge(trip.status);

                                    return (
                                        <TouchableOpacity
                                            key={trip.id}
                                            onPress={() => handleTripPress(trip.id)}
                                            className="bg-[#1A1F3A] rounded-2xl p-4 border border-[#2A2F4A]"
                                        >
                                            <View className="flex-row items-center">
                                                {/* Time */}
                                                <View className="mr-4">
                                                    <Text className="text-white text-lg font-bold">
                                                        {trip.time}
                                                    </Text>
                                                    <Text className="text-gray-500 text-xs">
                                                        PM
                                                    </Text>
                                                </View>

                                                {/* Restaurant Info */}
                                                <View className="flex-1">
                                                    <Text className="text-white font-bold text-base mb-1">
                                                        {trip.restaurant}
                                                    </Text>
                                                    <View className="flex-row items-center">
                                                        <Ionicons
                                                            name="location-outline"
                                                            size={14}
                                                            color="#6B7280"
                                                        />
                                                        <Text className="text-gray-400 text-xs ml-1">
                                                            {trip.address}
                                                        </Text>
                                                    </View>
                                                </View>

                                                {/* Earnings & Status */}
                                                <View className="items-end ml-4">
                                                    <Text className="text-[#10B981] text-lg font-bold mb-2">
                                                        +${trip.earnings.toFixed(2)}
                                                    </Text>
                                                    <View
                                                        className="px-3 py-1 rounded-full flex-row items-center"
                                                        style={{ backgroundColor: statusBadge.bg }}
                                                    >
                                                        <Ionicons
                                                            name="checkmark-circle"
                                                            size={12}
                                                            color={statusBadge.color}
                                                        />
                                                        <Text
                                                            className="text-xs font-bold ml-1"
                                                            style={{ color: statusBadge.color }}
                                                        >
                                                            {statusBadge.text}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    ))}

                    {/* Total Today Card */}
                    {activeFilter === 'today' && (
                        <View className="px-6 mb-6">
                            <View className="bg-[#3B82F6] rounded-3xl p-6">
                                <Text className="text-white/80 text-sm font-semibold mb-2">
                                    Total Today
                                </Text>
                                <Text className="text-white text-5xl font-bold mb-4">
                                    ${todayStats.totalEarnings.toFixed(2)}
                                </Text>
                                <View className="flex-row gap-3">
                                    <View className="bg-white/20 px-4 py-2 rounded-full flex-row items-center">
                                        <Ionicons name="bicycle" size={16} color="#FFF" />
                                        <Text className="text-white text-xs font-bold ml-2">
                                            {todayStats.totalTrips} TRIPS
                                        </Text>
                                    </View>
                                    <View className="bg-white/20 px-4 py-2 rounded-full flex-row items-center">
                                        <Ionicons name="time-outline" size={16} color="#FFF" />
                                        <Text className="text-white text-xs font-bold ml-2">
                                            {todayStats.totalTime}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Bottom spacing */}
                    <View className="h-24" />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
