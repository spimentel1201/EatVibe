import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock addresses
const MOCK_ADDRESSES = [
    {
        id: 'addr-1',
        label: 'Home',
        address: '123 Main St, Lima, Peru',
        isDefault: true,
        icon: 'home-outline',
    },
    {
        id: 'addr-2',
        label: 'Work',
        address: '456 Tech Park, Lima, Peru',
        isDefault: false,
        icon: 'briefcase-outline',
    },
];

export default function AddressesScreen() {
    const router = useRouter();
    const [addresses, setAddresses] = useState(MOCK_ADDRESSES);

    const handleAddAddress = () => {
        // TODO: Navigate to add address screen or modal
        console.log('Adding new address...');
    };

    const handleDelete = (id: string) => {
        setAddresses(addresses.filter(addr => addr.id !== id));
    };

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
                <Text className="text-2xl font-black text-gray-900">Manage Addresses</Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                {addresses.length === 0 ? (
                    <View className="items-center justify-center py-20">
                        <Ionicons name="location-outline" size={80} color="#D1D5DB" />
                        <Text className="text-xl font-bold text-gray-900 mt-4">No addresses saved</Text>
                        <Text className="text-gray-400 text-center mt-2 px-10">
                            Add an address to make checkout faster and easier.
                        </Text>
                    </View>
                ) : (
                    <View className="space-y-4">
                        {addresses.map((addr) => (
                            <View
                                key={addr.id}
                                className="bg-gray-50 rounded-[24px] p-5 border border-gray-100 flex-row items-center justify-between"
                            >
                                <View className="flex-row items-center flex-1">
                                    <View className="w-12 h-12 rounded-full bg-[#FF5722]/10 items-center justify-center mr-4">
                                        <Ionicons name={addr.icon as any} size={24} color="#FF5722" />
                                    </View>
                                    <View className="flex-1">
                                        <View className="flex-row items-center">
                                            <Text className="text-lg font-bold text-gray-900 mr-2">{addr.label}</Text>
                                            {addr.isDefault && (
                                                <View className="bg-green-100 px-2 py-0.5 rounded-full">
                                                    <Text className="text-green-600 text-xs font-bold">Default</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text className="text-gray-500 text-sm mt-1" numberOfLines={1}>
                                            {addr.address}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() => handleDelete(addr.id)}
                                    className="p-2"
                                >
                                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Add Address Button */}
            <View className="px-6 py-6 border-t border-gray-100">
                <TouchableOpacity
                    onPress={handleAddAddress}
                    className="bg-[#FF5722] h-14 rounded-full items-center justify-center shadow-lg shadow-orange-500/30 flex-row"
                >
                    <View className="mr-2">
                        <Ionicons name="add" size={24} color="white" />
                    </View>
                    <Text className="text-white font-black text-lg">Add New Address</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
