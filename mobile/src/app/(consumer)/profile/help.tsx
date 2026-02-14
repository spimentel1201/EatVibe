import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, LayoutAnimation, UIManager, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQS = [
    {
        id: 'faq-1',
        question: 'How do I change my address?',
        answer: 'You can manage your addresses in your Profile > Manage Addresses. You can add new ones or edit existing ones.',
    },
    {
        id: 'faq-2',
        question: 'What payment methods are accepted?',
        answer: 'We accept all major credit cards (Visa, MasterCard, Amex) and PayPal. Integration with Apple Pay is coming soon.',
    },
    {
        id: 'faq-3',
        question: 'My order is taking too long.',
        answer: 'We apologize for the delay. You can track your order in real-time in the "Orders" tab. If it exceeds the ETA significantly, please contact support.',
    },
    {
        id: 'faq-4',
        question: 'How do I cancel an order?',
        answer: 'You can cancel an order within 5 minutes of placing it. Go to Order Details and tap "Cancel Order". If preparation has started, charges may apply.',
    },
    {
        id: 'faq-5',
        question: 'Where is my refund?',
        answer: 'Refunds are processed immediately but may take 3-5 business days to appear on your bank statement depending on your bank.',
    },
];

export default function HelpCenterScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    const filteredFaqs = FAQS.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            {/* Header */}
            <View className="px-6 py-4 border-b border-gray-100">
                <View className="flex-row items-center mb-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-4"
                    >
                        <Ionicons name="arrow-back" size={20} color="#1F2937" />
                    </TouchableOpacity>
                    <Text className="text-2xl font-black text-gray-900">Help Center</Text>
                </View>

                {/* Search Bar */}
                <View className="bg-gray-50 rounded-2xl px-4 py-3 flex-row items-center">
                    <View className="mr-3">
                        <Ionicons name="search" size={20} color="#9CA3AF" />
                    </View>
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search for help..."
                        className="flex-1 text-gray-900 font-bold text-base"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                {filteredFaqs.length === 0 ? (
                    <View className="items-center py-10">
                        <Text className="text-gray-500 font-bold">No results found for "{searchQuery}"</Text>
                    </View>
                ) : (
                    <View className="space-y-4 pb-12">
                        {filteredFaqs.map((faq, _index) => {
                            const isExpanded = expandedIds.includes(faq.id);
                            return (
                                <TouchableOpacity
                                    key={faq.id}
                                    onPress={() => toggleExpand(faq.id)}
                                    activeOpacity={0.7}
                                    className={`bg-gray-50 rounded-[20px] p-5 border ${isExpanded ? 'border-[#FF5722]' : 'border-gray-100'}`}
                                >
                                    <View className="flex-row justify-between items-center">
                                        <Text className={`text-base font-bold flex-1 mr-4 ${isExpanded ? 'text-[#FF5722]' : 'text-gray-900'}`}>{faq.question}</Text>
                                        <Ionicons
                                            name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                            size={20}
                                            color={isExpanded ? '#FF5722' : '#9CA3AF'}
                                        />
                                    </View>
                                    {isExpanded && (
                                        <View>
                                            <Text className="text-gray-600 mt-3 leading-6">{faq.answer}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {/* Contact Support Button */}
                <View className="mt-8 mb-12 bg-[#FF5722]/5 p-6 rounded-[24px] items-center">
                    <View className="w-12 h-12 rounded-full bg-[#FF5722]/20 items-center justify-center mb-3">
                        <Ionicons name="chatbubbles-outline" size={24} color="#FF5722" />
                    </View>
                    <Text className="text-lg font-bold text-gray-900 mb-1">Still need help?</Text>
                    <Text className="text-gray-500 text-center mb-4 text-sm">Our support team is available 24/7 to assist you.</Text>
                    <TouchableOpacity
                        onPress={() => router.push('/(consumer)/profile/contact' as any)}
                        className="bg-[#FF5722] py-3 px-8 rounded-full shadow-lg shadow-orange-500/20"
                    >
                        <Text className="text-white font-bold">Contact Support</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
