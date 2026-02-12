import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = [
    { id: '1', name: 'Hamburgers', icon: '🍔', color: '#FFF7ED', accent: '#FFEDD5' },
    { id: '2', name: 'Pizza', icon: '🍕', color: '#FEF2F2', accent: '#FEE2E2' },
    { id: '3', name: 'Sushi', icon: '🍣', color: '#F0FDF4', accent: '#DCFCE7' },
    { id: '4', name: 'Desserts', icon: '🍰', color: '#FAF5FF', accent: '#F3E8FF' },
    { id: '5', name: 'Drinks', icon: '🥤', color: '#EFF6FF', accent: '#DBEAFE' },
    { id: '6', name: 'Chicken', icon: '🍗', color: '#FFFBEB', accent: '#FEF3C7' },
    { id: '7', name: 'Healthy', icon: '🥗', color: '#F0FDF4', accent: '#D1FAE5' },
    { id: '8', name: 'Tacos', icon: '🌮', color: '#FFF7ED', accent: '#FFEDD5' },
];

export default function ExploreScreen() {
    const [search, setSearch] = useState('');

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="py-6">
                    <Text className="text-3xl font-black text-gray-900">Explore</Text>
                    <Text className="text-gray-500 text-lg">What are you craving today?</Text>
                </View>

                {/* Search Bar */}
                <View className="flex-row items-center bg-gray-50 rounded-[24px] px-5 py-4 border border-gray-100 mb-8">
                    <Ionicons name="search" size={24} color="#9CA3AF" />
                    <TextInput
                        placeholder="Search for restaurants or dishes"
                        className="flex-1 ml-3 text-gray-700 text-base font-bold"
                        value={search}
                        onChangeText={setSearch}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                {/* Recent Categories Title */}
                <Text className="text-xl font-bold text-gray-900 mb-6">Popular Categories</Text>

                {/* Categories Grid */}
                <View className="flex-row flex-wrap justify-between">
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            className="w-[48%] mb-4 rounded-[32px] p-6 items-center justify-center border border-gray-100 shadow-sm shadow-gray-200/50"
                            style={{ backgroundColor: cat.color }}
                        >
                            <View className="w-16 h-16 rounded-full items-center justify-center mb-3" style={{ backgroundColor: cat.accent }}>
                                <Text className="text-4xl">{cat.icon}</Text>
                            </View>
                            <Text className="text-gray-900 font-black text-base">{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Suggested Section */}
                <View className="mt-8 mb-10">
                    <Text className="text-xl font-bold text-gray-900 mb-4">Suggested for you</Text>
                    <TouchableOpacity className="bg-[#FF5722] rounded-[32px] p-6 flex-row items-center justify-between overflow-hidden relative">
                        <View className="z-10 flex-1 pr-10">
                            <Text className="text-white font-black text-lg">Unlock 50% Off!</Text>
                            <Text className="text-orange-100 text-sm mt-1">On your favorite gourmet burgers</Text>
                        </View>
                        <Ionicons name="sparkles" size={40} color="rgba(255,255,255,0.3)" className="absolute right-4" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
