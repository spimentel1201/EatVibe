import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    ScrollView,
    TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocation } from '@/core/location/useLocation';
import { useRestaurants } from '@/features/restaurant/hooks/useRestaurants';
import { useCategories } from '@/features/restaurant/hooks/useCategories';
import { RestaurantCard, CategoryChip } from '@/components/business';
import { LoadingSpinner } from '@/components/ui';
import { Restaurant } from '@/features/restaurant/types';

export default function HomeScreen() {
    const router = useRouter();
    const { location, loading: locationLoading, error: locationError } = useLocation();
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch categories
    const { data: categories } = useCategories();

    // Fetch restaurants
    const {
        data: restaurants,
        isLoading: restaurantsLoading,
        error: restaurantsError,
        refetch,
    } = useRestaurants({
        latitude: location?.latitude || 0,
        longitude: location?.longitude || 0,
        filters: {
            categoryId: selectedCategoryId,
            isOpen: true,
            sortBy: 'distance',
        },
    });

    const handleRestaurantPress = (restaurant: Restaurant) => {
        router.push(`/(consumer)/restaurant/${restaurant.id}`);
    };

    const handleCategoryPress = (categoryId: string) => {
        setSelectedCategoryId(prev => (prev === categoryId ? undefined : categoryId));
    };

    const handleRefresh = () => {
        refetch();
    };

    // Filter restaurants by search query
    const filteredRestaurants = restaurants?.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (locationLoading) {
        return <LoadingSpinner fullScreen message="Obteniendo tu ubicación..." />;
    }

    if (locationError) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 justify-center items-center px-6">
                    <Text className="text-6xl mb-4">📍</Text>
                    <Text className="text-xl font-bold text-text-primary mb-2 text-center">
                        Necesitamos tu ubicación
                    </Text>
                    <Text className="text-base text-text-secondary text-center">
                        Para mostrarte restaurantes cercanos, necesitamos acceso a tu ubicación
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background-secondary">
            <View className="flex-1">
                {/* Header */}
                <View className="bg-white px-6 pt-4 pb-3">
                    {/* Location Selector */}
                    <TouchableOpacity className="flex-row items-center mb-4">
                        <Text className="text-sm text-text-secondary mr-1">Entregar en</Text>
                        <Text className="text-base font-bold text-text-primary flex-1" numberOfLines={1}>
                            📍 Mi ubicación actual
                        </Text>
                        <Text className="text-primary">▼</Text>
                    </TouchableOpacity>

                    {/* Search Bar */}
                    <View className="flex-row items-center bg-background-secondary rounded-xl px-4 py-3 mb-3">
                        <Text className="text-xl mr-2">🔍</Text>
                        <TextInput
                            className="flex-1 text-base text-text-primary"
                            placeholder="Busca restaurantes o platillos..."
                            placeholderTextColor="#BDBDBD"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Categories */}
                {categories && categories.length > 0 && (
                    <View className="bg-white py-3 mb-2">
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 24 }}
                        >
                            {categories.map(category => (
                                <CategoryChip
                                    key={category.id}
                                    category={category}
                                    isActive={selectedCategoryId === category.id}
                                    onPress={() => handleCategoryPress(category.id)}
                                />
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Restaurants List */}
                {restaurantsLoading ? (
                    <LoadingSpinner message="Cargando restaurantes..." />
                ) : restaurantsError ? (
                    <View className="flex-1 justify-center items-center px-6">
                        <Text className="text-4xl mb-4">😕</Text>
                        <Text className="text-lg font-bold text-text-primary mb-2 text-center">
                            Error al cargar restaurantes
                        </Text>
                        <Text className="text-base text-text-secondary text-center">
                            Por favor, intenta nuevamente
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredRestaurants}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <RestaurantCard restaurant={item} onPress={() => handleRestaurantPress(item)} />
                        )}
                        contentContainerStyle={{ padding: 16 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={restaurantsLoading}
                                onRefresh={handleRefresh}
                                tintColor="#FF5722"
                                colors={['#FF5722']}
                            />
                        }
                        ListEmptyComponent={
                            <View className="flex-1 justify-center items-center py-12">
                                <Text className="text-4xl mb-4">🍽️</Text>
                                <Text className="text-lg font-bold text-text-primary mb-2 text-center">
                                    No hay restaurantes disponibles
                                </Text>
                                <Text className="text-base text-text-secondary text-center">
                                    Intenta cambiar los filtros o buscar en otra ubicación
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
