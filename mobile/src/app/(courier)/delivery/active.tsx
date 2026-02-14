import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

type DeliveryState = 'heading_to_restaurant' | 'at_restaurant' | 'picked_up' | 'heading_to_customer' | 'delivered';

export default function ActiveDeliveryScreen() {
    const params = useLocalSearchParams();
    const mapRef = useRef<any>(null);

    const [deliveryState, setDeliveryState] = useState<DeliveryState>('heading_to_restaurant');
    const [showOrderContents, setShowOrderContents] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');

    // Mock delivery data
    const delivery = {
        id: params.id || 'ORD-12345',
        restaurant: {
            name: 'The Burger Lab',
            address: '1242 Oak Street',
            distance: 2.4, // km
            estimatedTime: 8, // minutes
            status: 'READY', // PREPARING | READY
            phone: '+1 234 567 8900',
            location: {
                latitude: 37.78925,
                longitude: -122.4324,
            },
        },
        customer: {
            name: 'John Doe',
            address: '456 Elm Street, Apt 3B',
            phone: '+1 234 567 8901',
            location: {
                latitude: 37.79525,
                longitude: -122.4274,
            },
        },
        items: [
            { id: '1', name: 'Classic Burger', quantity: 2, notes: 'No onions' },
            { id: '2', name: 'French Fries', quantity: 1, notes: 'Extra crispy' },
            { id: '3', name: 'Coke', quantity: 2, notes: '' },
        ],
        navigation: {
            nextTurn: 'Turn right onto Baker St.',
            distance: 50, // meters
            direction: 'right', // left | right | straight
        },
    };

    // Courier current location (mock)
    const courierLocation = {
        latitude: 37.78825,
        longitude: -122.4334,
    };

    // Route polyline
    const routeCoordinates = [
        courierLocation,
        { latitude: 37.78925, longitude: -122.4330 },
        { latitude: 37.78975, longitude: -122.4328 },
        delivery.restaurant.location,
    ];

    // Dark map style
    const darkMapStyle = [
        { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
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

    const handleSwipeToPickUp = () => {
        if (deliveryState === 'heading_to_restaurant') {
            setDeliveryState('at_restaurant');
            // TODO: Show confirmation dialog
            console.log('Arrived at restaurant');
        } else if (deliveryState === 'at_restaurant') {
            setDeliveryState('picked_up');
            // TODO: Update route to customer
            console.log('Order picked up');
        }
    };



    const getSwipeButtonText = () => {
        switch (deliveryState) {
            case 'heading_to_restaurant':
                return 'SWIPE TO PICK UP';
            case 'at_restaurant':
                return 'SWIPE TO CONFIRM PICKUP';
            case 'picked_up':
            case 'heading_to_customer':
                return 'SWIPE TO COMPLETE';
            default:
                return 'SWIPE';
        }
    };

    const getDirectionIcon = () => {
        switch (delivery.navigation.direction) {
            case 'left':
                return 'arrow-back';
            case 'right':
                return 'arrow-forward';
            case 'straight':
                return 'arrow-up';
            default:
                return 'navigate';
        }
    };

    return (
        <View className="flex-1 bg-[#1A1F2E]">
            {/* Map */}
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: courierLocation.latitude,
                    longitude: courierLocation.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                customMapStyle={darkMapStyle}
                showsUserLocation={false}
                showsMyLocationButton={false}
            >
                {/* Route Polyline */}
                <Polyline
                    coordinates={routeCoordinates}
                    strokeColor="#3B82F6"
                    strokeWidth={4}
                />

                {/* Restaurant Marker */}
                <Marker coordinate={delivery.restaurant.location}>
                    <View className="items-center">
                        <View className="w-10 h-10 rounded-full bg-[#EF4444] items-center justify-center border-2 border-white">
                            <Ionicons name="restaurant" size={20} color="#FFF" />
                        </View>
                    </View>
                </Marker>

                {/* Courier Location Marker */}
                <Marker coordinate={courierLocation}>
                    <View className="items-center">
                        <View className="w-12 h-12 rounded-full bg-[#EC4899] items-center justify-center border-4 border-white shadow-lg">
                            <Ionicons name="navigate" size={20} color="#FFF" />
                        </View>
                    </View>
                </Marker>
            </MapView>

            {/* Navigation Instruction */}
            <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0">
                <View className="mx-4 mt-4">
                    <View className="bg-[#3B82F6] rounded-3xl px-6 py-4 flex-row items-center shadow-lg">
                        <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mr-4">
                            <Ionicons name={getDirectionIcon()} size={24} color="#FFF" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white text-2xl font-bold mb-1">
                                {delivery.navigation.distance}m
                            </Text>
                            <Text className="text-white/90 text-base">
                                {delivery.navigation.nextTurn}
                            </Text>
                        </View>
                    </View>
                </View>
            </SafeAreaView>

            {/* Bottom Panel */}
            <View className="absolute bottom-0 left-0 right-0">
                <View className="bg-[#1A1F2E] rounded-t-3xl pt-6 pb-2 px-6">
                    {/* Restaurant Info */}
                    <View className="flex-row items-center mb-6">
                        {/* Restaurant Icon */}
                        <View className="w-16 h-16 rounded-full bg-[#2A2F3E] items-center justify-center mr-4 border-2 border-[#3A3F4E]">
                            <Ionicons name="fast-food" size={28} color="#F59E0B" />
                        </View>

                        {/* Restaurant Details */}
                        <View className="flex-1">
                            <Text className="text-white text-xl font-bold mb-1">
                                {delivery.restaurant.name}
                            </Text>
                            <Text className="text-gray-400 text-sm">
                                {delivery.restaurant.distance} km • {delivery.restaurant.estimatedTime} min away
                            </Text>
                        </View>

                        {/* Status Badge */}
                        <View className="bg-[#10B981] px-4 py-2 rounded-full">
                            <Text className="text-white font-bold text-xs">
                                {delivery.restaurant.status}
                            </Text>
                        </View>
                    </View>

                    {/* Order Contents Accordion */}
                    <TouchableOpacity
                        onPress={() => setShowOrderContents(!showOrderContents)}
                        className="flex-row items-center justify-between py-4 border-t border-[#2A2F3E]"
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="bag-outline" size={24} color="#3B82F6" />
                            <Text className="text-white text-base font-semibold ml-3">
                                Order Contents
                            </Text>
                        </View>
                        <Ionicons
                            name={showOrderContents ? 'chevron-up' : 'chevron-down'}
                            size={24}
                            color="#9CA3AF"
                        />
                    </TouchableOpacity>

                    {/* Order Items (Expandable) */}
                    {showOrderContents && (
                        <View className="pb-4">
                            {delivery.items.map((item) => (
                                <View
                                    key={item.id}
                                    className="flex-row justify-between items-start py-3 border-b border-[#2A2F3E]/50"
                                >
                                    <View className="flex-1">
                                        <Text className="text-white font-semibold">
                                            {item.quantity}x {item.name}
                                        </Text>
                                        {item.notes && (
                                            <Text className="text-gray-400 text-sm mt-1">
                                                Note: {item.notes}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Swipe Button */}
                    <View className="py-4">
                        <TouchableOpacity
                            onPress={handleSwipeToPickUp}
                            className="bg-[#2A2F3E] rounded-full h-16 flex-row items-center px-2 relative overflow-hidden"
                        >
                            {/* Progress bar background */}
                            <View className="absolute left-0 top-0 bottom-0 w-1/4 bg-[#3B82F6] rounded-full" />

                            {/* Swipe Icon */}
                            <View className="w-14 h-14 rounded-full bg-[#3B82F6] items-center justify-center z-10">
                                <Ionicons name="chevron-forward" size={28} color="#FFF" />
                            </View>

                            {/* Text */}
                            <View className="flex-1 items-center">
                                <Text className="text-gray-500 font-bold text-sm tracking-wider">
                                    {getSwipeButtonText()}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Navigation */}
                    <SafeAreaView edges={['bottom']}>
                        <View className="flex-row items-center justify-around pt-2 pb-2">
                            {/* Dashboard */}
                            <TouchableOpacity
                                onPress={() => setActiveTab('dashboard')}
                                className="items-center py-2"
                            >
                                <Ionicons
                                    name="grid-outline"
                                    size={24}
                                    color={activeTab === 'dashboard' ? '#3B82F6' : '#64748B'}
                                />
                                <Text
                                    className={`text-xs mt-1 font-semibold ${activeTab === 'dashboard' ? 'text-[#3B82F6]' : 'text-gray-500'
                                        }`}
                                >
                                    Dashboard
                                </Text>
                            </TouchableOpacity>

                            {/* Earnings */}
                            <TouchableOpacity
                                onPress={() => setActiveTab('earnings')}
                                className="items-center py-2"
                            >
                                <Ionicons
                                    name="wallet-outline"
                                    size={24}
                                    color={activeTab === 'earnings' ? '#3B82F6' : '#64748B'}
                                />
                                <Text
                                    className={`text-xs mt-1 font-semibold ${activeTab === 'earnings' ? 'text-[#3B82F6]' : 'text-gray-500'
                                        }`}
                                >
                                    Earnings
                                </Text>
                            </TouchableOpacity>

                            {/* Account */}
                            <TouchableOpacity
                                onPress={() => setActiveTab('account')}
                                className="items-center py-2"
                            >
                                <Ionicons
                                    name="person-outline"
                                    size={24}
                                    color={activeTab === 'account' ? '#3B82F6' : '#64748B'}
                                />
                                <Text
                                    className={`text-xs mt-1 font-semibold ${activeTab === 'account' ? 'text-[#3B82F6]' : 'text-gray-500'
                                        }`}
                                >
                                    Account
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </View>
            </View>
        </View>
    );
}
