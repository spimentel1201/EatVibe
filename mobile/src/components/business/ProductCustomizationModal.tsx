import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { MenuItem, MenuModifier } from '@/features/restaurant/types';
import { Ionicons } from '@expo/vector-icons';

interface ProductCustomizationModalProps {
    visible: boolean;
    onClose: () => void;
    item: MenuItem | null;
    onAddToCart: (quantity: number, selectedModifiers: SelectedModifiers) => void;
}

interface SelectedModifiers {
    [modifierId: string]: string[];
}

export const ProductCustomizationModal: React.FC<ProductCustomizationModalProps> = ({
    visible,
    onClose,
    item,
    onAddToCart,
}) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifiers>({});

    // Reset state when modal opens with new item
    useEffect(() => {
        if (visible && item) {
            setQuantity(1);
            setSelectedModifiers({});
        }
    }, [visible, item]);

    if (!item) return null;

    const handleIncrease = () => setQuantity((prev) => prev + 1);
    const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    const handleModifierToggle = (modifier: MenuModifier, optionId: string) => {
        setSelectedModifiers((prev) => {
            const currentSelections = prev[modifier.id] || [];
            const isSelected = currentSelections.includes(optionId);

            if (isSelected) {
                // Deselect
                return {
                    ...prev,
                    [modifier.id]: currentSelections.filter((id) => id !== optionId),
                };
            } else {
                // Select
                if (modifier.maxSelection === 1) {
                    // Radio button behavior (single selection)
                    return {
                        ...prev,
                        [modifier.id]: [optionId],
                    };
                } else {
                    // Checkbox behavior (multiple selection)
                    if (currentSelections.length < modifier.maxSelection) {
                        return {
                            ...prev,
                            [modifier.id]: [...currentSelections, optionId],
                        };
                    }
                    return prev; // Max selections reached
                }
            }
        });
    };

    const isModifierOptionSelected = (modifierId: string, optionId: string): boolean => {
        return selectedModifiers[modifierId]?.includes(optionId) || false;
    };

    const validateSelections = (): boolean => {
        if (!item.modifiers) return true;

        for (const modifier of item.modifiers) {
            const selections = selectedModifiers[modifier.id] || [];

            if (modifier.required && selections.length < modifier.minSelection) {
                Alert.alert(
                    'Selección requerida',
                    `Por favor selecciona al menos ${modifier.minSelection} opción(es) para "${modifier.name}"`
                );
                return false;
            }
        }
        return true;
    };

    const calculateTotalPrice = (): number => {
        let total = item.price * quantity;

        if (item.modifiers) {
            item.modifiers.forEach((modifier) => {
                const selections = selectedModifiers[modifier.id] || [];
                selections.forEach((optionId) => {
                    const option = modifier.options.find((opt) => opt.id === optionId);
                    if (option) {
                        total += option.price * quantity;
                    }
                });
            });
        }

        return total;
    };

    const handleAddToCart = () => {
        if (!validateSelections()) {
            return;
        }
        onAddToCart(quantity, selectedModifiers);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View className="flex-1 bg-black/50 justify-end">
                <Animated.View
                    entering={SlideInDown.duration(300)}
                    className="bg-white rounded-t-[40px] h-[90%] overflow-hidden"
                >
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Hero Image */}
                        <View className="relative h-72">
                            {item.image ? (
                                <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
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

                            {/* Availability Badge */}
                            {!item.isAvailable && (
                                <View className="absolute bottom-4 left-4 bg-red-500 px-4 py-2 rounded-full">
                                    <Text className="text-white font-bold text-sm">No disponible</Text>
                                </View>
                            )}
                        </View>

                        <View className="px-6 py-6">
                            {/* Title & Price */}
                            <View className="flex-row justify-between items-start mb-4">
                                <View className="flex-1 mr-4">
                                    <Text className="text-3xl font-black text-gray-900 mb-1">{item.name}</Text>
                                    <Text className="text-gray-500 text-base leading-5">{item.description}</Text>
                                    {item.preparationTime && (
                                        <View className="flex-row items-center mt-2">
                                            <Ionicons name="time-outline" size={16} color="#FF5722" />
                                            <Text className="text-sm text-gray-600 ml-1">
                                                ~{item.preparationTime} min
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <Text className="text-2xl font-black text-[#FF5722]">
                                    S/ {item.price.toFixed(2)}
                                </Text>
                            </View>

                            {/* Modifiers */}
                            {item.modifiers && item.modifiers.length > 0 && (
                                <View className="mt-6">
                                    {item.modifiers.map((modifier) => (
                                        <View key={modifier.id} className="mb-6">
                                            <View className="flex-row items-center justify-between mb-3">
                                                <Text className="text-lg font-bold text-gray-900">{modifier.name}</Text>
                                                <View className="flex-row items-center">
                                                    {modifier.required && (
                                                        <View className="bg-red-100 px-2 py-1 rounded-md mr-2">
                                                            <Text className="text-red-600 text-xs font-bold">Requerido</Text>
                                                        </View>
                                                    )}
                                                    <Text className="text-sm text-gray-500">
                                                        {modifier.maxSelection === 1
                                                            ? 'Elige 1'
                                                            : `Elige hasta ${modifier.maxSelection}`}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View className="space-y-2">
                                                {modifier.options.map((option) => {
                                                    const isSelected = isModifierOptionSelected(modifier.id, option.id);
                                                    const isSingleChoice = modifier.maxSelection === 1;

                                                    return (
                                                        <TouchableOpacity
                                                            key={option.id}
                                                            onPress={() => handleModifierToggle(modifier, option.id)}
                                                            className={`flex-row items-center justify-between py-4 px-4 rounded-2xl border-2 ${isSelected
                                                                ? 'bg-orange-50 border-[#FF5722]'
                                                                : 'bg-gray-50 border-transparent'
                                                                }`}
                                                        >
                                                            <View className="flex-row items-center flex-1">
                                                                <View
                                                                    className={`w-6 h-6 ${isSingleChoice ? 'rounded-full' : 'rounded-md'
                                                                        } border-2 ${isSelected
                                                                            ? 'bg-[#FF5722] border-[#FF5722]'
                                                                            : 'border-gray-300'
                                                                        } items-center justify-center mr-3`}
                                                                >
                                                                    {isSelected && (
                                                                        <Ionicons
                                                                            name={isSingleChoice ? 'ellipse' : 'checkmark'}
                                                                            size={isSingleChoice ? 12 : 16}
                                                                            color="white"
                                                                        />
                                                                    )}
                                                                </View>
                                                                <Text
                                                                    className={`text-base ${isSelected ? 'text-gray-900 font-semibold' : 'text-gray-700'
                                                                        }`}
                                                                >
                                                                    {option.name}
                                                                </Text>
                                                            </View>
                                                            {option.price > 0 && (
                                                                <Text
                                                                    className={`text-sm font-bold ${isSelected ? 'text-[#FF5722]' : 'text-gray-600'
                                                                        }`}
                                                                >
                                                                    +S/ {option.price.toFixed(2)}
                                                                </Text>
                                                            )}
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* Spacing for checkout button */}
                            <View className="h-40" />
                        </View>
                    </ScrollView>

                    {/* Footer Actions */}
                    <View className="absolute bottom-0 left-0 right-0 bg-white px-6 pt-6 pb-12 border-t border-gray-100">
                        <View className="flex-row items-center space-x-4">
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
                                onPress={handleAddToCart}
                                disabled={!item.isAvailable}
                                className={`flex-1 h-14 rounded-full items-center justify-center shadow-lg ${item.isAvailable
                                    ? 'bg-[#FF5722] shadow-orange-500/30'
                                    : 'bg-gray-300 shadow-gray-300/30'
                                    }`}
                            >
                                <Text className="text-white font-black text-base">
                                    Agregar S/ {calculateTotalPrice().toFixed(2)}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};
