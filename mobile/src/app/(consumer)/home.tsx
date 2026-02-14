import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { RefreshControl } from 'react-native';

import { useLocation } from '@/core/location/useLocation';
import { useRestaurants } from '@/features/restaurant/hooks/useRestaurants';
import { useCategories } from '@/features/restaurant/hooks/useCategories';
import { LoadingSpinner } from '@/components/ui';
import type { Restaurant, Category } from '@/features/restaurant/types';

export default function HomeScreen() {
    const router = useRouter();
    const { location, address, isLoading: isLocationLoading, refreshLocation } = useLocation();

    // State
    const [activeCategory, setActiveCategory] = React.useState<string>('all');
    const [refreshing, setRefreshing] = React.useState(false);
    const [searchText, setSearchText] = React.useState('');

    // Hooks
    const {
        data: restaurants = [],
        isLoading: isRestaurantsLoading,
        refetch: refetchRestaurants
    } = useRestaurants({
        latitude: location?.latitude || 0,
        longitude: location?.longitude || 0,
    });

    const { data: categories = [] } = useCategories();

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await Promise.all([
            refreshLocation(),
            refetchRestaurants()
        ]);
        setRefreshing(false);
    }, [refreshLocation, refetchRestaurants]);

    // Client-side filtering
    const filteredRestaurants = React.useMemo(() => {
        let result = restaurants;

        // Filter by category
        if (activeCategory !== 'all') {
            const selectedCat = categories.find((c: Category) => c.id === activeCategory);
            if (selectedCat) {
                // We filter by name because backend restaurant object has category names string[]
                result = result.filter((r: Restaurant) =>
                    r.categories.some((catName: string) => catName.toLowerCase() === selectedCat.name.toLowerCase())
                );
            }
        }

        // Filter by search text
        if (searchText) {
            const lowerSearch = searchText.toLowerCase();
            result = result.filter((r: Restaurant) =>
                r.name.toLowerCase().includes(lowerSearch) ||
                r.description.toLowerCase().includes(lowerSearch) ||
                r.categories.some((c: string) => c.toLowerCase().includes(lowerSearch))
            );
        }

        return result;
    }, [restaurants, activeCategory, searchText, categories]);

    // Combined Categories with "All" option
    const displayCategories = React.useMemo(() => [
        { id: 'all', name: 'All', icon: 'silverware-fork-knife' },
        ...categories.map((c: Category) => ({
            ...c,
            icon: c.icon || 'food' // Fallback icon
        }))
    ], [categories]);

    if (isLocationLoading && !refreshing && restaurants.length === 0) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView
                className="px-5 pt-2"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#FF5722']}
                        tintColor="#FF5722"
                    />
                }
            >

                {/* HEADER */}
                <View className="flex-row justify-between items-center mb-5 mt-2">
                    <View className="flex-1">
                        <TouchableOpacity className="flex-row items-center active:opacity-70" onPress={refreshLocation}>
                            <Ionicons name="location" size={22} color="#FF5722" />
                            <Text className="font-bold text-lg ml-2 text-gray-800" numberOfLines={1}>
                                {address || 'Select Location'}
                            </Text>
                            <View className="ml-1">
                                <Ionicons name="chevron-down" size={18} color="#FF5722" />
                            </View>
                        </TouchableOpacity>
                        <Text className="text-gray-400 text-sm ml-7 mt-0.5 font-medium">Delivering to your door</Text>
                    </View>
                    <View className="flex-row items-center space-x-3">
                        <TouchableOpacity className="bg-white p-2.5 rounded-full shadow-sm shadow-gray-200">
                            <Ionicons name="notifications-outline" size={24} color="#374151" />
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-orange-100 p-1 rounded-full">
                            <View className="bg-orange-500 w-9 h-9 rounded-full justify-center items-center shadow-sm">
                                <Ionicons name="person" size={20} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* SEARCH BAR */}
                <View className="flex-row items-center bg-gray-100 rounded-[24px] px-5 py-3.5 mb-7">
                    <Ionicons name="search" size={22} color="#9CA3AF" />
                    <TextInput
                        placeholder="Sushi, Burgers, Pizza..."
                        className="flex-1 ml-3 text-gray-700 text-base font-medium"
                        placeholderTextColor="#9CA3AF"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                    <TouchableOpacity>
                        <Ionicons name="options-outline" size={22} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                {/* CATEGORIES */}
                <View className="mb-8">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
                        {displayCategories.map((cat: any) => {
                            const isActive = activeCategory === cat.id;
                            return (
                                <TouchableOpacity
                                    key={cat.id}
                                    onPress={() => setActiveCategory(cat.id)}
                                    className={`flex-row items-center px-5 py-3.5 rounded-full mr-3 border ${isActive ? 'bg-orange-500 border-orange-500 shadow-lg shadow-orange-200/50' : 'bg-white border-transparent shadow-sm shadow-gray-100'}`}
                                >
                                    <MaterialCommunityIcons
                                        name={(cat.icon as any) || 'food'}
                                        size={22}
                                        color={isActive ? 'white' : '#4B5563'}
                                        style={{ marginRight: 8 }}
                                    />
                                    <Text className={`font-bold text-sm ${isActive ? 'text-white' : 'text-gray-600'}`}>
                                        {cat.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                        <View className="w-4" />
                    </ScrollView>
                </View>

                {/* BANNER */}
                <View className="bg-orange-500 rounded-[32px] p-6 mb-8 relative overflow-hidden shadow-xl shadow-orange-300/40 h-44 justify-center">
                    <View className="absolute -right-12 -bottom-16 bg-white w-48 h-48 rounded-full opacity-10" />
                    <View className="absolute right-8 top-8 bg-white w-24 h-24 rounded-full opacity-10" />
                    <View className="z-10 w-2/3">
                        <Text className="text-orange-100 text-xs font-black uppercase tracking-widest mb-2">Limited Offer</Text>
                        <Text className="text-white text-3xl font-black leading-tight shadow-sm">
                            Free Delivery on your first order!
                        </Text>
                    </View>
                    <MaterialCommunityIcons name="moped" size={100} color="white" style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.25, transform: [{ rotate: '-15deg' }] }} />
                </View>

                {/* RESTAURANTS HEADER */}
                <View className="flex-row justify-between items-end mb-5 px-1">
                    <Text className="text-xl font-bold text-gray-900 tracking-tight">Restaurants near you</Text>
                    <TouchableOpacity>
                        <Text className="text-orange-500 font-bold text-sm">See All</Text>
                    </TouchableOpacity>
                </View>

                {/* RESTAURANT LIST */}
                <View className="space-y-7">
                    {isRestaurantsLoading && !refreshing ? (
                        <View className="py-10">
                            <LoadingSpinner />
                        </View>
                    ) : (
                        filteredRestaurants.map((rest: Restaurant) => (
                            <TouchableOpacity
                                key={rest.id}
                                activeOpacity={0.95}
                                className="bg-white rounded-[28px] shadow-sm shadow-gray-200/50 mb-4 overflow-hidden border border-gray-100"
                                onPress={() => {
                                    router.push(`/restaurant-detail?id=${rest.id}` as any);
                                }}
                            >
                                {/* IMAGE SECTION */}
                                <View className="h-52 relative">
                                    <Image
                                        source={{ uri: rest.image }}
                                        className="w-full h-full object-cover"
                                    />
                                    <TouchableOpacity className="absolute top-4 right-4 bg-white/20 backdrop-blur-lg p-2.5 rounded-full">
                                        <Ionicons name="heart-outline" size={22} color="white" />
                                    </TouchableOpacity>

                                    <View className="absolute bottom-4 left-4 bg-white px-3 py-1.5 rounded-full flex-row items-center shadow-lg shadow-black/10">
                                        <Ionicons name="star" size={14} color="#F59E0B" />
                                        <Text className="text-xs font-black ml-1.5 text-gray-800">{rest.rating}</Text>
                                    </View>

                                    {!rest.isOpen && (
                                        <View className="absolute inset-0 bg-black/50 justify-center items-center backdrop-blur-[2px]">
                                            <View className="bg-white/20 px-5 py-2.5 rounded-full backdrop-blur-xl border border-white/30">
                                                <Text className="text-white font-bold tracking-wide">Currently Closed</Text>
                                            </View>
                                        </View>
                                    )}
                                </View>

                                {/* CONTENT SECTION */}
                                <View className="p-5">
                                    <View className="flex-row justify-between items-start mb-2">
                                        <Text className="text-xl font-black text-gray-900 flex-1 mr-2">{rest.name}</Text>
                                    </View>

                                    <Text className="text-gray-500 text-sm mb-4 font-medium" numberOfLines={1}>
                                        {rest.description || rest.categories.join(" • ") || "Restaurant"}
                                    </Text>

                                    <View className="flex-row items-center space-x-5 border-t border-gray-50 pt-4">
                                        <View className="flex-row items-center">
                                            <Ionicons name="time-outline" size={16} color="#FF5722" />
                                            <Text className="text-gray-600 text-xs font-bold ml-1.5">
                                                {!rest.isOpen ? 'Closed' : rest.deliveryTime}
                                            </Text>
                                        </View>
                                        <View className="flex-row items-center">
                                            <Ionicons name="bicycle-outline" size={16} color="#FF5722" />
                                            <Text className="text-gray-600 text-xs font-bold ml-1.5">
                                                {rest.deliveryFee > 0 ? `$${rest.deliveryFee.toFixed(2)}` : 'Free'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}

                    {!isRestaurantsLoading && filteredRestaurants.length === 0 && (
                        <View className="py-10 items-center">
                            <Text className="text-gray-400 font-medium">No restaurants found.</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
