import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';

interface TimelineEvent {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
    time: string;
    completed: boolean;
}

interface TripDetails {
    orderId: string;
    status: 'completed' | 'cancelled' | 'in_progress';
    restaurant: {
        name: string;
        address: string;
        coordinates: { latitude: number; longitude: number };
    };
    customer: {
        name: string;
        address: string;
        coordinates: { latitude: number; longitude: number };
    };
    timeline: TimelineEvent[];
    earnings: {
        baseFare: number;
        distance: number;
        distanceMiles: number;
        boostMultiplier?: number;
        boostAmount?: number;
        customerTip: number;
        total: number;
    };
}

export default function TripDetailsScreen() {
    const router = useRouter();
    // const params = useLocalSearchParams(); // TODO: Use params.id to fetch trip data from API

    // Mock data (would come from API in real app)
    const tripData: TripDetails = {
        orderId: 'FR-9928',
        status: 'completed',
        restaurant: {
            name: 'Burger Palace',
            address: '5th Ave',
            coordinates: { latitude: 37.7849, longitude: -122.4094 },
        },
        customer: {
            name: "Jessica's Home",
            address: 'West St',
            coordinates: { latitude: 37.7749, longitude: -122.4194 },
        },
        timeline: [
            {
                id: '1',
                icon: 'checkmark-circle',
                title: 'Trip Accepted',
                subtitle: '0.2 miles from your location',
                time: '10:00 AM',
                completed: true,
            },
            {
                id: '2',
                icon: 'pause-circle',
                title: 'Picked Up',
                subtitle: 'Order verified at Burger Palace',
                time: '10:15 AM',
                completed: true,
            },
            {
                id: '3',
                icon: 'arrow-up-circle',
                title: 'Delivered',
                subtitle: 'Handed to customer',
                time: '10:30 AM',
                completed: true,
            },
        ],
        earnings: {
            baseFare: 4.00,
            distance: 2.50,
            distanceMiles: 2.4,
            boostMultiplier: 1.5,
            boostAmount: 3.00,
            customerTip: 5.00,
            total: 14.50,
        },
    };

    const handleReportIssue = () => {
        router.push('/courier/delivery/report-issue' as any);
    };

    const handleViewEarnings = () => {
        router.push('/courier/earnings' as any);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return '#3B82F6';
            case 'cancelled':
                return '#EF4444';
            default:
                return '#F59E0B';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed':
                return 'COMPLETED';
            case 'cancelled':
                return 'CANCELLED';
            default:
                return 'IN PROGRESS';
        }
    };

    // Dark map style
    const darkMapStyle = [
        { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
        {
            featureType: 'administrative.country',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#4b6878' }],
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#38414e' }],
        },
        {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#212a37' }],
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#17263c' }],
        },
    ];

    return (
        <View className="flex-1 bg-[#0A0E27]">
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4">
                    <View className="flex-row items-center flex-1">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="mr-4"
                        >
                            <Ionicons name="chevron-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <View className="flex-1">
                            <Text className="text-gray-400 text-xs font-semibold tracking-wider">
                                TRIP REVIEW
                            </Text>
                            <Text className="text-white text-lg font-bold">
                                Order #{tripData.orderId}
                            </Text>
                        </View>
                    </View>
                    <View
                        className="px-4 py-2 rounded-full"
                        style={{ backgroundColor: getStatusColor(tripData.status) }}
                    >
                        <Text className="text-white text-xs font-bold">
                            {getStatusText(tripData.status)}
                        </Text>
                    </View>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Map Section */}
                    <View className="px-6 mb-6">
                        <View className="rounded-3xl overflow-hidden" style={{ height: 200 }}>
                            <MapView
                                provider={PROVIDER_DEFAULT}
                                style={{ flex: 1 }}
                                customMapStyle={darkMapStyle}
                                initialRegion={{
                                    latitude: (tripData.restaurant.coordinates.latitude + tripData.customer.coordinates.latitude) / 2,
                                    longitude: (tripData.restaurant.coordinates.longitude + tripData.customer.coordinates.longitude) / 2,
                                    latitudeDelta: 0.02,
                                    longitudeDelta: 0.02,
                                }}
                                scrollEnabled={false}
                                zoomEnabled={false}
                                pitchEnabled={false}
                                rotateEnabled={false}
                            >
                                {/* Restaurant Marker */}
                                <Marker
                                    coordinate={tripData.restaurant.coordinates}
                                    anchor={{ x: 0.5, y: 0.5 }}
                                >
                                    <View className="items-center">
                                        <View className="w-10 h-10 rounded-full bg-[#3B82F6] items-center justify-center border-2 border-white">
                                            <Text className="text-white font-bold text-lg">A</Text>
                                        </View>
                                        <View className="bg-[#0A0E27] px-3 py-1 rounded-lg mt-1">
                                            <Text className="text-white text-xs font-semibold">RESTAURANT</Text>
                                            <Text className="text-gray-400 text-xs">{tripData.restaurant.name}, {tripData.restaurant.address}</Text>
                                        </View>
                                    </View>
                                </Marker>

                                {/* Customer Marker */}
                                <Marker
                                    coordinate={tripData.customer.coordinates}
                                    anchor={{ x: 0.5, y: 0.5 }}
                                >
                                    <View className="items-center">
                                        <View className="w-10 h-10 rounded-full bg-[#F59E0B] items-center justify-center border-2 border-white">
                                            <Text className="text-white font-bold text-lg">B</Text>
                                        </View>
                                        <View className="bg-[#0A0E27] px-3 py-1 rounded-lg mt-1">
                                            <Text className="text-white text-xs font-semibold">CUSTOMER</Text>
                                            <Text className="text-gray-400 text-xs">{tripData.customer.name}, {tripData.customer.address}</Text>
                                        </View>
                                    </View>
                                </Marker>

                                {/* Route Line */}
                                <Polyline
                                    coordinates={[
                                        tripData.restaurant.coordinates,
                                        tripData.customer.coordinates,
                                    ]}
                                    strokeColor="#3B82F6"
                                    strokeWidth={3}
                                    lineDashPattern={[5, 5]}
                                />
                            </MapView>
                        </View>
                    </View>

                    {/* Timeline Section */}
                    <View className="px-6 mb-6">
                        <Text className="text-[#3B82F6] text-sm font-bold mb-4 tracking-wider">
                            TIMELINE
                        </Text>

                        {tripData.timeline.map((event, index) => (
                            <View key={event.id} className="flex-row mb-6">
                                {/* Icon and Line */}
                                <View className="items-center mr-4">
                                    <View className="w-10 h-10 rounded-full bg-[#3B82F6] items-center justify-center">
                                        <Ionicons name={event.icon} size={24} color="#FFF" />
                                    </View>
                                    {index < tripData.timeline.length - 1 && (
                                        <View className="w-0.5 h-12 bg-[#3B82F6]/30 mt-2" />
                                    )}
                                </View>

                                {/* Event Info */}
                                <View className="flex-1 pt-2">
                                    <View className="flex-row justify-between items-start mb-1">
                                        <Text className="text-white font-bold text-base">
                                            {event.title}
                                        </Text>
                                        <Text className="text-gray-400 text-sm">
                                            {event.time}
                                        </Text>
                                    </View>
                                    <Text className="text-gray-400 text-sm">
                                        {event.subtitle}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Financial Summary */}
                    <View className="px-6 mb-6">
                        <View className="bg-[#1A1F3A] rounded-3xl p-6 border border-[#2A2F4A]">
                            {/* Header */}
                            <View className="flex-row justify-between items-center mb-6">
                                <Text className="text-[#3B82F6] text-sm font-bold tracking-wider">
                                    FINANCIAL SUMMARY
                                </Text>
                                <View className="bg-[#3B82F6]/20 px-3 py-1 rounded-full">
                                    <Text className="text-[#3B82F6] text-xs font-bold">
                                        PAID OUT
                                    </Text>
                                </View>
                            </View>

                            {/* Total at Top */}
                            <View className="mb-6 pb-6 border-b border-[#2A2F4A]">
                                <Text className="text-gray-400 text-xs mb-1">Standard Delivery Fare</Text>
                                <Text className="text-white text-4xl font-bold">
                                    ${tripData.earnings.total.toFixed(2)}
                                </Text>
                            </View>

                            {/* Breakdown */}
                            <View className="gap-4">
                                {/* Base Fare */}
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-gray-400 text-base">Base Fare</Text>
                                    <Text className="text-white text-lg font-semibold">
                                        ${tripData.earnings.baseFare.toFixed(2)}
                                    </Text>
                                </View>

                                {/* Distance */}
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-gray-400 text-base">
                                        Distance ({tripData.earnings.distanceMiles} mi)
                                    </Text>
                                    <Text className="text-white text-lg font-semibold">
                                        ${tripData.earnings.distance.toFixed(2)}
                                    </Text>
                                </View>

                                {/* Boost Promotion */}
                                {tripData.earnings.boostMultiplier && (
                                    <View className="flex-row justify-between items-center">
                                        <View className="flex-row items-center">
                                            <Text className="text-gray-400 text-base mr-2">
                                                Boost Promotion
                                            </Text>
                                            <View className="bg-[#3B82F6] px-2 py-0.5 rounded">
                                                <Text className="text-white text-xs font-bold">
                                                    {tripData.earnings.boostMultiplier}X
                                                </Text>
                                            </View>
                                        </View>
                                        <Text className="text-[#3B82F6] text-lg font-bold">
                                            +${tripData.earnings.boostAmount?.toFixed(2)}
                                        </Text>
                                    </View>
                                )}

                                {/* Customer Tip */}
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-gray-400 text-base">Customer Tip</Text>
                                    <Text className="text-[#10B981] text-lg font-bold">
                                        ${tripData.earnings.customerTip.toFixed(2)}
                                    </Text>
                                </View>
                            </View>

                            {/* Total Trip Earnings Button */}
                            <TouchableOpacity
                                onPress={handleViewEarnings}
                                className="bg-[#2A2F4A] rounded-2xl p-4 flex-row items-center justify-between mt-6"
                            >
                                <View className="flex-row items-center">
                                    <View className="w-10 h-10 rounded-full bg-[#3B82F6] items-center justify-center mr-3">
                                        <Ionicons name="wallet" size={20} color="#FFF" />
                                    </View>
                                    <View>
                                        <Text className="text-gray-400 text-xs">TOTAL TRIP EARNINGS</Text>
                                        <Text className="text-white text-xl font-bold">
                                            ${tripData.earnings.total.toFixed(2)}
                                        </Text>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Report Issue Button */}
                    <View className="px-6 mb-8">
                        <TouchableOpacity
                            onPress={handleReportIssue}
                            className="bg-transparent border-2 border-[#F59E0B] rounded-full py-4 flex-row items-center justify-center"
                        >
                            <Ionicons name="warning" size={20} color="#F59E0B" />
                            <Text className="text-[#F59E0B] font-bold text-base ml-2">
                                REPORT ISSUE WITH THIS TRIP
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bottom spacing */}
                    <View className="h-8" />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
