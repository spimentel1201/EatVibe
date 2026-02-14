import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const profileSections = [
        {
            title: 'Account',
            items: [
                { icon: 'person-outline', label: 'Personal Information', route: '/profile/edit' },
                { icon: 'location-outline', label: 'Saved Addresses', route: '/profile/addresses' },
                { icon: 'card-outline', label: 'Payment Methods', route: '/profile/payments' },
            ],
        },
        {
            title: 'Preferences',
            items: [
                { icon: 'notifications-outline', label: 'Notifications', route: '/profile/notifications' },
                { icon: 'language-outline', label: 'Language', route: '/profile/language' },
            ],
        },
        {
            title: 'Support',
            items: [
                { icon: 'help-circle-outline', label: 'Help Center', route: '/profile/help' },
                { icon: 'chatbubble-outline', label: 'Contact Us', route: '/profile/contact' },
                { icon: 'document-text-outline', label: 'Terms & Privacy', route: '/profile/terms' },
            ],
        },
    ];

    const handleLogout = () => {
        logout();
        router.replace('/');
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-6 py-6">
                    <Text className="text-3xl font-black text-gray-900">Profile</Text>
                </View>

                {/* User Info Card */}
                <View className="mx-6 mb-8 bg-gradient-to-r from-[#FF5722] to-[#FF7043] rounded-[32px] p-6">
                    <View className="flex-row items-center">
                        <View className="relative">
                            <Image
                                source={{ uri: user?.avatar || 'https://i.pravatar.cc/150?img=68' }}
                                className="w-20 h-20 rounded-full border-4 border-white"
                            />
                            <TouchableOpacity className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full items-center justify-center shadow-lg">
                                <Ionicons name="camera" size={16} color="#FF5722" />
                            </TouchableOpacity>
                        </View>
                        <View className="flex-1 ml-4">
                            <Text className="text-2xl font-black text-white">{user?.name || 'Guest User'}</Text>
                            <Text className="text-white/80 text-sm mt-1">{user?.email || 'guest@example.com'}</Text>
                        </View>
                    </View>
                </View>

                {/* Profile Sections */}
                {profileSections.map((section, _sectionIndex) => (
                    <View key={section.title} className="px-6 mb-8">
                        <Text className="text-lg font-bold text-gray-900 mb-4">{section.title}</Text>
                        <View className="bg-gray-50 rounded-[28px] overflow-hidden">
                            {section.items.map((item, itemIndex) => (
                                <TouchableOpacity
                                    key={item.label}
                                    onPress={() => router.push(item.route as any)}
                                    className={`flex-row items-center p-4 ${itemIndex < section.items.length - 1 ? 'border-b border-gray-100' : ''
                                        }`}
                                >
                                    <View className="w-10 h-10 rounded-full bg-white items-center justify-center mr-4">
                                        <Ionicons name={item.icon as any} size={20} color="#FF5722" />
                                    </View>
                                    <Text className="flex-1 text-base font-bold text-gray-900">{item.label}</Text>
                                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Logout Button */}
                <View className="px-6 pb-8">
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="bg-red-50 border-2 border-red-200 rounded-full h-14 flex-row items-center justify-center"
                    >
                        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                        <Text className="text-red-500 font-black text-base ml-2">Logout</Text>
                    </TouchableOpacity>
                </View>

                {/* App Version */}
                <View className="items-center pb-8">
                    <Text className="text-gray-400 text-sm">FoodRush v1.0.0</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
