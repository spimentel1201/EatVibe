import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import React from 'react';

export default function ConsumerLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#FF5722', // Orange like mockup
                tabBarInactiveTintColor: '#9CA3AF', // Gray-400
                tabBarStyle: {
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    height: 70,
                    paddingBottom: 10,
                    paddingTop: 10,
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 0,
                    elevation: 20, // Shadow for Android
                    shadowColor: '#000', // Shadow for iOS
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: -4
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "compass" : "compass-outline"} size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: 'Cart',
                    tabBarIcon: ({ color, focused }) => (
                        <View>
                            <Ionicons name={focused ? "cart" : "cart-outline"} size={26} color={color} />
                            {/* Simple Badge simulation */}
                            <View className="absolute -top-1 -right-2 bg-red-500 rounded-full w-4 h-4 justify-center items-center">
                                <View className="bg-red-500 w-2 h-2 rounded-full" />
                            </View>
                        </View>
                    ),
                    tabBarBadge: 2,
                    tabBarBadgeStyle: { backgroundColor: '#FF5722', fontSize: 10 }
                }}
            />
            <Tabs.Screen
                name="orders"
                options={{
                    title: 'Orders',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "time" : "time-outline"} size={26} color={color} />
                    ),
                }}
            />

            {/* Hidden Stack Routes */}
            <Tabs.Screen
                name="restaurant/[id]"
                options={{
                    href: null,
                    tabBarStyle: { display: 'none' }
                }}
            />
        </Tabs>
    );
}
