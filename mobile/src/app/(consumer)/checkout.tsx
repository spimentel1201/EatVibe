import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '@/features/cart/store/useCartStore';

export default function CheckoutScreen() {
    const router = useRouter();
    const { items, getTotal, clearCart } = useCartStore();
    const [deliveryAddress] = useState('123 Main St, Lima, Peru');
    const [paymentMethod] = useState('Visa •••• 4242');

    const subtotal = getTotal();
    const deliveryFee = 5.0;
    const serviceFee = 2.5;
    const total = subtotal + deliveryFee + serviceFee;

    const handlePlaceOrder = () => {
        // TODO: Implement order placement logic with backend
        console.log('Placing order...');

        // Clear cart after successful order
        clearCart();

        // Navigate to order tracking
        router.push('/order/tracking?id=ORD-001' as any);
    };

    // Handle empty cart
    if (items.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-white" edges={['top']}>
                <View className="flex-row items-center px-6 py-4 border-b border-gray-100">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-4"
                    >
                        <Ionicons name="arrow-back" size={20} color="#1F2937" />
                    </TouchableOpacity>
                    <Text className="text-2xl font-black text-gray-900">Checkout</Text>
                </View>
                <View className="flex-1 items-center justify-center px-6">
                    <Ionicons name="cart-outline" size={80} color="#D1D5DB" />
                    <Text className="text-xl font-bold text-gray-900 mt-6">Your cart is empty</Text>
                    <Text className="text-gray-400 text-center mt-2">
                        Add some items to your cart before checking out
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="bg-[#FF5722] px-8 py-3 rounded-full mt-8"
                    >
                        <Text className="text-white font-bold">Browse Menu</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            {/* Header */}
            <View className="flex-row items-center px-6 py-4 border-b border-gray-100">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-4"
                >
                    <Ionicons name="arrow-back" size={20} color="#1F2937" />
                </TouchableOpacity>
                <Text className="text-2xl font-black text-gray-900">Checkout</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Order Items */}
                <View className="px-6 py-6">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Your Order</Text>
                    {items.map((item) => (
                        <View
                            key={item.id}
                            className="flex-row items-center bg-gray-50 rounded-[24px] p-4 mb-3"
                        >
                            {item.image ? (
                                <Image
                                    source={{ uri: item.image }}
                                    className="w-16 h-16 rounded-2xl mr-4"
                                    resizeMode="cover"
                                />
                            ) : (
                                <View className="w-16 h-16 rounded-2xl bg-gray-200 items-center justify-center mr-4">
                                    <Ionicons name="fast-food-outline" size={24} color="#9CA3AF" />
                                </View>
                            )}
                            <View className="flex-1">
                                <Text className="text-base font-bold text-gray-900">{item.name}</Text>
                                <Text className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</Text>
                            </View>
                            <Text className="text-base font-black text-[#FF5722]">
                                S/ {(item.price * item.quantity).toFixed(2)}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Delivery Address */}
                <View className="px-6 py-4 border-t border-gray-100">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-lg font-bold text-gray-900">Delivery Address</Text>
                        <TouchableOpacity>
                            <Text className="text-[#FF5722] font-bold">Change</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-row items-start bg-gray-50 rounded-[24px] p-4">
                        <View className="w-10 h-10 rounded-full bg-[#FF5722]/10 items-center justify-center mr-3">
                            <Ionicons name="location" size={20} color="#FF5722" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm font-bold text-gray-900">Home</Text>
                            <Text className="text-sm text-gray-600 mt-1">{deliveryAddress}</Text>
                        </View>
                    </View>
                </View>

                {/* Payment Method */}
                <View className="px-6 py-4 border-t border-gray-100">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-lg font-bold text-gray-900">Payment Method</Text>
                        <TouchableOpacity>
                            <Text className="text-[#FF5722] font-bold">Change</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-row items-center bg-gray-50 rounded-[24px] p-4">
                        <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                            <Ionicons name="card" size={20} color="#3B82F6" />
                        </View>
                        <Text className="flex-1 text-sm font-bold text-gray-900">{paymentMethod}</Text>
                        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                    </View>
                </View>

                {/* Order Summary */}
                <View className="px-6 py-6 border-t border-gray-100">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Order Summary</Text>
                    <View className="space-y-3">
                        <View className="flex-row justify-between">
                            <Text className="text-base text-gray-600">Subtotal</Text>
                            <Text className="text-base font-bold text-gray-900">S/ {subtotal.toFixed(2)}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-base text-gray-600">Delivery Fee</Text>
                            <Text className="text-base font-bold text-gray-900">S/ {deliveryFee.toFixed(2)}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-base text-gray-600">Service Fee</Text>
                            <Text className="text-base font-bold text-gray-900">S/ {serviceFee.toFixed(2)}</Text>
                        </View>
                        <View className="h-px bg-gray-200 my-2" />
                        <View className="flex-row justify-between">
                            <Text className="text-xl font-black text-gray-900">Total</Text>
                            <Text className="text-xl font-black text-[#FF5722]">S/ {total.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* Spacing for button */}
                <View className="h-32" />
            </ScrollView>

            {/* Place Order Button */}
            <View className="absolute bottom-0 left-0 right-0 bg-white px-6 pt-4 pb-8 border-t border-gray-100">
                <TouchableOpacity
                    onPress={handlePlaceOrder}
                    className="bg-[#FF5722] h-14 rounded-full items-center justify-center shadow-lg shadow-orange-500/30"
                >
                    <Text className="text-white font-black text-lg">
                        Place Order • S/ {total.toFixed(2)}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
