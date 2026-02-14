import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRestaurantDetail } from '@/features/restaurant/hooks/useRestaurantDetail';
import { MenuItemCard, ProductCustomizationModal } from '@/components/business';
import { LoadingSpinner } from '@/components/ui';
import { MenuItem } from '@/features/restaurant/types';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '@/features/cart/store/useCartStore';

export default function RestaurantDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const addItem = useCartStore((state: any) => state.addItem);

    const { restaurant, menu, isLoading, error } = useRestaurantDetail(id);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleSelectProduct = (item: MenuItem) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const handleAddToCart = (quantity: number, selectedModifiers: any) => {
        if (selectedItem) {
            if (restaurant?.id) {
                addItem(selectedItem, quantity, restaurant.id);
            }
            setModalVisible(false);
            console.log('Added to cart with modifiers:', selectedModifiers);
        }
    };

    if (isLoading) {
        return <LoadingSpinner fullScreen message="Loading menu..." />;
    }

    if (error || !restaurant) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 justify-center items-center px-6">
                    <Text className="text-4xl mb-4">😕</Text>
                    <Text className="text-lg font-bold text-gray-900 mb-2 text-center">
                        Restaurant not found
                    </Text>
                    <TouchableOpacity
                        className="mt-4 bg-[#FF5722] px-8 py-4 rounded-full"
                        onPress={() => router.back()}
                    >
                        <Text className="text-white font-bold">Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <SafeAreaView edges={['top']} className="bg-white border-b border-gray-100">
                <View className="flex-row items-center h-14 px-4">
                    <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
                        <Ionicons name="chevron-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text className="text-lg font-black text-gray-900 flex-1 text-center" numberOfLines={1}>
                        {restaurant.name}
                    </Text>
                    <TouchableOpacity className="w-10 h-10 items-center justify-center">
                        <Ionicons name="search-outline" size={24} color="#1F2937" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero section */}
                <View className="relative">
                    <Image
                        source={{ uri: restaurant.image }}
                        className="w-full h-80"
                        resizeMode="cover"
                    />
                    {!restaurant.isOpen && (
                        <View className="absolute top-1/2 left-1/2 -ml-12 -mt-6 bg-black/60 px-6 py-3 rounded-full border border-white/20">
                            <Text className="text-white font-black text-sm uppercase tracking-widest">Closed</Text>
                        </View>
                    )}
                </View>

                {/* Restaurant Info */}
                <View className="bg-white rounded-t-[40px] -mt-10 px-6 pt-8 pb-4">
                    <View className="flex-row justify-between items-start mb-4">
                        <View className="flex-1 mr-4">
                            <Text className="text-3xl font-black text-gray-900 mb-1">{restaurant.name}</Text>
                            <Text className="text-gray-500 text-sm">{restaurant.description}</Text>
                        </View>
                        <View className="bg-orange-50 px-3 py-2 rounded-2xl items-center flex-row">
                            <Ionicons name="star" size={16} color="#FF5722" />
                            <Text className="text-[#FF5722] font-black ml-1">{restaurant.rating}</Text>
                        </View>
                    </View>

                    {/* Quick Stats */}
                    <View className="flex-row items-center border-y border-gray-100 py-6 mb-6">
                        <View className="flex-1 items-center border-r border-gray-100">
                            <Ionicons name="time-outline" size={20} color="#9CA3AF" />
                            <Text className="text-gray-900 font-bold mt-1">{restaurant.deliveryTime}</Text>
                            <Text className="text-gray-400 text-[10px] uppercase font-bold mt-0.5">Delivery</Text>
                        </View>
                        <View className="flex-1 items-center border-r border-gray-100">
                            <Ionicons name="bicycle-outline" size={20} color="#9CA3AF" />
                            <Text className="text-gray-900 font-bold mt-1">
                                {restaurant.deliveryFee === 0 ? 'Free' : `S/ ${restaurant.deliveryFee.toFixed(2)}`}
                            </Text>
                            <Text className="text-gray-400 text-[10px] uppercase font-bold mt-0.5">Fee</Text>
                        </View>
                        <View className="flex-1 items-center">
                            <Ionicons name="location-outline" size={20} color="#9CA3AF" />
                            <Text className="text-gray-900 font-bold mt-1">{restaurant.distance?.toFixed(1)} km</Text>
                            <Text className="text-gray-400 text-[10px] uppercase font-bold mt-0.5">Distance</Text>
                        </View>
                    </View>

                    {/* Menu Title */}
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-2xl font-black text-gray-900">Featured Menu</Text>
                        <TouchableOpacity>
                            <Text className="text-[#FF5722] font-bold">View all</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Menu Items */}
                    {menu && menu.length > 0 ? (
                        menu.map((item: MenuItem) => (
                            <MenuItemCard
                                key={item.id}
                                item={item}
                                onAddToCart={() => handleSelectProduct(item)}
                            />
                        ))
                    ) : (
                        <View className="py-12 items-center bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
                            <Ionicons name="restaurant-outline" size={48} color="#D1D5DB" />
                            <Text className="text-gray-900 font-bold mt-4">Menu not available</Text>
                            <Text className="text-gray-500 text-sm text-center px-10 mt-2">
                                Check back later for delicious updates!
                            </Text>
                        </View>
                    )}
                </View>

                <View className="h-32" />
            </ScrollView>

            {/* Customization Modal */}
            <ProductCustomizationModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                item={selectedItem}
                onAddToCart={handleAddToCart}
            />
        </View>
    );
}
