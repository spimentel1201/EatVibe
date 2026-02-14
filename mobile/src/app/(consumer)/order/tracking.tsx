import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';

type OrderStatus = 'confirmed' | 'preparing' | 'on_the_way' | 'delivered';

const { height } = Dimensions.get('window');

// Dark map style
const darkMapStyle = [
    {
        "elementType": "geometry",
        "stylers": [{ "color": "#242f3e" }]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#746855" }]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#242f3e" }]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#d59563" }]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#d59563" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "color": "#263c3f" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#6b9a76" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{ "color": "#38414e" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{ "color": "#212a37" }]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9ca5b3" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{ "color": "#746855" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{ "color": "#1f2835" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#f3d19c" }]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [{ "color": "#2f3948" }]
    },
    {
        "featureType": "transit.station",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#d59563" }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#17263c" }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#515c6d" }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#17263c" }]
    }
];

import { orderApi } from '@/features/order/api/orderApi';
import { OrderResponse } from '@/features/order/types';

// ... imports ...

export default function OrderTrackingScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const orderId = params.id as string;
    const mapRef = useRef<any>(null);

    const [order, setOrder] = useState<OrderResponse | null>(null);
    const [currentStatus, setCurrentStatus] = useState<OrderStatus>('confirmed');
    const [estimatedTime, setEstimatedTime] = useState('15-20 mins');

    // ... coordinates ...
    // Coordinates - Lima, Peru (Miraflores area)
    const restaurantLocation = {
        latitude: -12.1191,
        longitude: -77.0350,
    };

    const [courierLocation, setCourierLocation] = useState({
        latitude: -12.1150,
        longitude: -77.0320,
    });

    const destinationLocation = {
        latitude: -12.1100,
        longitude: -77.0280,
    };

    // Mock courier data
    const courier = {
        name: 'Ahmad R.',
        licensePlate: 'B 1234 XYZ',
        vehicle: 'Honda Vario',
        avatar: 'https://i.pravatar.cc/150?img=33',
        isOnline: true,
    };

    useEffect(() => {
        if (orderId) {
            fetchOrder();
            const interval = setInterval(fetchOrder, 10000); // Poll every 10s
            return () => clearInterval(interval);
        }
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const data = await orderApi.getOrderById(orderId);
            setOrder(data);
            mapStatus(data.status);
            if (data.estimatedDeliveryTime) {
                const date = new Date(data.estimatedDeliveryTime);
                const now = new Date();
                const diffMs = date.getTime() - now.getTime();
                const diffMins = Math.max(0, Math.ceil(diffMs / (1000 * 60)));
                setEstimatedTime(`${diffMins} mins`);
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        }
    };

    const mapStatus = (backendStatus: string) => {
        switch (backendStatus) {
            case 'PENDING':
            case 'CONFIRMED':
                setCurrentStatus('confirmed');
                break;
            case 'PREPARING':
            case 'READY_FOR_PICKUP':
                setCurrentStatus('preparing');
                break;
            case 'OUT_FOR_DELIVERY':
                setCurrentStatus('on_the_way');
                break;
            case 'DELIVERED':
                setCurrentStatus('delivered');
                break;
            default:
                setCurrentStatus('confirmed');
        }
    };

    // Simulate courier movement (replace with real-time updates from backend)
    useEffect(() => {
        if (currentStatus === 'on_the_way') {
            const interval = setInterval(() => {
                setCourierLocation(prev => ({
                    latitude: prev.latitude + (Math.random() - 0.5) * 0.0005,
                    longitude: prev.longitude + (Math.random() - 0.5) * 0.0005,
                }));
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [currentStatus]);

    const getStatusStep = (status: OrderStatus): number => {
        const steps = { confirmed: 0, preparing: 1, on_the_way: 2, delivered: 3 };
        return steps[status] || 0;
    };

    const currentStep = getStatusStep(currentStatus);

    // Simulate courier movement (replace with real-time updates from backend)
    useEffect(() => {
        if (currentStatus === 'on_the_way') {
            const interval = setInterval(() => {
                setCourierLocation(prev => ({
                    latitude: prev.latitude + (Math.random() - 0.5) * 0.0005,
                    longitude: prev.longitude + (Math.random() - 0.5) * 0.0005,
                }));
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [currentStatus]);

    // Animate camera to follow courier
    useEffect(() => {
        if (currentStatus === 'on_the_way') {
            mapRef.current?.animateToRegion({
                latitude: courierLocation.latitude,
                longitude: courierLocation.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            }, 1000);
        }
    }, [courierLocation, currentStatus]);

    const handleZoomIn = () => {
        mapRef.current?.animateCamera({
            zoom: 16,
        }, { duration: 300 });
    };

    return (
        <View className="flex-1 bg-gray-900">
            {/* Map Background - Full Screen */}
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: -12.1150,
                    longitude: -77.0320,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
                customMapStyle={darkMapStyle}
            >
                {/* Route Polyline */}
                <Polyline
                    coordinates={[
                        restaurantLocation,
                        courierLocation,
                        destinationLocation,
                    ]}
                    strokeColor="#FF5722"
                    strokeWidth={3}
                    lineDashPattern={[1]}
                />

                {/* Restaurant/Origin Marker */}
                <Marker coordinate={restaurantLocation}>
                    <View className="w-8 h-8 rounded-full bg-orange-500 items-center justify-center">
                        <View className="w-3 h-3 rounded-full bg-white" />
                    </View>
                </Marker>

                {/* Courier Marker */}
                <Marker coordinate={courierLocation}>
                    <View className="items-center">
                        {/* COURIER Badge */}
                        <View className="bg-[#FF5722] px-3 py-1 rounded-full mb-2">
                            <Text className="text-white text-xs font-bold">COURIER</Text>
                        </View>
                        {/* Courier Icon */}
                        <View className="w-12 h-12 rounded-full bg-[#FF5722] items-center justify-center shadow-lg">
                            <Ionicons name="bicycle" size={24} color="#FFF" />
                        </View>
                    </View>
                </Marker>

                {/* Destination Marker */}
                <Marker coordinate={destinationLocation}>
                    <View className="w-8 h-8 rounded-full bg-green-500 items-center justify-center">
                        <Ionicons name="home" size={16} color="#FFF" />
                    </View>
                </Marker>
            </MapView>

            {/* Floating Header */}
            <SafeAreaView edges={['top']}>
                <View className="flex-row items-center justify-between px-5 py-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-12 h-12 rounded-full bg-white items-center justify-center shadow-lg"
                    >
                        <Ionicons name="chevron-back" size={24} color="#000" />
                    </TouchableOpacity>

                    <Text className="text-lg font-bold text-white">Order #{order?.id?.substring(0, 8) || orderId}</Text>

                    <TouchableOpacity className="w-12 h-12 rounded-full bg-white items-center justify-center shadow-lg">
                        <Ionicons name="help-circle-outline" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Zoom Button */}
            <View className="absolute right-5 top-1/3">
                <TouchableOpacity
                    onPress={handleZoomIn}
                    className="w-12 h-12 rounded-full bg-white items-center justify-center shadow-lg"
                >
                    <Ionicons name="add" size={28} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Bottom Panel */}
            <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] pt-6 pb-8 px-6" style={{ maxHeight: height * 0.55 }}>
                {/* Estimated Arrival */}
                <View className="mb-6">
                    <Text className="text-xs text-gray-500 uppercase tracking-wide mb-1">Estimated Arrival</Text>
                    <View className="flex-row items-center justify-between">
                        <Text className="text-4xl font-bold text-[#FF5722]">{estimatedTime}</Text>
                        <View className="w-12 h-12 rounded-full bg-[#FF5722]/10 items-center justify-center">
                            <Ionicons name="time-outline" size={24} color="#FF5722" />
                        </View>
                    </View>
                </View>

                {/* Status Timeline - Horizontal */}
                <View className="mb-6">
                    <View className="flex-row items-center justify-between mb-3">
                        {/* Confirmed */}
                        <View className="items-center flex-1">
                            <View className={`w-12 h-12 rounded-full items-center justify-center ${currentStep >= 0 ? 'bg-[#FF5722]' : 'bg-gray-200'}`}>
                                <Ionicons name="checkmark" size={24} color={currentStep >= 0 ? '#FFF' : '#9CA3AF'} />
                            </View>
                            <Text className={`text-xs mt-2 font-semibold ${currentStep >= 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                                CONFIRMED
                            </Text>
                        </View>

                        {/* Line */}
                        <View className={`flex-1 h-1 -mt-6 ${currentStep >= 1 ? 'bg-[#FF5722]' : 'bg-gray-200'}`} />

                        {/* Preparing */}
                        <View className="items-center flex-1">
                            <View className={`w-12 h-12 rounded-full items-center justify-center ${currentStep >= 1 ? 'bg-[#FF5722]' : 'bg-gray-200'}`}>
                                <Ionicons name="restaurant" size={20} color={currentStep >= 1 ? '#FFF' : '#9CA3AF'} />
                            </View>
                            <Text className={`text-xs mt-2 font-semibold ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>
                                PREPARING
                            </Text>
                        </View>

                        {/* Line */}
                        <View className={`flex-1 h-1 -mt-6 ${currentStep >= 2 ? 'bg-[#FF5722]' : 'bg-gray-200'}`} />

                        {/* On the Way */}
                        <View className="items-center flex-1">
                            <View className={`w-12 h-12 rounded-full items-center justify-center ${currentStep >= 2 ? 'bg-[#FF5722]' : 'bg-gray-200'}`}>
                                <Ionicons name="bicycle" size={24} color={currentStep >= 2 ? '#FFF' : '#9CA3AF'} />
                            </View>
                            <Text className={`text-xs mt-2 font-semibold ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
                                ON THE WAY
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Status Alert */}
                {currentStatus === 'on_the_way' && (
                    <View className="bg-[#FF5722]/10 rounded-2xl p-4 mb-6 flex-row items-center">
                        <View className="w-8 h-8 rounded-full bg-[#FF5722]/20 items-center justify-center mr-3">
                            <Ionicons name="information" size={18} color="#FF5722" />
                        </View>
                        <Text className="flex-1 text-sm text-[#FF5722] font-medium">
                            Your courier is picking up speed!
                        </Text>
                    </View>
                )}

                {/* Courier Info */}
                <View className="flex-row items-center">
                    <View className="relative mr-4">
                        <Image
                            source={{ uri: courier.avatar }}
                            className="w-16 h-16 rounded-full"
                        />
                        {courier.isOnline && (
                            <View className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-green-500 border-2 border-white" />
                        )}
                    </View>

                    <View className="flex-1">
                        <Text className="text-base font-bold text-gray-900">{courier.name}</Text>
                        <View className="flex-row items-center mt-1">
                            <Ionicons name="car-sport-outline" size={14} color="#6B7280" />
                            <Text className="text-xs text-gray-500 ml-1">{courier.licensePlate} •</Text>
                            <Text className="text-xs text-gray-500 ml-1">{courier.vehicle}</Text>
                        </View>
                    </View>

                    <View className="flex-row gap-2">
                        <TouchableOpacity className="w-12 h-12 rounded-full bg-gray-900 items-center justify-center">
                            <Ionicons name="chatbubble-outline" size={20} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity className="w-12 h-12 rounded-full bg-[#FF5722] items-center justify-center">
                            <Ionicons name="call" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* DEV: Test Button to Feedback */}
                <TouchableOpacity
                    onPress={() => router.push(`/order/feedback?id=${orderId}` as any)}
                    className="mt-4 bg-green-500 py-3 rounded-2xl items-center"
                >
                    <Text className="text-white font-bold text-sm">🧪 Test: Go to Feedback</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
