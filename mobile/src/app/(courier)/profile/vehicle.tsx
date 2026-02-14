import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Vehicle {
    id: string;
    type: 'bike' | 'scooter' | 'car' | 'motorcycle';
    make?: string;
    model?: string;
    year?: number;
    color: string;
    licensePlate: string;
    photo?: string;
    isPrimary: boolean;
}

interface Insurance {
    provider: string;
    policyNumber: string;
    expirationDate: string;
    status: 'valid' | 'expiring' | 'expired';
}

export default function MyVehicleScreen() {
    const router = useRouter();

    const [vehicle] = useState<Vehicle>({
        id: '1',
        type: 'bike',
        color: 'Black',
        licensePlate: 'N/A',
        isPrimary: true,
    });

    const [insurance] = useState<Insurance>({
        provider: 'State Farm',
        policyNumber: 'SF-123456789',
        expirationDate: 'Dec 31, 2026',
        status: 'valid',
    });

    const getVehicleIcon = (type: string) => {
        switch (type) {
            case 'bike': return 'bicycle';
            case 'scooter': return 'bicycle';
            case 'car': return 'car';
            case 'motorcycle': return 'bicycle';
            default: return 'bicycle';
        }
    };

    const getVehicleLabel = (type: string) => {
        switch (type) {
            case 'bike': return 'Bicycle';
            case 'scooter': return 'Scooter';
            case 'car': return 'Car';
            case 'motorcycle': return 'Motorcycle';
            default: return type;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'valid': return '#10B981';
            case 'expiring': return '#F59E0B';
            case 'expired': return '#EF4444';
            default: return '#64748B';
        }
    };

    const handleEditVehicle = () => {
        Alert.alert('Edit Vehicle', 'This feature will allow you to update your vehicle information.');
    };

    const handleUploadPhoto = () => {
        Alert.alert('Upload Photo', 'This feature will allow you to upload a new vehicle photo.');
    };

    const handleUploadInsurance = () => {
        Alert.alert('Upload Insurance', 'This feature will allow you to upload insurance documents.');
    };

    const handleAddVehicle = () => {
        Alert.alert('Add Vehicle', 'This feature will allow you to register a new vehicle.');
    };

    return (
        <View className="flex-1 bg-[#0A0E27]">
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">My Vehicle</Text>
                    <TouchableOpacity onPress={handleEditVehicle}>
                        <Text className="text-[#3B82F6] font-semibold">Edit</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Vehicle Photo */}
                    <View className="px-6 mb-6">
                        <TouchableOpacity
                            onPress={handleUploadPhoto}
                            className="bg-[#1A1F3A] rounded-3xl overflow-hidden border-2 border-dashed border-[#2A2F4A]"
                            style={{ height: 200 }}
                        >
                            {vehicle.photo ? (
                                <Image
                                    source={{ uri: vehicle.photo }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            ) : (
                                <View className="flex-1 items-center justify-center">
                                    <View className="w-20 h-20 rounded-full bg-[#2A2F4A] items-center justify-center mb-4">
                                        <Ionicons name="camera" size={32} color="#64748B" />
                                    </View>
                                    <Text className="text-gray-400 font-semibold">Upload Vehicle Photo</Text>
                                    <Text className="text-gray-500 text-sm mt-1">Tap to add photo</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Vehicle Information */}
                    <View className="px-6 mb-6">
                        <Text className="text-gray-400 text-xs font-bold tracking-wider mb-3">
                            VEHICLE INFORMATION
                        </Text>
                        <View className="bg-[#1A1F3A] rounded-2xl border border-[#2A2F4A]">
                            {/* Vehicle Type */}
                            <View className="p-4 border-b border-[#2A2F4A]">
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center flex-1">
                                        <View className="w-12 h-12 rounded-full bg-[#3B82F6]/20 items-center justify-center mr-4">
                                            <Ionicons
                                                name={getVehicleIcon(vehicle.type) as any}
                                                size={24}
                                                color="#3B82F6"
                                            />
                                        </View>
                                        <View>
                                            <Text className="text-gray-400 text-xs mb-1">Vehicle Type</Text>
                                            <Text className="text-white font-bold text-lg">
                                                {getVehicleLabel(vehicle.type)}
                                            </Text>
                                        </View>
                                    </View>
                                    {vehicle.isPrimary && (
                                        <View className="bg-[#10B981]/20 px-3 py-1 rounded-full">
                                            <Text className="text-[#10B981] text-xs font-bold">PRIMARY</Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Make & Model (if applicable) */}
                            {vehicle.make && vehicle.model && (
                                <View className="p-4 border-b border-[#2A2F4A]">
                                    <Text className="text-gray-400 text-xs mb-1">Make & Model</Text>
                                    <Text className="text-white font-semibold text-base">
                                        {vehicle.make} {vehicle.model}
                                    </Text>
                                </View>
                            )}

                            {/* Year (if applicable) */}
                            {vehicle.year && (
                                <View className="p-4 border-b border-[#2A2F4A]">
                                    <Text className="text-gray-400 text-xs mb-1">Year</Text>
                                    <Text className="text-white font-semibold text-base">{vehicle.year}</Text>
                                </View>
                            )}

                            {/* Color */}
                            <View className="p-4 border-b border-[#2A2F4A]">
                                <Text className="text-gray-400 text-xs mb-1">Color</Text>
                                <Text className="text-white font-semibold text-base">{vehicle.color}</Text>
                            </View>

                            {/* License Plate */}
                            <View className="p-4">
                                <Text className="text-gray-400 text-xs mb-1">License Plate</Text>
                                <Text className="text-white font-semibold text-base">
                                    {vehicle.licensePlate}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Insurance Information */}
                    <View className="px-6 mb-6">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-gray-400 text-xs font-bold tracking-wider">
                                INSURANCE INFORMATION
                            </Text>
                            <TouchableOpacity onPress={handleUploadInsurance}>
                                <Text className="text-[#3B82F6] text-sm font-semibold">Update</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="bg-[#1A1F3A] rounded-2xl border border-[#2A2F4A]">
                            {/* Provider */}
                            <View className="p-4 border-b border-[#2A2F4A]">
                                <Text className="text-gray-400 text-xs mb-1">Insurance Provider</Text>
                                <Text className="text-white font-semibold text-base">
                                    {insurance.provider}
                                </Text>
                            </View>

                            {/* Policy Number */}
                            <View className="p-4 border-b border-[#2A2F4A]">
                                <Text className="text-gray-400 text-xs mb-1">Policy Number</Text>
                                <Text className="text-white font-semibold text-base">
                                    {insurance.policyNumber}
                                </Text>
                            </View>

                            {/* Expiration Date */}
                            <View className="p-4 border-b border-[#2A2F4A]">
                                <Text className="text-gray-400 text-xs mb-1">Expiration Date</Text>
                                <Text className="text-white font-semibold text-base">
                                    {insurance.expirationDate}
                                </Text>
                            </View>

                            {/* Status */}
                            <View className="p-4">
                                <Text className="text-gray-400 text-xs mb-2">Status</Text>
                                <View className="flex-row items-center">
                                    <View
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{ backgroundColor: getStatusColor(insurance.status) }}
                                    />
                                    <Text
                                        className="font-bold text-base capitalize"
                                        style={{ color: getStatusColor(insurance.status) }}
                                    >
                                        {insurance.status}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Add New Vehicle */}
                    <View className="px-6 mb-8">
                        <TouchableOpacity
                            onPress={handleAddVehicle}
                            className="bg-[#1A1F3A] rounded-2xl py-4 border-2 border-dashed border-[#3B82F6] flex-row items-center justify-center"
                        >
                            <Ionicons name="add-circle" size={24} color="#3B82F6" />
                            <Text className="text-[#3B82F6] font-bold text-base ml-2">
                                Add Another Vehicle
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className="h-8" />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
