import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, ScrollView } from 'react-native';
import { MenuItem } from '@/features/restaurant/types';
import { Ionicons } from '@expo/vector-icons';

interface ProductCustomizationModalProps {
    visible: boolean;
    onClose: () => void;
    item: MenuItem | null;
    onAddToCart: (quantity: number) => void;
}

export const ProductCustomizationModal: React.FC<ProductCustomizationModalProps> = ({
    visible,
    onClose,
    item,
    onAddToCart,
}) => {
    const [quantity, setQuantity] = useState(1);

    if (!item) return null;

    const handleIncrease = () => setQuantity(prev => prev + 1);
    const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white rounded-t-[40px] h-[90%] overflow-hidden">
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Hero Image */}
                        <View className="relative h-72">
                            {item.image ? (
                                <Image
                                    source={{ uri: item.image }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            ) : (
                                <View className="w-full h-full bg-gray-100 items-center justify-center">
                                    <Ionicons name="fast-food-outline" size={80} color="#D1D5DB" />
                                </View>
                            )}

                            {/* Close Button */}
                            <TouchableOpacity
                                onPress={onClose}
                                className="absolute top-6 right-6 w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-lg"
                            >
                                <Ionicons name="close" size={24} color="black" />
                            </TouchableOpacity>
                        </View>

                        <View className="px-6 py-6">
                            {/* Title & Price */}
                            <View className="flex-row justify-between items-start mb-4">
                                <View className="flex-1 mr-4">
                                    <Text className="text-3xl font-black text-gray-900 mb-1">{item.name}</Text>
                                    <Text className="text-gray-500 text-base leading-5">
                                        {item.description}
                                    </Text>
                                </View>
                                <Text className="text-2xl font-black text-[#FF5722]">
                                    S/ {item.price.toFixed(2)}
                                </Text>
                            </View>

                            {/* Options Placeholder */}
                            <View className="mt-6">
                                <Text className="text-lg font-bold text-gray-900 mb-4">Choice of options</Text>

                                {/* Mock Customization */}
                                <View className="space-y-4">
                                    {['Extra Cheese', 'No Onions', 'Gluten Free'].map((opt, i) => (
                                        <TouchableOpacity
                                            key={opt}
                                            className="flex-row items-center justify-between py-4 border-b border-gray-50"
                                        >
                                            <Text className="text-base text-gray-700">{opt}</Text>
                                            <View className={`w-6 h-6 rounded-full border-2 ${i === 0 ? 'bg-[#FF5722] border-[#FF5722]' : 'border-gray-200'} items-center justify-center`}>
                                                {i === 0 && <Ionicons name="checkmark" size={16} color="white" />}
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Spacing for checkout button */}
                            <View className="h-40" />
                        </View>
                    </ScrollView>

                    {/* Footer Actions */}
                    <View className="absolute bottom-0 left-0 right-0 bg-white px-6 pt-6 pb-12 border-t border-gray-100 flex-row items-center space-x-4">
                        {/* Quantity Selector */}
                        <View className="flex-row items-center bg-gray-50 rounded-full p-2 h-14 w-32 border border-gray-100">
                            <TouchableOpacity
                                onPress={handleDecrease}
                                className="w-10 h-10 items-center justify-center bg-white rounded-full shadow-sm"
                            >
                                <Ionicons name="remove" size={20} color="black" />
                            </TouchableOpacity>
                            <Text className="flex-1 text-center font-bold text-lg">{quantity}</Text>
                            <TouchableOpacity
                                onPress={handleIncrease}
                                className="w-10 h-10 items-center justify-center bg-white rounded-full shadow-sm"
                            >
                                <Ionicons name="add" size={20} color="black" />
                            </TouchableOpacity>
                        </View>

                        {/* Add to Cart Button */}
                        <TouchableOpacity
                            onPress={() => onAddToCart(quantity)}
                            className="flex-1 bg-[#FF5722] h-14 rounded-full items-center justify-center shadow-lg shadow-orange-500/30"
                        >
                            <Text className="text-white font-black text-lg">Add to Cart</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
