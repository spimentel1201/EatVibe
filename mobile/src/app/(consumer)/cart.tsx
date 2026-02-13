import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '@/features/cart/store/useCartStore';
import { CartItem } from '@/features/cart/types';

export default function CartScreen() {
    const router = useRouter();
    const { items, removeItem, updateQuantity, getTotal } = useCartStore();
    const total = getTotal();

    const handleCheckout = () => {
        router.push('/(consumer)/checkout' as any);
    };

    if (items.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center p-6">
                <View className="w-40 h-40 bg-orange-50 rounded-full items-center justify-center mb-6">
                    <Ionicons name="cart-outline" size={80} color="#FF5722" />
                </View>
                <Text className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</Text>
                <Text className="text-gray-500 text-center mb-8 px-8">
                    Looks like you haven't added anything to your cart yet.
                </Text>
                <TouchableOpacity
                    onPress={() => router.push('/(consumer)/explore')}
                    className="bg-[#FF5722] py-4 px-8 rounded-full shadow-lg shadow-orange-500/30"
                >
                    <Text className="text-white font-bold text-lg">Start Exploring</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <View className="px-6 py-4 flex-row items-center border-b border-gray-100">
                <Text className="text-2xl font-black text-gray-900">My Cart</Text>
                <View className="bg-orange-100 px-3 py-1 rounded-full ml-3">
                    <Text className="text-[#FF5722] font-bold text-sm">{items.length} Items</Text>
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
                {items.map((item: CartItem) => (
                    <View
                        key={item.id}
                        className="flex-row bg-white mb-4 p-3 rounded-2xl border border-gray-100 shadow-sm shadow-gray-200/50"
                    >
                        {/* Image */}
                        <View className="w-20 h-20 bg-gray-100 rounded-xl mr-4 overflow-hidden">
                            {item.image ? (
                                <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
                            ) : (
                                <View className="w-full h-full items-center justify-center">
                                    <Ionicons name="fast-food-outline" size={24} color="#D1D5DB" />
                                </View>
                            )}
                        </View>

                        {/* Details */}
                        <View className="flex-1 justify-between py-1">
                            <View>
                                <Text className="font-bold text-gray-900 text-base mb-1" numberOfLines={1}>
                                    {item.name}
                                </Text>
                                <Text className="text-[#FF5722] font-bold">
                                    S/ {(item.price * item.quantity).toFixed(2)}
                                </Text>
                            </View>

                            <View className="flex-row items-center justify-between mt-2">
                                <View className="flex-row items-center bg-gray-50 rounded-full px-2 py-1 border border-gray-100">
                                    <TouchableOpacity
                                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="w-7 h-7 bg-white rounded-full items-center justify-center shadow-sm"
                                    >
                                        <Ionicons name="remove" size={16} color="black" />
                                    </TouchableOpacity>
                                    <Text className="mx-3 font-bold text-base">{item.quantity}</Text>
                                    <TouchableOpacity
                                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-7 h-7 bg-white rounded-full items-center justify-center shadow-sm"
                                    >
                                        <Ionicons name="add" size={16} color="black" />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={() => removeItem(item.id)} className="p-2">
                                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}

                {/* Spacing for checkout button */}
                <View className="h-32" />
            </ScrollView>

            {/* Checkout Section */}
            <View className="absolute bottom-0 left-0 right-0 bg-white p-6 border-t border-gray-100 shadow-lg shadow-black/10 pb-24">
                <View className="flex-row justify-between mb-4">
                    <Text className="text-gray-500 font-medium">Subtotal</Text>
                    <Text className="text-gray-900 font-bold">S/ {total.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between mb-6">
                    <Text className="text-gray-500 font-medium">Delivery Fee</Text>
                    <Text className="text-gray-900 font-bold">S/ 5.00</Text>
                </View>
                <View className="flex-row justify-between mb-6 pt-4 border-t border-dashed border-gray-200">
                    <Text className="text-xl font-black text-gray-900">Total</Text>
                    <Text className="text-xl font-black text-[#FF5722]">S/ {(total + 5).toFixed(2)}</Text>
                </View>

                <TouchableOpacity
                    onPress={handleCheckout}
                    className="bg-[#FF5722] py-4 rounded-full items-center justify-center shadow-lg shadow-orange-500/30"
                >
                    <Text className="text-white font-black text-lg">Proceed to Checkout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}