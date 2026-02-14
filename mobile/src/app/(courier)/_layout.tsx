import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

export default function CourierLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#0A0E27',
                    borderTopColor: '#1E293B',
                    height: 90,
                    paddingBottom: 30,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: '#6366F1',
                tabBarInactiveTintColor: '#64748B',
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginTop: 4,
                },
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <View className="relative">
                            <Ionicons name="grid" size={24} color={color} />
                            {focused && (
                                <View className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#6366F1]" />
                            )}
                        </View>
                    ),
                }}
            />

            <Tabs.Screen
                name="earnings"
                options={{
                    title: 'Earnings',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="wallet-outline" size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="trips"
                options={{
                    title: 'Trips',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="map-outline" size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="person-outline" size={24} color={color} />
                    ),
                }}
            />

            {/* Ocultar pantallas que no son tabs principales */}
            <Tabs.Screen name="delivery" options={{ href: null }} />
            <Tabs.Screen name="onboarding" options={{ href: null }} />
            <Tabs.Screen name="order" options={{ href: null }} />
            <Tabs.Screen name="support" options={{ href: null }} />
        </Tabs>
    );
}
