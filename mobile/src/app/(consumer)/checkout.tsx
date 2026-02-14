import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '@/features/cart/store/useCartStore';
import { CartItem } from '@/features/cart/types';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { cartApi } from '@/features/cart/api/cartApi';
import { orderApi } from '@/features/order/api/orderApi';
import { Alert, ActivityIndicator } from 'react-native';

type PaymentMethodType = 'yape' | 'mastercard';

export default function CheckoutScreen() {
    const router = useRouter();
    const { items, getTotal, clearCart } = useCartStore();
    const [deliveryAddress] = useState('Miraflores, 15074 Lima, Peru');
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType>('yape');
    const [riderTip] = useState(5.0);

    const subtotal = getTotal();
    const deliveryFee = 0; // FREE as shown in mockup
    const serviceFee = 13.0;
    const total = subtotal + deliveryFee + serviceFee + riderTip;

    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth(); // Assuming useAuth is available

    // ... codes ...

    const handlePlaceOrder = async () => {
        if (!user || !items.length) return;

        setIsLoading(true);
        try {
            // 1. Sync Cart with Backend
            // We assume all items are from the same restaurant as enforced by store
            const restaurantId = useCartStore.getState().restaurantId;

            if (!restaurantId) {
                Alert.alert('Error', 'Invalid cart state');
                return;
            }

            console.log('Syncing cart for user:', user.id);
            await cartApi.syncCart(user.id, restaurantId, items);

            // 2. Create Order
            console.log('Creating order...');
            // Determine delivery address ID: use first saved address or a placeholder
            // Since we don't have address management yet, we use a random UUID if validated,
            // or we assume the backend ignores it (as seen in UseCase).
            // REAL IMPLEMENTATION: Fetch user addresses -> select one -> use ID.
            const dummyAddressId = '00000000-0000-0000-0000-000000000000'; // Placeholder

            const order = await orderApi.createOrder({
                customerId: user.id,
                restaurantId: restaurantId,
                deliveryAddressId: dummyAddressId,
                deliveryFee: deliveryFee
            });

            console.log('Order created:', order.id);

            // 3. Clear local cart
            clearCart();

            // 4. Navigate to success/tracking
            router.push({
                pathname: '/order/tracking',
                params: { id: order.id }
            } as any);

        } catch (error: any) {
            console.error('Checkout error:', error);
            Alert.alert('Error', 'Failed to place order. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle empty cart
    if (items.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
                <View className="flex-row items-center px-5 py-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="mr-4"
                    >
                        <Ionicons name="chevron-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text className="text-lg font-semibold text-gray-900">Checkout Summary</Text>
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
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            {/* Header */}
            <View className="flex-row items-center px-5 py-4 bg-gray-50">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mr-4"
                >
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-lg font-semibold text-gray-900">Checkout Summary</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Delivery Address - Compact */}
                <View className="mx-5 mt-4 mb-4 bg-white rounded-2xl p-4">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                            <View className="w-10 h-10 rounded-full bg-[#FF5722]/10 items-center justify-center mr-3">
                                <Ionicons name="location" size={20} color="#FF5722" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs text-gray-500 uppercase tracking-wide">Deliver to</Text>
                                <Text className="text-sm font-semibold text-gray-900 mt-0.5">{deliveryAddress}</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </View>
                </View>

                {/* Order Summary */}
                <View className="mx-5 mb-4 bg-white rounded-2xl p-5">
                    <Text className="text-base font-bold text-gray-900 mb-4">Order Summary</Text>
                    {items.map((item: CartItem) => (
                        <View
                            key={item.id}
                            className="flex-row items-center mb-4"
                        >
                            {item.image ? (
                                <Image
                                    source={{ uri: item.image }}
                                    className="w-14 h-14 rounded-full mr-3"
                                    resizeMode="cover"
                                />
                            ) : (
                                <View className="w-14 h-14 rounded-full bg-gray-200 items-center justify-center mr-3">
                                    <Ionicons name="fast-food-outline" size={24} color="#9CA3AF" />
                                </View>
                            )}
                            <View className="flex-1">
                                <Text className="text-sm font-bold text-gray-900">{item.name}</Text>
                                <Text className="text-xs text-gray-500 mt-1">
                                    {item.quantity}× • {item.customizations?.length ? item.customizations.join(', ') : 'Standard'}
                                </Text>
                            </View>
                            <Text className="text-sm font-bold text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Payment Method */}
                <View className="mx-5 mb-4 bg-white rounded-2xl p-5">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-base font-bold text-gray-900">Payment Method</Text>
                        <Text className="text-sm text-[#FF5722] font-semibold">Manage</Text>
                    </View>
                    <View className="flex-row gap-3">
                        {/* Yape Card */}
                        <TouchableOpacity
                            onPress={() => setSelectedPayment('yape')}
                            className={`flex-1 rounded-2xl p-4 ${selectedPayment === 'yape' ? 'bg-purple-600' : 'bg-gray-100'
                                }`}
                        >
                            <View className="flex-row items-center justify-between mb-2">
                                <View className={`w-8 h-8 rounded items-center justify-center ${selectedPayment === 'yape' ? 'bg-white/20' : 'bg-purple-100'
                                    }`}>
                                    <Ionicons
                                        name="wallet"
                                        size={18}
                                        color={selectedPayment === 'yape' ? '#FFF' : '#7C3AED'}
                                    />
                                </View>
                                {selectedPayment === 'yape' && (
                                    <View className="w-5 h-5 rounded-full bg-white items-center justify-center">
                                        <Ionicons name="checkmark" size={14} color="#7C3AED" />
                                    </View>
                                )}
                            </View>
                            <Text className={`text-sm font-bold ${selectedPayment === 'yape' ? 'text-white' : 'text-gray-900'
                                }`}>
                                Yape
                            </Text>
                            <Text className={`text-xs mt-0.5 ${selectedPayment === 'yape' ? 'text-white/80' : 'text-gray-500'
                                }`}>
                                Quick QR Pay
                            </Text>
                        </TouchableOpacity>

                        {/* Mastercard Card */}
                        <TouchableOpacity
                            onPress={() => setSelectedPayment('mastercard')}
                            className={`flex-1 rounded-2xl p-4 border-2 ${selectedPayment === 'mastercard'
                                ? 'bg-white border-[#FF5722]'
                                : 'bg-white border-gray-200'
                                }`}
                        >
                            <View className="flex-row items-center justify-between mb-2">
                                <View className="w-8 h-8 rounded items-center justify-center bg-gray-100">
                                    <Ionicons name="card" size={18} color="#1F2937" />
                                </View>
                                {selectedPayment === 'mastercard' && (
                                    <View className="w-5 h-5 rounded-full bg-[#FF5722] items-center justify-center">
                                        <Ionicons name="checkmark" size={14} color="#FFF" />
                                    </View>
                                )}
                            </View>
                            <Text className="text-sm font-bold text-gray-900">Mastercard</Text>
                            <Text className="text-xs text-gray-500 mt-0.5">•••• 8821</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Support the Rider */}
                <View className="mx-5 mb-4 bg-white rounded-2xl p-5">
                    <Text className="text-base font-bold text-gray-900 mb-1">Support the Rider</Text>
                    <Text className="text-xs text-gray-500 mb-4">
                        100% of the tip goes to your driver.
                    </Text>
                    {/* Tip options could be added here */}
                </View>

                {/* Place Order Button */}
                <View className="mx-5 mb-4">
                    <TouchableOpacity
                        onPress={handlePlaceOrder}
                        disabled={isLoading}
                        className={`h-14 rounded-full items-center justify-center shadow-lg shadow-orange-500/30 ${isLoading ? 'bg-orange-300' : 'bg-[#FF5722]'
                            }`}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-base">
                                Place Order                ${total.toFixed(2)}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Cost Breakdown */}
                <View className="mx-5 mb-8">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-sm text-gray-500">Delivery Fee</Text>
                        <Text className="text-sm font-semibold text-green-600">FREE</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-sm text-gray-500">Service Fee & Taxes</Text>
                        <Text className="text-sm font-semibold text-gray-900">${serviceFee.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-sm text-gray-500">Rider Tip</Text>
                        <Text className="text-sm font-semibold text-gray-900">${riderTip.toFixed(2)}</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
