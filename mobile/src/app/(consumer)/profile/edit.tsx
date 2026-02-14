import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function EditProfileScreen() {
    const router = useRouter();
    const { user } = useAuth();

    // Initialize state with user data or defaults
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState('+51 987 654 321'); // Mock phone for now

    const handleSave = () => {
        // TODO: Implement update profile logic with backend
        console.log('Saving profile:', { name, email, phone });
        router.back();
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
                <Text className="text-2xl font-black text-gray-900">Edit Profile</Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                {/* Avatar Section */}
                <View className="items-center mb-8">
                    <View className="relative">
                        <Image
                            source={{ uri: user?.avatar || 'https://i.pravatar.cc/150?img=68' }}
                            className="w-24 h-24 rounded-full border-4 border-gray-100"
                        />
                        <TouchableOpacity className="absolute bottom-0 right-0 w-8 h-8 bg-[#FF5722] rounded-full items-center justify-center border-2 border-white">
                            <Ionicons name="camera" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-[#FF5722] font-bold mt-3">Change Photo</Text>
                </View>

                {/* Form Fields */}
                <View className="space-y-6">
                    {/* Name Input */}
                    <View>
                        <Text className="text-gray-500 font-bold mb-2 ml-1">Full Name</Text>
                        <View className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 flex-row items-center">
                            <View className="mr-3">
                                <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                            </View>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your full name"
                                className="flex-1 text-gray-900 font-bold text-base"
                            />
                        </View>
                    </View>

                    {/* Email Input */}
                    <View>
                        <Text className="text-gray-500 font-bold mb-2 ml-1">Email Address</Text>
                        <View className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 flex-row items-center">
                            <View className="mr-3">
                                <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
                            </View>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Enter your email"
                                keyboardType="email-address"
                                className="flex-1 text-gray-900 font-bold text-base"
                            />
                        </View>
                    </View>

                    {/* Phone Input */}
                    <View>
                        <Text className="text-gray-500 font-bold mb-2 ml-1">Phone Number</Text>
                        <View className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 flex-row items-center">
                            <View className="mr-3">
                                <Ionicons name="call-outline" size={20} color="#9CA3AF" />
                            </View>
                            <TextInput
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Enter your phone number"
                                keyboardType="phone-pad"
                                className="flex-1 text-gray-900 font-bold text-base"
                            />
                        </View>
                    </View>
                </View>

            </ScrollView>

            {/* Save Button */}
            <View className="px-6 py-6 border-t border-gray-100">
                <TouchableOpacity
                    onPress={handleSave}
                    className="bg-[#FF5722] h-14 rounded-full items-center justify-center shadow-lg shadow-orange-500/30"
                >
                    <Text className="text-white font-black text-lg">Save Changes</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
