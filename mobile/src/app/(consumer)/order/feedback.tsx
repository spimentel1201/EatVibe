import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type RatingCategory = 'restaurant' | 'courier';

const FEEDBACK_TAGS = {
    restaurant: [
        { id: 'delicious', label: 'Delicious', icon: '😋' },
        { id: 'fresh', label: 'Fresh', icon: '🌿' },
        { id: 'hot', label: 'Hot', icon: '🔥' },
        { id: 'good-portion', label: 'Good Portion', icon: '🍽️' },
        { id: 'well-packed', label: 'Well Packed', icon: '📦' },
    ],
    courier: [
        { id: 'fast', label: 'Fast', icon: '⚡' },
        { id: 'friendly', label: 'Friendly', icon: '😊' },
        { id: 'careful', label: 'Careful', icon: '🤲' },
        { id: 'professional', label: 'Professional', icon: '👔' },
        { id: 'on-time', label: 'On Time', icon: '⏰' },
    ],
};

export default function OrderFeedbackScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const orderId = params.id as string;

    const [restaurantRating, setRestaurantRating] = useState(0);
    const [courierRating, setCourierRating] = useState(0);
    const [selectedRestaurantTags, setSelectedRestaurantTags] = useState<string[]>([]);
    const [selectedCourierTags, setSelectedCourierTags] = useState<string[]>([]);
    const [comment, setComment] = useState('');

    const handleStarPress = (category: RatingCategory, rating: number) => {
        if (category === 'restaurant') {
            setRestaurantRating(rating);
        } else {
            setCourierRating(rating);
        }
    };

    const toggleTag = (category: RatingCategory, tagId: string) => {
        if (category === 'restaurant') {
            setSelectedRestaurantTags((prev) =>
                prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
            );
        } else {
            setSelectedCourierTags((prev) =>
                prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
            );
        }
    };

    const handleSubmit = () => {
        if (restaurantRating === 0 || courierRating === 0) {
            // TODO: Show error toast
            console.log('Please rate both restaurant and courier');
            return;
        }

        // TODO: Submit to backend
        console.log({
            orderId,
            restaurantRating,
            courierRating,
            restaurantTags: selectedRestaurantTags,
            courierTags: selectedCourierTags,
            comment,
        });

        // Navigate to confirmation
        router.push('/order/feedback-confirmation' as any);
    };

    const renderStars = (category: RatingCategory, currentRating: number) => {
        return (
            <View className="flex-row items-center justify-center space-x-2 my-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => handleStarPress(category, star)}
                        className="p-2"
                    >
                        <View>
                            <Ionicons
                                name={star <= currentRating ? 'star' : 'star-outline'}
                                size={40}
                                color={star <= currentRating ? '#FBBF24' : '#D1D5DB'}
                            />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const renderTags = (category: RatingCategory) => {
        const tags = FEEDBACK_TAGS[category];
        const selectedTags = category === 'restaurant' ? selectedRestaurantTags : selectedCourierTags;

        return (
            <View className="flex-row flex-wrap gap-2 mt-4">
                {tags.map((tag, _index) => {
                    const isSelected = selectedTags.includes(tag.id);
                    return (
                        <View
                            key={tag.id}
                        >
                            <TouchableOpacity
                                onPress={() => toggleTag(category, tag.id)}
                                className={`px-4 py-2 rounded-full flex-row items-center ${isSelected ? 'bg-[#FF5722]' : 'bg-gray-100'
                                    }`}
                            >
                                <Text className="mr-2">{tag.icon}</Text>
                                <Text
                                    className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-gray-700'
                                        }`}
                                >
                                    {tag.label}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
        );
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
                <View className="flex-1">
                    <Text className="text-2xl font-black text-gray-900">Rate Your Order</Text>
                    <Text className="text-sm text-gray-500 mt-1">Order #{orderId || '12345'}</Text>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Restaurant Rating */}
                <View
                    className="px-6 py-6 border-b border-gray-100"
                >
                    <View className="items-center">
                        <View className="w-16 h-16 rounded-full bg-[#FF5722]/10 items-center justify-center mb-4">
                            <Ionicons name="restaurant" size={32} color="#FF5722" />
                        </View>
                        <Text className="text-xl font-black text-gray-900">How was the food?</Text>
                        <Text className="text-sm text-gray-500 mt-1">Rate the restaurant</Text>
                    </View>
                    {renderStars('restaurant', restaurantRating)}
                    {restaurantRating > 0 && renderTags('restaurant')}
                </View>

                {/* Courier Rating */}
                <View
                    className="px-6 py-6 border-b border-gray-100"
                >
                    <View className="items-center">
                        <View className="w-16 h-16 rounded-full bg-blue-100 items-center justify-center mb-4">
                            <Ionicons name="bicycle" size={32} color="#3B82F6" />
                        </View>
                        <Text className="text-xl font-black text-gray-900">How was the delivery?</Text>
                        <Text className="text-sm text-gray-500 mt-1">Rate the courier</Text>
                    </View>
                    {renderStars('courier', courierRating)}
                    {courierRating > 0 && renderTags('courier')}
                </View>

                {/* Comment Section */}
                <View
                    className="px-6 py-6"
                >
                    <Text className="text-lg font-bold text-gray-900 mb-3">
                        Additional Comments (Optional)
                    </Text>
                    <TextInput
                        value={comment}
                        onChangeText={setComment}
                        placeholder="Tell us more about your experience..."
                        placeholderTextColor="#9CA3AF"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        className="bg-gray-50 rounded-[24px] p-4 text-base text-gray-900 min-h-[120px]"
                        style={{ fontFamily: 'System' }}
                    />
                </View>

                {/* Spacing for button */}
                <View className="h-32" />
            </ScrollView>

            {/* Submit Button */}
            <View className="absolute bottom-0 left-0 right-0 bg-white px-6 pt-4 pb-8 border-t border-gray-100">
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={restaurantRating === 0 || courierRating === 0}
                    className={`h-14 rounded-full items-center justify-center ${restaurantRating === 0 || courierRating === 0
                            ? 'bg-gray-300'
                            : 'bg-[#FF5722] shadow-lg shadow-orange-500/30'
                        }`}
                >
                    <Text
                        className={`font-black text-lg ${restaurantRating === 0 || courierRating === 0 ? 'text-gray-500' : 'text-white'
                            }`}
                    >
                        Submit Review
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
