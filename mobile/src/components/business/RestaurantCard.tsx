import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Restaurant } from '@/features/restaurant/types';
import { Card } from '../ui/Card';

interface RestaurantCardProps {
    restaurant: Restaurant;
    onPress: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <Card className="mb-4 overflow-hidden">
                {/* Restaurant Image */}
                <Image
                    source={{ uri: restaurant.image }}
                    className="w-full h-48"
                    resizeMode="cover"
                />

                {/* Restaurant Info */}
                <View className="p-4">
                    {/* Name and Rating */}
                    <View className="flex-row justify-between items-start mb-2">
                        <Text className="text-lg font-bold text-text-primary flex-1" numberOfLines={1}>
                            {restaurant.name}
                        </Text>
                        <View className="flex-row items-center ml-2">
                            <Text className="text-base">⭐</Text>
                            <Text className="text-sm font-semibold text-text-primary ml-1">
                                {restaurant.rating}
                            </Text>
                            <Text className="text-xs text-text-secondary ml-1">
                                ({restaurant.reviewCount})
                            </Text>
                        </View>
                    </View>

                    {/* Description */}
                    <Text className="text-sm text-text-secondary mb-3" numberOfLines={2}>
                        {restaurant.description}
                    </Text>

                    {/* Delivery Info */}
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <Text className="text-xs text-text-secondary">🕐 {restaurant.deliveryTime}</Text>
                            <Text className="text-xs text-text-secondary mx-2">•</Text>
                            <Text className="text-xs text-text-secondary">
                                📍 {restaurant.distance?.toFixed(1)} km
                            </Text>
                        </View>

                        <View className="flex-row items-center">
                            {restaurant.deliveryFee === 0 ? (
                                <Text className="text-xs font-semibold text-success">Envío gratis</Text>
                            ) : (
                                <Text className="text-xs text-text-secondary">
                                    S/ {restaurant.deliveryFee.toFixed(2)} envío
                                </Text>
                            )}
                        </View>
                    </View>

                    {/* Status Badge */}
                    {!restaurant.isOpen && (
                        <View className="absolute top-4 right-4 bg-error px-3 py-1 rounded-full">
                            <Text className="text-xs font-semibold text-white">Cerrado</Text>
                        </View>
                    )}
                </View>
            </Card>
        </TouchableOpacity>
    );
};
