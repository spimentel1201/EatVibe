import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Animated,
    Alert,
} from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRestaurantDetail } from '@/features/restaurant/hooks/useRestaurantDetail';
import { MenuItemCard } from '@/components/business';
import { LoadingSpinner } from '@/components/ui';
import { MenuItem } from '@/features/restaurant/types';

export default function RestaurantDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const scrollY = new Animated.Value(0);

    const { restaurant, menu, isLoading, error } = useRestaurantDetail(id);

    const handleAddToCart = (item: MenuItem) => {
        Alert.alert(
            'Agregar al carrito',
            `¿Deseas agregar "${item.name}" al carrito?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Agregar',
                    onPress: () => {
                        // TODO: Implement cart functionality
                        Alert.alert('Éxito', 'Producto agregado al carrito');
                    },
                },
            ]
        );
    };

    if (isLoading) {
        return <LoadingSpinner fullScreen message="Cargando menú..." />;
    }

    if (error || !restaurant) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 justify-center items-center px-6">
                    <Text className="text-4xl mb-4">😕</Text>
                    <Text className="text-lg font-bold text-text-primary mb-2 text-center">
                        Restaurante no encontrado
                    </Text>
                    <TouchableOpacity
                        className="mt-4 bg-primary px-6 py-3 rounded-xl"
                        onPress={() => router.back()}
                    >
                        <Text className="text-white font-semibold">Volver</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // Animated header opacity
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    return (
        <View className="flex-1 bg-white">
            {/* Animated Header */}
            <Animated.View
                className="absolute top-0 left-0 right-0 z-10 bg-white border-b border-gray-200"
                style={{ opacity: headerOpacity }}
            >
                <SafeAreaView edges={['top']}>
                    <View className="flex-row items-center px-4 py-3">
                        <TouchableOpacity
                            className="w-10 h-10 rounded-full bg-white items-center justify-center mr-3"
                            onPress={() => router.back()}
                        >
                            <Text className="text-xl">←</Text>
                        </TouchableOpacity>
                        <Text className="text-lg font-bold text-text-primary flex-1" numberOfLines={1}>
                            {restaurant.name}
                        </Text>
                    </View>
                </SafeAreaView>
            </Animated.View>

            <Animated.ScrollView
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
                    useNativeDriver: true,
                })}
                scrollEventThrottle={16}
            >
                {/* Hero Image */}
                <View className="relative">
                    <Image
                        source={{ uri: restaurant.image }}
                        className="w-full h-64"
                        resizeMode="cover"
                    />

                    {/* Back Button */}
                    <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0">
                        <TouchableOpacity
                            className="w-10 h-10 rounded-full bg-white/90 items-center justify-center m-4"
                            onPress={() => router.back()}
                        >
                            <Text className="text-xl">←</Text>
                        </TouchableOpacity>
                    </SafeAreaView>

                    {/* Status Badge */}
                    {!restaurant.isOpen && (
                        <View className="absolute bottom-4 right-4 bg-error px-4 py-2 rounded-full">
                            <Text className="text-sm font-bold text-white">Cerrado</Text>
                        </View>
                    )}
                </View>

                {/* Restaurant Info */}
                <View className="px-6 py-5 bg-white">
                    <Text className="text-2xl font-bold text-text-primary mb-2">{restaurant.name}</Text>

                    <View className="flex-row items-center mb-3">
                        <Text className="text-base">⭐</Text>
                        <Text className="text-base font-semibold text-text-primary ml-1">
                            {restaurant.rating}
                        </Text>
                        <Text className="text-sm text-text-secondary ml-1">
                            ({restaurant.reviewCount} reseñas)
                        </Text>
                    </View>

                    <Text className="text-base text-text-secondary mb-4">{restaurant.description}</Text>

                    {/* Delivery Info */}
                    <View className="flex-row items-center flex-wrap">
                        <View className="flex-row items-center mr-4 mb-2">
                            <Text className="text-sm text-text-secondary">🕐 {restaurant.deliveryTime}</Text>
                        </View>
                        <View className="flex-row items-center mr-4 mb-2">
                            <Text className="text-sm text-text-secondary">
                                📍 {restaurant.distance?.toFixed(1)} km
                            </Text>
                        </View>
                        <View className="flex-row items-center mb-2">
                            {restaurant.deliveryFee === 0 ? (
                                <Text className="text-sm font-semibold text-success">Envío gratis</Text>
                            ) : (
                                <Text className="text-sm text-text-secondary">
                                    S/ {restaurant.deliveryFee.toFixed(2)} envío
                                </Text>
                            )}
                        </View>
                    </View>

                    {restaurant.minimumOrder > 0 && (
                        <View className="mt-3 bg-info/10 px-3 py-2 rounded-lg">
                            <Text className="text-sm text-info">
                                Pedido mínimo: S/ {restaurant.minimumOrder.toFixed(2)}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Menu Section */}
                <View className="px-6 py-4 bg-background-secondary">
                    <Text className="text-xl font-bold text-text-primary mb-4">Menú</Text>

                    {menu && menu.length > 0 ? (
                        menu.map((item: MenuItem) => (
                            <MenuItemCard
                                key={item.id}
                                item={item}
                                onAddToCart={() => handleAddToCart(item)}
                            />
                        ))

                    ) : (
                        <View className="py-12 items-center">
                            <Text className="text-4xl mb-4">🍽️</Text>
                            <Text className="text-lg font-bold text-text-primary mb-2 text-center">
                                Menú no disponible
                            </Text>
                            <Text className="text-base text-text-secondary text-center">
                                Este restaurante aún no tiene menú disponible
                            </Text>
                        </View>
                    )}
                </View>

                {/* Bottom Spacing */}
                <View className="h-24" />
            </Animated.ScrollView>
        </View>
    );
}
