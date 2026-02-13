import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

import { useCartStore } from '@/features/cart/store/useCartStore';

function TabBar() {
    const router = useRouter();
    const pathname = usePathname();
    const itemCount = useCartStore((state: any) => state.getItemCount());

    const tabs = [
        { name: 'home', label: 'Home', icon: 'home', iconOutline: 'home-outline', path: '/(consumer)/home' },
        { name: 'explore', label: 'Explore', icon: 'compass', iconOutline: 'compass-outline', path: '/(consumer)/explore' },
        { name: 'cart', label: 'Cart', icon: 'cart', iconOutline: 'cart-outline', path: '/(consumer)/cart', badge: itemCount },
        { name: 'orders', label: 'Orders', icon: 'receipt', iconOutline: 'receipt-outline', path: '/(consumer)/orders' },
        { name: 'profile', label: 'Profile', icon: 'person', iconOutline: 'person-outline', path: '/(consumer)/profile' },
    ];

    // Don't show tab bar on certain screens
    const hideTabBar = pathname.includes('restaurant-detail') || pathname.includes('checkout') || pathname.includes('order/');

    if (hideTabBar) return null;

    return (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t-0 rounded-t-[28px] shadow-2xl" style={{ height: 80, paddingBottom: 20, paddingTop: 12 }}>
            <View className="flex-row justify-around items-center h-full">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.path;
                    const color = isActive ? '#FF5722' : '#9CA3AF';
                    
                    return (
                        <TouchableOpacity
                            key={tab.name}
                            onPress={() => router.push(tab.path as any)}
                            className="flex-1 items-center justify-center"
                        >
                            <View className="relative">
                                <Ionicons 
                                    name={isActive ? tab.icon as any : tab.iconOutline as any} 
                                    size={24} 
                                    color={color} 
                                />
                                {tab.badge && tab.badge > 0 && (
                                    <View className="absolute -top-1 -right-2 bg-[#FF5722] rounded-full w-4 h-4 items-center justify-center">
                                        <Text className="text-white text-[10px] font-bold">{tab.badge}</Text>
                                    </View>
                                )}
                            </View>
                            <Text 
                                className="text-[10px] font-extrabold uppercase mt-1" 
                                style={{ color, letterSpacing: 0.5 }}
                            >
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

export default function ConsumerLayout() {
    return (
        <>
            <Stack screenOptions={{ headerShown: false }} />
            <TabBar />
        </>
    );
}
