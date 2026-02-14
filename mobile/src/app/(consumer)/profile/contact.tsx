import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ContactUsScreen() {
    const router = useRouter();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if (!subject || !message) {
            // TODO: Show toast error
            return;
        }

        setLoading(true);
        setTimeout(() => {
            // Mock submission
            setLoading(false);
            router.back();
            // TODO: Show success toast
        }, 1500);
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
                <Text className="text-2xl font-black text-gray-900">Contact Us</Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                <View className="space-y-6">
                    <View>
                        <Text className="text-gray-500 font-bold mb-2 ml-1">Subject</Text>
                        <TextInput
                            value={subject}
                            onChangeText={setSubject}
                            placeholder="What is this about?"
                            className="bg-gray-50 rounded-2xl px-4 py-4 border border-gray-100 text-gray-900 font-bold text-base"
                        />
                    </View>

                    <View>
                        <Text className="text-gray-500 font-bold mb-2 ml-1">Message</Text>
                        <TextInput
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Type your message here..."
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            className="bg-gray-50 rounded-2xl px-4 py-4 border border-gray-100 text-gray-900 font-bold text-base min-h-[150px]"
                        />
                    </View>
                </View>

                {/* Contact Options */}
                <View className="mt-8 space-y-4">
                    <TouchableOpacity className="flex-row items-center bg-blue-50 p-4 rounded-2xl">
                        <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-4">
                            <Ionicons name="call" size={20} color="#3B82F6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-900 font-bold text-base">Call Support</Text>
                            <Text className="text-gray-500 text-sm">Wait time: ~2 min</Text>
                        </View>
                        <View className="ml-auto">
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center bg-green-50 p-4 rounded-2xl">
                        <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-4">
                            <Ionicons name="logo-whatsapp" size={20} color="#10B981" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-900 font-bold text-base">WhatsApp</Text>
                            <Text className="text-gray-500 text-sm">Online now</Text>
                        </View>
                        <View className="ml-auto">
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Submit Button */}
            <View className="px-6 py-6 border-t border-gray-100">
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading || !subject || !message}
                    className={`h-14 rounded-full items-center justify-center shadow-lg shadow-orange-500/30 flex-row ${loading || !subject || !message ? 'bg-gray-300' : 'bg-[#FF5722]'
                        }`}
                >
                    {loading ? (
                        <Text className="text-white font-black text-lg">Sending...</Text>
                    ) : (
                        <>
                            <View className="mr-2">
                                <Ionicons name="send" size={20} color="white" />
                            </View>
                            <Text className="text-white font-black text-lg">Send Message</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
