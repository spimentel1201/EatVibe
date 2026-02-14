import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type NavigationApp = 'google' | 'waze';

export default function ProfileScreen() {
    const router = useRouter();

    const [preferredNavigation, setPreferredNavigation] = useState<NavigationApp>('google');

    // Mock user data
    const courierProfile = {
        name: 'Alex Thompson',
        photo: 'https://i.pravatar.cc/300?img=47', // Placeholder
        rating: 4.9,
        partnerSince: '2022',
        vehicleType: 'E-Bike',
        vehicle: {
            type: 'RadRunner 2',
            plate: 'FR-9921',
        },
        documents: {
            licenseExpiry: '12 days',
            hasWarning: true,
        },
        bankDetails: {
            lastFour: '4920',
            bank: 'Chase',
        },
    };

    const appVersion = 'v4.12.0 (Night Rider Edition)';

    const handleMyVehicle = () => {
        router.push('/(courier)/profile/vehicle' as any);
    };

    const handleDocuments = () => {
        router.push('/(courier)/profile/documents' as any);
    };

    const handleBankDetails = () => {
        router.push('/(courier)/profile/bank' as any);
    };

    const handleAppSettings = () => {
        router.push('/(courier)/profile/settings' as any);
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                        // TODO: Clear auth tokens and navigate to login
                        router.replace('/(auth)/login' as any);
                    },
                },
            ]
        );
    };

    return (
        <View className="flex-1 bg-[#0A0E27]">
            <SafeAreaView edges={['top']} className="flex-1">
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Profile Header */}
                    <View className="items-center pt-8 pb-6">
                        {/* Profile Photo with Rating Badge */}
                        <View className="relative mb-4">
                            <View className="w-32 h-32 rounded-full border-4 border-[#3B82F6] overflow-hidden">
                                <Image
                                    source={{ uri: courierProfile.photo }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            </View>
                            {/* Rating Badge */}
                            <View className="absolute bottom-0 right-0 bg-[#3B82F6] rounded-full px-3 py-1 flex-row items-center">
                                <Ionicons name="star" size={14} color="#FFF" />
                                <Text className="text-white text-sm font-bold ml-1">
                                    {courierProfile.rating}
                                </Text>
                            </View>
                        </View>

                        {/* Name */}
                        <Text className="text-white text-2xl font-bold mb-2">
                            {courierProfile.name}
                        </Text>

                        {/* Partner Info */}
                        <View className="flex-row items-center">
                            <Text className="text-[#3B82F6] text-sm">
                                Partner since {courierProfile.partnerSince}
                            </Text>
                            <View className="w-1 h-1 rounded-full bg-[#3B82F6] mx-2" />
                            <Text className="text-[#3B82F6] text-sm">
                                {courierProfile.vehicleType}
                            </Text>
                        </View>
                    </View>

                    {/* Account Management Section */}
                    <View className="px-6 mb-6">
                        <Text className="text-gray-500 text-xs font-bold tracking-wider mb-4">
                            ACCOUNT MANAGEMENT
                        </Text>

                        <View className="gap-3">
                            {/* My Vehicle */}
                            <TouchableOpacity
                                onPress={handleMyVehicle}
                                className="bg-[#1A1F3A] rounded-2xl p-4 flex-row items-center border border-[#2A2F4A]"
                            >
                                <View className="w-12 h-12 rounded-full bg-[#1E3A8A] items-center justify-center mr-4">
                                    <Ionicons name="bicycle" size={24} color="#3B82F6" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-bold text-base mb-1">
                                        My Vehicle
                                    </Text>
                                    <Text className="text-gray-400 text-xs">
                                        {courierProfile.vehicle.type} • {courierProfile.vehicle.plate}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#64748B" />
                            </TouchableOpacity>

                            {/* Documents */}
                            <TouchableOpacity
                                onPress={handleDocuments}
                                className="bg-[#1A1F3A] rounded-2xl p-4 flex-row items-center border border-[#2A2F4A]"
                            >
                                <View className="w-12 h-12 rounded-full bg-[#1E3A8A] items-center justify-center mr-4">
                                    <Ionicons name="document-text" size={24} color="#3B82F6" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-bold text-base mb-1">
                                        Documents
                                    </Text>
                                    <Text className="text-[#F59E0B] text-xs">
                                        License expires in {courierProfile.documents.licenseExpiry}
                                    </Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    {courierProfile.documents.hasWarning && (
                                        <View className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                                    )}
                                    <Ionicons name="chevron-forward" size={20} color="#64748B" />
                                </View>
                            </TouchableOpacity>

                            {/* Bank Details */}
                            <TouchableOpacity
                                onPress={handleBankDetails}
                                className="bg-[#1A1F3A] rounded-2xl p-4 flex-row items-center border border-[#2A2F4A]"
                            >
                                <View className="w-12 h-12 rounded-full bg-[#1E3A8A] items-center justify-center mr-4">
                                    <Ionicons name="card" size={24} color="#3B82F6" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-bold text-base mb-1">
                                        Bank Details
                                    </Text>
                                    <Text className="text-gray-400 text-xs">
                                        Payouts to {courierProfile.bankDetails.bank} ****{courierProfile.bankDetails.lastFour}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#64748B" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Preferences Section */}
                    <View className="px-6 mb-6">
                        <Text className="text-gray-500 text-xs font-bold tracking-wider mb-4">
                            PREFERENCES
                        </Text>

                        <View className="gap-3">
                            {/* App Settings */}
                            <TouchableOpacity
                                onPress={handleAppSettings}
                                className="bg-[#1A1F3A] rounded-2xl p-4 flex-row items-center border border-[#2A2F4A]"
                            >
                                <View className="w-12 h-12 rounded-full bg-[#1E3A8A] items-center justify-center mr-4">
                                    <Ionicons name="settings" size={24} color="#3B82F6" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-bold text-base mb-1">
                                        App Settings
                                    </Text>
                                    <Text className="text-gray-400 text-xs">
                                        Navigation, Dark Mode, Units
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#64748B" />
                            </TouchableOpacity>

                            {/* Preferred Navigation */}
                            <View className="bg-[#1A1F3A] rounded-2xl p-4 border border-[#2A2F4A]">
                                <View className="flex-row items-center mb-4">
                                    <View className="w-12 h-12 rounded-full bg-[#1E3A8A] items-center justify-center mr-4">
                                        <Ionicons name="navigate" size={24} color="#3B82F6" />
                                    </View>
                                    <Text className="text-white font-bold text-base">
                                        Preferred Navigation
                                    </Text>
                                </View>

                                {/* Navigation Toggle */}
                                <View className="flex-row gap-3">
                                    <TouchableOpacity
                                        onPress={() => setPreferredNavigation('google')}
                                        className={`flex-1 py-3 rounded-full flex-row items-center justify-center ${preferredNavigation === 'google'
                                            ? 'bg-[#3B82F6]'
                                            : 'bg-[#2A2F4A]'
                                            }`}
                                    >
                                        <Ionicons
                                            name="navigate"
                                            size={16}
                                            color={preferredNavigation === 'google' ? '#FFF' : '#64748B'}
                                        />
                                        <Text
                                            className={`font-bold text-sm ml-2 ${preferredNavigation === 'google'
                                                ? 'text-white'
                                                : 'text-gray-400'
                                                }`}
                                        >
                                            Google Maps
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => setPreferredNavigation('waze')}
                                        className={`flex-1 py-3 rounded-full flex-row items-center justify-center ${preferredNavigation === 'waze'
                                            ? 'bg-[#3B82F6]'
                                            : 'bg-[#2A2F4A]'
                                            }`}
                                    >
                                        <Ionicons
                                            name="navigate"
                                            size={16}
                                            color={preferredNavigation === 'waze' ? '#FFF' : '#64748B'}
                                        />
                                        <Text
                                            className={`font-bold text-sm ml-2 ${preferredNavigation === 'waze'
                                                ? 'text-white'
                                                : 'text-gray-400'
                                                }`}
                                        >
                                            Waze
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Logout Button */}
                    <View className="px-6 mb-6">
                        <TouchableOpacity
                            onPress={handleLogout}
                            className="py-4 items-center"
                        >
                            <View className="flex-row items-center">
                                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                                <Text className="text-[#EF4444] font-bold text-base ml-2">
                                    Logout
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* App Version */}
                    <View className="items-center pb-6">
                        <Text className="text-gray-600 text-xs">
                            FoodRush Courier {appVersion}
                        </Text>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
