import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

type VehicleType = 'moto' | 'bicycle' | 'car';

export default function VehicleRegistrationScreen() {
    const router = useRouter();
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);
    const [plateNumber, setPlateNumber] = useState('');
    const [licensePhoto, setLicensePhoto] = useState<string | null>(null);

    const handleSubmit = () => {
        if (!selectedVehicle || !plateNumber || !licensePhoto) {
            Alert.alert('Incomplete Form', 'Please complete all fields before submitting.');
            return;
        }

        // TODO: Submit to backend
        console.log({
            vehicleType: selectedVehicle,
            plateNumber,
            licensePhoto,
        });

        Alert.alert('Success', 'Vehicle registration submitted successfully!', [
            {
                text: 'OK',
                onPress: () => {
                    // Navigate to next step (review)
                    // router.push('/courier/onboarding/review' as any);
                },
            },
        ]);
    };

    const handleTakeLicensePhoto = async () => {
        // Request camera permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert(
                'Camera Permission Required',
                'Please grant camera permission to take photos of your license.',
                [{ text: 'OK' }]
            );
            return;
        }

        // Show options: Camera or Gallery
        Alert.alert(
            'Upload License Photo',
            'Choose an option',
            [
                {
                    text: 'Take Photo',
                    onPress: async () => {
                        const result = await ImagePicker.launchCameraAsync({
                            mediaTypes: ['images'],
                            allowsEditing: true,
                            aspect: [16, 10],
                            quality: 0.8,
                        });

                        if (!result.canceled && result.assets[0]) {
                            setLicensePhoto(result.assets[0].uri);
                        }
                    },
                },
                {
                    text: 'Choose from Gallery',
                    onPress: async () => {
                        const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ['images'],
                            allowsEditing: true,
                            aspect: [16, 10],
                            quality: 0.8,
                        });

                        if (!result.canceled && result.assets[0]) {
                            setLicensePhoto(result.assets[0].uri);
                        }
                    },
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ]
        );
    };

    const handleScanPlate = async () => {
        // Request camera permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert(
                'Camera Permission Required',
                'Please grant camera permission to scan your plate number.',
                [{ text: 'OK' }]
            );
            return;
        }

        // Launch camera to scan plate
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            // TODO: Implement OCR to extract plate number from image
            // For now, just show a message
            Alert.alert(
                'Plate Scanned',
                'OCR functionality will be implemented soon. Please enter the plate number manually.',
                [{ text: 'OK' }]
            );
            // Placeholder: In production, you would use an OCR service here
            // const extractedPlate = await extractPlateFromImage(result.assets[0].uri);
            // setPlateNumber(extractedPlate);
        }
    };

    const isFormValid = selectedVehicle && plateNumber.length > 0 && licensePhoto;

    return (
        <SafeAreaView className="flex-1 bg-[#0F172A]" edges={['top']}>
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mr-4"
                >
                    <Ionicons name="chevron-back" size={28} color="#3B82F6" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-white">Vehicle Registration</Text>
            </View>

            {/* Progress Stepper */}
            <View className="px-6 mb-8">
                <View className="flex-row items-center justify-between">
                    {/* Step 1 - Profile (Completed) */}
                    <View className="items-center flex-1">
                        <View className="w-12 h-12 rounded-full bg-[#3B82F6] items-center justify-center mb-2">
                            <Ionicons name="checkmark" size={24} color="#FFF" />
                        </View>
                        <Text className="text-xs font-semibold text-[#3B82F6]">Profile</Text>
                    </View>

                    {/* Line */}
                    <View className="flex-1 h-1 bg-[#3B82F6] -mt-6 mx-2" />

                    {/* Step 2 - Vehicle (Current) */}
                    <View className="items-center flex-1">
                        <View className="w-12 h-12 rounded-full bg-[#3B82F6] items-center justify-center mb-2">
                            <Text className="text-white font-bold text-lg">2</Text>
                        </View>
                        <Text className="text-xs font-semibold text-[#3B82F6]">Vehicle</Text>
                    </View>

                    {/* Line */}
                    <View className="flex-1 h-1 bg-[#1E293B] -mt-6 mx-2" />

                    {/* Step 3 - Review (Pending) */}
                    <View className="items-center flex-1">
                        <View className="w-12 h-12 rounded-full bg-[#1E293B] items-center justify-center mb-2">
                            <Text className="text-gray-500 font-bold text-lg">3</Text>
                        </View>
                        <Text className="text-xs font-semibold text-gray-500">Review</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Vehicle Type Section */}
                <View className="mb-8">
                    <Text className="text-xl font-bold text-white mb-2">Vehicle Type</Text>
                    <Text className="text-sm text-gray-400 mb-6">Choose your primary delivery vehicle</Text>

                    <View className="flex-row gap-4">
                        {/* Moto */}
                        <TouchableOpacity
                            onPress={() => setSelectedVehicle('moto')}
                            className={`flex-1 rounded-2xl p-6 items-center justify-center border-2 ${selectedVehicle === 'moto'
                                ? 'bg-[#1E3A8A]/20 border-[#3B82F6]'
                                : 'bg-[#1E293B] border-[#1E293B]'
                                }`}
                            style={{ height: 120 }}
                        >
                            <Ionicons
                                name="bicycle"
                                size={40}
                                color={selectedVehicle === 'moto' ? '#3B82F6' : '#64748B'}
                            />
                            <Text
                                className={`text-sm font-bold mt-3 ${selectedVehicle === 'moto' ? 'text-[#3B82F6]' : 'text-gray-400'
                                    }`}
                            >
                                MOTO
                            </Text>
                        </TouchableOpacity>

                        {/* Bicycle */}
                        <TouchableOpacity
                            onPress={() => setSelectedVehicle('bicycle')}
                            className={`flex-1 rounded-2xl p-6 items-center justify-center border-2 ${selectedVehicle === 'bicycle'
                                ? 'bg-[#1E3A8A]/20 border-[#3B82F6]'
                                : 'bg-[#1E293B] border-[#1E293B]'
                                }`}
                            style={{ height: 120 }}
                        >
                            <Ionicons
                                name="bicycle-outline"
                                size={40}
                                color={selectedVehicle === 'bicycle' ? '#3B82F6' : '#64748B'}
                            />
                            <Text
                                className={`text-sm font-bold mt-3 ${selectedVehicle === 'bicycle' ? 'text-[#3B82F6]' : 'text-gray-400'
                                    }`}
                            >
                                BICYCLE
                            </Text>
                        </TouchableOpacity>

                        {/* Car */}
                        <TouchableOpacity
                            onPress={() => setSelectedVehicle('car')}
                            className={`flex-1 rounded-2xl p-6 items-center justify-center border-2 ${selectedVehicle === 'car'
                                ? 'bg-[#1E3A8A]/20 border-[#3B82F6]'
                                : 'bg-[#1E293B] border-[#1E293B]'
                                }`}
                            style={{ height: 120 }}
                        >
                            <Ionicons
                                name="car-outline"
                                size={40}
                                color={selectedVehicle === 'car' ? '#3B82F6' : '#64748B'}
                            />
                            <Text
                                className={`text-sm font-bold mt-3 ${selectedVehicle === 'car' ? 'text-[#3B82F6]' : 'text-gray-400'
                                    }`}
                            >
                                CAR
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Plate Number Section */}
                <View className="mb-8">
                    <Text className="text-lg font-bold text-white mb-4">Plate Number</Text>
                    <View className="relative">
                        <TextInput
                            value={plateNumber}
                            onChangeText={setPlateNumber}
                            placeholder="e.g. ABC-1234"
                            placeholderTextColor="#64748B"
                            className="bg-[#1E293B] rounded-2xl px-5 py-4 text-white text-base pr-14"
                            autoCapitalize="characters"
                        />
                        <TouchableOpacity
                            onPress={handleScanPlate}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                            style={{ transform: [{ translateY: -12 }] }}
                        >
                            <View className="w-10 h-10 rounded-full bg-[#3B82F6] items-center justify-center">
                                <Ionicons name="camera" size={20} color="#FFF" />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text className="text-xs text-gray-500 mt-2 ml-1">
                        Use the camera icon to scan your plate automatically.
                    </Text>
                </View>

                {/* Driver's License Section */}
                <View className="mb-8">
                    <Text className="text-lg font-bold text-white mb-4">Driver's License</Text>
                    <TouchableOpacity
                        onPress={handleTakeLicensePhoto}
                        className="bg-[#1E293B] rounded-2xl overflow-hidden items-center justify-center"
                        style={{ minHeight: 200 }}
                    >
                        {licensePhoto ? (
                            <View className="w-full h-full">
                                <Image
                                    source={{ uri: licensePhoto }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                                <View className="absolute inset-0 bg-black/40 items-center justify-center">
                                    <View className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
                                        <Ionicons name="checkmark-circle" size={48} color="#10B981" />
                                        <Text className="text-white font-semibold mt-2 text-center">License uploaded</Text>
                                        <Text className="text-gray-200 text-xs mt-1 text-center">Tap to change</Text>
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <View className="items-center p-12">
                                <View className="w-20 h-20 rounded-full bg-[#1E3A8A]/30 items-center justify-center mb-4">
                                    <Ionicons name="camera" size={36} color="#3B82F6" />
                                </View>
                                <Text className="text-white font-semibold text-base">
                                    Tap to upload or take a photo
                                </Text>
                                <Text className="text-gray-400 text-sm mt-2">
                                    Front side clearly visible
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Info Banner */}
                <View className="bg-[#1E3A8A]/20 border border-[#3B82F6]/30 rounded-2xl p-4 mb-8">
                    <View className="flex-row items-start">
                        <View className="w-6 h-6 rounded-full bg-[#3B82F6]/20 items-center justify-center mr-3 mt-0.5">
                            <Ionicons name="information" size={16} color="#3B82F6" />
                        </View>
                        <Text className="flex-1 text-sm text-gray-300 leading-5">
                            Your data is stored securely. We use your vehicle information for insurance and
                            identification purposes during deliveries.
                        </Text>
                    </View>
                </View>

                {/* Spacing for button */}
                <View className="h-24" />
            </ScrollView>

            {/* Submit Button */}
            <View className="px-6 pb-8 pt-4 bg-[#0F172A] border-t border-[#1E293B]">
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={!isFormValid}
                    className={`h-14 rounded-full items-center justify-center flex-row ${isFormValid ? 'bg-[#3B82F6]' : 'bg-[#1E293B]'
                        }`}
                >
                    <Text
                        className={`font-bold text-base mr-2 ${isFormValid ? 'text-white' : 'text-gray-500'
                            }`}
                    >
                        Submit Application
                    </Text>
                    <Ionicons
                        name="arrow-forward"
                        size={20}
                        color={isFormValid ? '#FFF' : '#64748B'}
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
