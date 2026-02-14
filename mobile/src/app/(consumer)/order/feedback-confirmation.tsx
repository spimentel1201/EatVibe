import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function FeedbackConfirmationScreen() {
    const router = useRouter();

    const handleGoHome = () => {
        router.replace('/(consumer)/home' as any);
    };

    const handleClose = () => {
        router.replace('/(consumer)/home' as any);
    };

    // Mock data
    const pointsEarned = 50;
    const currentPoints = 750;
    const nextLevelPoints = 1000;
    const progressPercentage = (currentPoints / nextLevelPoints) * 100;

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
            {/* Close Button */}
            <View className="absolute top-12 right-6 z-10">
                <TouchableOpacity
                    onPress={handleClose}
                    className="w-10 h-10 items-center justify-center"
                >
                    <Ionicons name="close" size={28} color="#000" />
                </TouchableOpacity>
            </View>

            <View className="flex-1 items-center px-6 pt-8">
                {/* Celebration Image */}
                <View className="w-full aspect-square max-w-[340px] bg-gradient-to-b from-yellow-300 to-yellow-400 rounded-3xl items-center justify-center mb-8 overflow-hidden">
                    {/* Stars decoration */}
                    <View className="absolute inset-0">
                        <View className="absolute top-12 left-8">
                            <Ionicons name="star" size={24} color="#FFF" style={{ opacity: 0.6 }} />
                        </View>
                        <View className="absolute top-20 right-12">
                            <Ionicons name="star" size={20} color="#FFF" style={{ opacity: 0.4 }} />
                        </View>
                        <View className="absolute top-32 left-16">
                            <Ionicons name="star" size={16} color="#FFF" style={{ opacity: 0.5 }} />
                        </View>
                        <View className="absolute top-40 right-20">
                            <Ionicons name="star" size={18} color="#FFD700" style={{ opacity: 0.7 }} />
                        </View>
                        <View className="absolute bottom-32 left-12">
                            <Ionicons name="star" size={22} color="#FFF" style={{ opacity: 0.5 }} />
                        </View>
                        <View className="absolute bottom-40 right-16">
                            <Ionicons name="star" size={20} color="#FFD700" style={{ opacity: 0.6 }} />
                        </View>
                    </View>

                    {/* Shopping Bag Icon */}
                    <View className="items-center justify-center">
                        <View className="w-48 h-48 bg-[#FF5722] rounded-3xl items-center justify-center shadow-2xl">
                            {/* Bag handle */}
                            <View className="absolute -top-6 w-24 h-12 border-4 border-[#FF5722] rounded-t-full" />

                            {/* Smile */}
                            <View className="mt-8">
                                <View className="w-20 h-2 bg-gray-900 rounded-full" style={{ transform: [{ scaleY: 0.5 }] }} />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Thank You Message */}
                <View className="items-center mb-6">
                    <Text className="text-3xl font-black text-gray-900 text-center mb-3">
                        Thanks for your{'\n'}feedback!
                    </Text>
                    <Text className="text-base text-gray-500 text-center px-4">
                        Your review helps our community and{'\n'}restaurants improve.
                    </Text>
                </View>

                {/* Reward Card */}
                <View className="w-full bg-gray-50 rounded-3xl p-6 mb-6">
                    <View className="flex-row items-start mb-4">
                        <View className="flex-1">
                            <View className="flex-row items-center mb-2">
                                <Ionicons name="gift" size={18} color="#FF5722" />
                                <Text className="text-sm font-bold text-[#FF5722] ml-2 uppercase tracking-wide">
                                    NEW REWARD
                                </Text>
                            </View>
                            <Text className="text-2xl font-black text-gray-900 mb-1">
                                You earned {pointsEarned}
                            </Text>
                            <Text className="text-2xl font-black text-gray-900 mb-2">
                                FoodRush Points!
                            </Text>
                            <Text className="text-sm text-gray-500">
                                Keep reviewing to unlock more{'\n'}rewards
                            </Text>
                        </View>
                        <View className="w-16 h-16 rounded-full bg-[#FF5722]/10 items-center justify-center">
                            <Ionicons name="star" size={32} color="#FF5722" />
                        </View>
                    </View>

                    {/* Progress Bar */}
                    <View className="mt-4">
                        <View className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                            <View
                                className="h-full bg-[#FF5722] rounded-full"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </View>
                        <Text className="text-xs text-gray-400 text-center">
                            {currentPoints} / {nextLevelPoints} to next level
                        </Text>
                    </View>
                </View>
            </View>

            {/* Back to Home Button */}
            <View className="px-6 pb-8">
                <TouchableOpacity
                    onPress={handleGoHome}
                    className="bg-[#FF5722] h-14 rounded-full items-center justify-center shadow-lg"
                >
                    <Text className="text-white font-bold text-base">Back to Home</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
