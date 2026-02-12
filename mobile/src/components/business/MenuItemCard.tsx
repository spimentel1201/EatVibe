import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MenuItem } from '@/features/restaurant/types';
import { Ionicons } from '@expo/vector-icons';

interface MenuItemCardProps {
    item: MenuItem;
    onAddToCart: () => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onAddToCart}
            className="bg-white rounded-[24px] mb-4 overflow-hidden border border-gray-100/50 shadow-sm shadow-gray-200/40 flex-row p-3"
        >
            {/* Item Info */}
            <View className="flex-1 pr-3 justify-center">
                <Text className="text-base font-bold text-gray-900 mb-1">{item.name}</Text>
                <Text className="text-xs text-gray-500 mb-3 leading-4" numberOfLines={2}>
                    {item.description}
                </Text>

                <View className="flex-row items-center">
                    <Text className="text-lg font-black text-[#FF5722]">S/ {item.price.toFixed(2)}</Text>

                    {!item.isAvailable && (
                        <View className="bg-red-50 px-2 py-1 rounded-full ml-3">
                            <Text className="text-[10px] font-bold text-red-500">Sold Out</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Item Image */}
            <View className="relative">
                {item.image ? (
                    <Image
                        source={{ uri: item.image }}
                        className="w-24 h-24 rounded-[20px]"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="w-24 h-24 rounded-[20px] bg-gray-50 items-center justify-center">
                        <Ionicons name="fast-food-outline" size={32} color="#D1D5DB" />
                    </View>
                )}

                {item.isAvailable && (
                    <View
                        className="absolute -bottom-1 -right-1 bg-[#FF5722] w-8 h-8 rounded-full items-center justify-center border-2 border-white shadow-md shadow-orange-500/50"
                    >
                        <Ionicons name="add" size={20} color="white" />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};
