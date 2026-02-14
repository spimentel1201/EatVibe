import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';

interface NavigationData {
    destination: {
        name: string;
        address: string;
        coordinates: { latitude: number; longitude: number };
        type: 'restaurant' | 'customer';
    };
    currentLocation: {
        latitude: number;
        longitude: number;
    };
    distance: number;
    estimatedTime: number;
    instructions: string;
}

export default function NavigationScreen() {
    const router = useRouter();
    const [isPanelExpanded, setIsPanelExpanded] = useState(false);

    // Mock data
    const navData: NavigationData = {
        destination: {
            name: 'Burger Palace',
            address: '123 Main St, Downtown',
            coordinates: { latitude: 37.7849, longitude: -122.4094 },
            type: 'restaurant',
        },
        currentLocation: {
            latitude: 37.7749,
            longitude: -122.4194,
        },
        distance: 0.8,
        estimatedTime: 5,
        instructions: 'Head north on Main St, then turn right on 5th Ave',
    };

    const openInGoogleMaps = () => {
        const { latitude, longitude } = navData.destination.coordinates;
        const url = Platform.select({
            ios: `maps://app?daddr=${latitude},${longitude}`,
            android: `google.navigation:q=${latitude},${longitude}`,
        });
        if (url) {
            Linking.openURL(url);
        }
    };

    const openInWaze = () => {
        const { latitude, longitude } = navData.destination.coordinates;
        const url = `waze://?ll=${latitude},${longitude}&navigate=yes`;
        Linking.canOpenURL(url).then((supported) => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Linking.openURL(
                    `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`
                );
            }
        });
    };

    const handleCall = () => {
        const phoneNumber = navData.destination.type === 'restaurant'
            ? 'tel:+15551234567'
            : 'tel:+15559876543';
        Linking.openURL(phoneNumber);
    };

    const handleReportIssue = () => {
        router.push('/courier/delivery/report-issue' as any);
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
            {/* Full Screen Map */}
            <MapView
                provider={PROVIDER_DEFAULT}
                style={{ flex: 1 }}
                customMapStyle={darkMapStyle}
                initialRegion={{
                    latitude: (navData.currentLocation.latitude + navData.destination.coordinates.latitude) / 2,
                    longitude: (navData.currentLocation.longitude + navData.destination.coordinates.longitude) / 2,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
                showsUserLocation
                followsUserLocation
                showsMyLocationButton={false}
            >
                {/* Current Location Marker */}
                <Marker coordinate={navData.currentLocation}>
                    <View className="w-4 h-4 rounded-full bg-[#3B82F6] border-4 border-white" />
                </Marker>

                {/* Destination Marker */}
                <Marker coordinate={navData.destination.coordinates}>
                    <View className="items-center">
                        <View className="w-12 h-12 rounded-full bg-[#EF4444] items-center justify-center border-2 border-white shadow-lg">
                            <Ionicons
                                name={navData.destination.type === 'restaurant' ? 'restaurant' : 'home'}
                                size={24}
                                color="#FFF"
                            />
                        </View>
                    </View>
                </Marker>

                {/* Route Line */}
                <Polyline
                    coordinates={[navData.currentLocation, navData.destination.coordinates]}
                    strokeColor="#3B82F6"
                    strokeWidth={4}
                />
            </MapView>

            {/* Top Bar */}
            <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0">
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-12 h-12 rounded-full bg-[#0A0E27]/90 items-center justify-center"
                    >
                        <Ionicons name="close" size={24} color="#FFF" />
                    </TouchableOpacity>

                    <View className="bg-[#0A0E27]/90 rounded-full px-6 py-3">
                        <Text className="text-white font-bold text-lg">
                            {navData.estimatedTime} min • {navData.distance} mi
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => { }}
                        className="w-12 h-12 rounded-full bg-[#0A0E27]/90 items-center justify-center"
                    >
                        <Ionicons name="locate" size={24} color="#3B82F6" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Floating Action Buttons */}
            <View className="absolute right-6 bottom-80">
                <TouchableOpacity
                    onPress={openInGoogleMaps}
                    className="w-14 h-14 rounded-full bg-[#0A0E27]/90 items-center justify-center mb-3 shadow-lg"
                >
                    <Ionicons name="navigate" size={24} color="#3B82F6" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={openInWaze}
                    className="w-14 h-14 rounded-full bg-[#0A0E27]/90 items-center justify-center mb-3 shadow-lg"
                >
                    <Ionicons name="car" size={24} color="#10B981" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleCall}
                    className="w-14 h-14 rounded-full bg-[#3B82F6] items-center justify-center shadow-lg"
                >
                    <Ionicons name="call" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            {/* Bottom Panel */}
            <SafeAreaView edges={['bottom']} className="absolute bottom-0 left-0 right-0">
                <View className="bg-[#0A0E27]/95 rounded-t-3xl border-t-2 border-[#2A2F4A]">
                    {/* Drag Handle */}
                    <TouchableOpacity
                        onPress={() => setIsPanelExpanded(!isPanelExpanded)}
                        className="items-center py-3"
                    >
                        <View className="w-12 h-1 bg-gray-600 rounded-full" />
                    </TouchableOpacity>

                    <View className="px-6 pb-6">
                        {/* Destination Info */}
                        <View className="flex-row items-center mb-4">
                            <View className="w-12 h-12 rounded-full bg-[#EF4444] items-center justify-center mr-4">
                                <Ionicons
                                    name={navData.destination.type === 'restaurant' ? 'restaurant' : 'home'}
                                    size={24}
                                    color="#FFF"
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-400 text-xs font-bold tracking-wider mb-1">
                                    {navData.destination.type === 'restaurant' ? 'PICKUP FROM' : 'DELIVER TO'}
                                </Text>
                                <Text className="text-white text-lg font-bold">
                                    {navData.destination.name}
                                </Text>
                                <Text className="text-gray-400 text-sm">
                                    {navData.destination.address}
                                </Text>
                            </View>
                        </View>

                        {/* Instructions */}
                        {isPanelExpanded && (
                            <View className="bg-[#1A1F3A] rounded-2xl p-4 mb-4">
                                <View className="flex-row items-center mb-2">
                                    <Ionicons name="navigate-circle" size={20} color="#3B82F6" />
                                    <Text className="text-[#3B82F6] text-sm font-bold ml-2">
                                        NAVIGATION INSTRUCTIONS
                                    </Text>
                                </View>
                                <Text className="text-gray-300 text-base">
                                    {navData.instructions}
                                </Text>
                            </View>
                        )}

                        {/* Action Buttons */}
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={handleReportIssue}
                                className="flex-1 bg-[#1A1F3A] rounded-2xl py-4 flex-row items-center justify-center border border-[#2A2F4A]"
                            >
                                <Ionicons name="warning" size={20} color="#F59E0B" />
                                <Text className="text-[#F59E0B] font-bold ml-2">Report Issue</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="flex-1 bg-[#3B82F6] rounded-2xl py-4 flex-row items-center justify-center"
                            >
                                <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                                <Text className="text-white font-bold ml-2">I've Arrived</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}
