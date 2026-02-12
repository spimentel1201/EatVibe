import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withDelay,
    FadeIn,
    SlideInDown,
} from 'react-native-reanimated';

export default function FeedbackConfirmationScreen() {
    const router = useRouter();
    const scale = useSharedValue(0);
    const rotation = useSharedValue(0);

    useEffect(() => {
        // Celebration animation
        scale.value = withSequence(
            withSpring(1.2, { damping: 2 }),
            withSpring(1, { damping: 3 })
        );
        rotation.value = withSequence(
            withDelay(200, withSpring(10, { damping: 2 })),
            withSpring(-10, { damping: 2 }),
            withSpring(0, { damping: 3 })
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { rotate: `${rotation.value}deg` },
        ],
    }));

    const handleGoHome = () => {
        router.replace('/(consumer)' as any);
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
            <View className="flex-1 items-center justify-center px-6">
                {/* Success Icon with Animation */}
                <Animated.View style={animatedStyle} className="mb-8">
                    <View className="w-32 h-32 rounded-full bg-green-100 items-center justify-center">
                        <Ionicons name="checkmark-circle" size={80} color="#10B981" />
                    </View>
                </Animated.View>

                {/* Thank You Message */}
                <Animated.View
                    entering={FadeIn.delay(300).duration(500)}
                    className="items-center"
                >
                    <Text className="text-3xl font-black text-gray-900 text-center">
                        Thank You!
                    </Text>
                    <Text className="text-base text-gray-600 text-center mt-4 px-8">
                        Your feedback helps us improve our service and provide better experiences
                    </Text>
                </Animated.View>

                {/* Confetti Emojis */}
                <Animated.View
                    entering={SlideInDown.delay(500).duration(400)}
                    className="flex-row items-center justify-center mt-8 space-x-4"
                >
                    <Text className="text-4xl">🎉</Text>
                    <Text className="text-4xl">⭐</Text>
                    <Text className="text-4xl">🎊</Text>
                </Animated.View>

                {/* Stats Card */}
                <Animated.View
                    entering={SlideInDown.delay(700).duration(400)}
                    className="w-full mt-12 bg-gradient-to-r from-[#FF5722] to-[#FF7043] rounded-[32px] p-6"
                >
                    <View className="flex-row items-center justify-around">
                        <View className="items-center">
                            <Text className="text-3xl font-black text-white">127</Text>
                            <Text className="text-sm text-white/80 mt-1">Total Orders</Text>
                        </View>
                        <View className="w-px h-12 bg-white/20" />
                        <View className="items-center">
                            <Text className="text-3xl font-black text-white">4.8</Text>
                            <Text className="text-sm text-white/80 mt-1">Avg Rating</Text>
                        </View>
                        <View className="w-px h-12 bg-white/20" />
                        <View className="items-center">
                            <Text className="text-3xl font-black text-white">95%</Text>
                            <Text className="text-sm text-white/80 mt-1">Satisfaction</Text>
                        </View>
                    </View>
                </Animated.View>
            </View>

            {/* Action Buttons */}
            <Animated.View
                entering={SlideInDown.delay(900).duration(400)}
                className="px-6 pb-8"
            >
                <TouchableOpacity
                    onPress={handleGoHome}
                    className="bg-[#FF5722] h-14 rounded-full items-center justify-center shadow-lg shadow-orange-500/30 mb-3"
                >
                    <Text className="text-white font-black text-lg">Back to Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.push('/(consumer)/orders' as any)}
                    className="bg-gray-100 h-14 rounded-full items-center justify-center"
                >
                    <Text className="text-gray-900 font-black text-lg">View Orders</Text>
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    );
}
