import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MenuItem } from '@/features/restaurant/types';
import { Card } from '../ui/Card';

interface MenuItemCardProps {
    item: MenuItem;
    onAddToCart: () => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
    return (
        <Card className="mb-4 overflow-hidden">
            <View className="flex-row">
                {/* Item Info */}
                <View className="flex-1 p-4">
                    <Text className="text-base font-bold text-text-primary mb-1">{item.name}</Text>
                    <Text className="text-sm text-text-secondary mb-3" numberOfLines={2}>
                        {item.description}
                    </Text>

                    <View className="flex-row items-center justify-between">
                        <Text className="text-lg font-bold text-primary">S/ {item.price.toFixed(2)}</Text>

                        {!item.isAvailable && (
                            <View className="bg-error px-2 py-1 rounded">
                                <Text className="text-xs font-semibold text-white">Agotado</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Item Image and Add Button */}
                <View className="relative">
                    {item.image && (
                        <Image
                            source={{ uri: item.image }}
                            className="w-32 h-32"
                            resizeMode="cover"
                        />
                    )}

                    {item.isAvailable && (
                        <TouchableOpacity
                            className="absolute bottom-2 right-2 bg-primary w-10 h-10 rounded-full items-center justify-center shadow-lg"
                            onPress={onAddToCart}
                            activeOpacity={0.8}
                        >
                            <Text className="text-white text-xl font-bold">+</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Card>
    );
};
