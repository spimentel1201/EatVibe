import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const DELIVERY_TAGS = [
    { id: 'fast', label: 'Fast delivery' },
    { id: 'hot', label: 'Food was hot' },
    { id: 'polite', label: 'Polite courier' },
];

export default function OrderFeedbackScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const orderId = params.id as string;

    const [restaurantRating, setRestaurantRating] = useState(0);
    const [deliveryRating, setDeliveryRating] = useState<'good' | 'bad' | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [foodReview, setFoodReview] = useState('');

    // Mock courier data
    const courier = {
        name: 'Marcus',
        avatar: 'https://i.pravatar.cc/150?img=12',
    };

    const toggleTag = (tagId: string) => {
        setSelectedTags((prev) =>
            prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
        );
    };

    const handleSubmit = () => {
        if (restaurantRating === 0 || deliveryRating === null) {
            console.log('Please complete all ratings');
            return;
        }

        // TODO: Submit to backend
        console.log({
            orderId,
            restaurantRating,
            deliveryRating,
            selectedTags,
            foodReview,
        });

        // Navigate to confirmation
        router.push('/order/feedback-confirmation' as any);
    };

    const renderStars = (currentRating: number) => {
        return (
            <View className="flex-row items-center justify-center gap-2 my-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => setRestaurantRating(star)}
                        className="p-1"
                    >
                        <Ionicons
                            name="star"
                            size={48}
                            color={star <= currentRating ? '#FF5722' : '#E5E7EB'}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            {/* Header */}
            <View className="bg-white px-6 py-4 flex-row items-center">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mr-4"
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900">How was your order?</Text>
            </View>

            <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
                {/* Rate the Restaurant Card */}
                <View className="bg-white rounded-3xl p-6 mb-4 shadow-sm">
                    <Text className="text-xl font-bold text-gray-900 mb-1">Rate the Restaurant</Text>
                    <Text className="text-sm text-gray-400 mb-4">How was the quality of your meal?</Text>

                    {renderStars(restaurantRating)}

                    {/* Food Review */}
                    <View className="mt-4">
                        <Text className="text-base font-bold text-gray-900 mb-3">Food Review</Text>
                        <TextInput
                            value={foodReview}
                            onChangeText={setFoodReview}
                            placeholder="Tell us about the food..."
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-900 min-h-[100px]"
                            style={{ fontFamily: 'System' }}
                        />
                    </View>
                </View>

                {/* Rate the Delivery Card */}
                <View className="bg-white rounded-3xl p-6 mb-4 shadow-sm">
                    <View className="flex-row items-center mb-4">
                        <Image
                            source={{ uri: courier.avatar }}
                            className="w-12 h-12 rounded-full mr-3"
                        />
                        <View className="flex-1">
                            <Text className="text-xl font-bold text-gray-900">Rate the Delivery</Text>
                            <Text className="text-sm text-gray-400">Your courier, {courier.name}</Text>
                        </View>
                    </View>

                    {/* Good / Bad Buttons */}
                    <View className="flex-row gap-3 mb-4">
                        <TouchableOpacity
                            onPress={() => setDeliveryRating('good')}
                            className={`flex-1 py-4 rounded-2xl border-2 items-center ${deliveryRating === 'good'
                                    ? 'bg-[#FF5722]/5 border-[#FF5722]'
                                    : 'bg-white border-gray-200'
                                }`}
                        >
                            <Ionicons
                                name="thumbs-up"
                                size={32}
                                color={deliveryRating === 'good' ? '#FF5722' : '#9CA3AF'}
                            />
                            <Text className={`text-base font-bold mt-2 ${deliveryRating === 'good' ? 'text-[#FF5722]' : 'text-gray-400'
                                }`}>
                                Good
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setDeliveryRating('bad')}
                            className={`flex-1 py-4 rounded-2xl border-2 items-center ${deliveryRating === 'bad'
                                    ? 'bg-gray-100 border-gray-400'
                                    : 'bg-white border-gray-200'
                                }`}
                        >
                            <Ionicons
                                name="thumbs-down"
                                size={32}
                                color={deliveryRating === 'bad' ? '#6B7280' : '#9CA3AF'}
                            />
                            <Text className={`text-base font-bold mt-2 ${deliveryRating === 'bad' ? 'text-gray-600' : 'text-gray-400'
                                }`}>
                                Bad
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Delivery Tags */}
                    <View className="flex-row flex-wrap gap-2">
                        {DELIVERY_TAGS.map((tag) => {
                            const isSelected = selectedTags.includes(tag.id);
                            return (
                                <TouchableOpacity
                                    key={tag.id}
                                    onPress={() => toggleTag(tag.id)}
                                    className={`px-4 py-2 rounded-full border ${isSelected
                                            ? 'bg-gray-900 border-gray-900'
                                            : 'bg-white border-gray-200'
                                        }`}
                                >
                                    <Text className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-700'
                                        }`}>
                                        {tag.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Restaurant Popularity */}
                <View className="mb-4">
                    <Text className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 px-2">
                        RESTAURANT POPULARITY
                    </Text>
                    <View className="bg-white rounded-3xl p-6 shadow-sm">
                        <View className="flex-row items-start mb-6">
                            <View className="mr-6">
                                <Text className="text-5xl font-black text-gray-900">4.8</Text>
                                <View className="flex-row items-center mt-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Ionicons
                                            key={star}
                                            name="star"
                                            size={16}
                                            color={star <= 4 ? '#FF5722' : '#E5E7EB'}
                                            style={{ marginRight: 2 }}
                                        />
                                    ))}
                                </View>
                                <Text className="text-xs text-gray-400 mt-1">1,240 reviews</Text>
                            </View>

                            <View className="flex-1">
                                {/* 5 stars */}
                                <View className="flex-row items-center mb-2">
                                    <Text className="text-sm font-medium text-gray-900 w-3">5</Text>
                                    <View className="flex-1 mx-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <View className="h-full bg-[#FF5722] rounded-full" style={{ width: '85%' }} />
                                    </View>
                                    <Text className="text-xs text-gray-400 w-10 text-right">85%</Text>
                                </View>

                                {/* 4 stars */}
                                <View className="flex-row items-center mb-2">
                                    <Text className="text-sm font-medium text-gray-900 w-3">4</Text>
                                    <View className="flex-1 mx-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <View className="h-full bg-[#FF5722] rounded-full" style={{ width: '10%' }} />
                                    </View>
                                    <Text className="text-xs text-gray-400 w-10 text-right">10%</Text>
                                </View>

                                {/* 3 stars */}
                                <View className="flex-row items-center">
                                    <Text className="text-sm font-medium text-gray-900 w-3">3</Text>
                                    <View className="flex-1 mx-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <View className="h-full bg-[#FF5722] rounded-full" style={{ width: '3%' }} />
                                    </View>
                                    <Text className="text-xs text-gray-400 w-10 text-right">3%</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Spacing for button */}
                <View className="h-24" />
            </ScrollView>

            {/* Submit Button */}
            <View className="bg-white px-4 pt-4 pb-8 border-t border-gray-100">
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={restaurantRating === 0 || deliveryRating === null}
                    className={`h-14 rounded-full items-center justify-center ${restaurantRating === 0 || deliveryRating === null
                            ? 'bg-gray-300'
                            : 'bg-[#FF5722]'
                        }`}
                >
                    <Text className={`font-bold text-base ${restaurantRating === 0 || deliveryRating === null
                            ? 'text-gray-500'
                            : 'text-white'
                        }`}>
                        Submit Review
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
