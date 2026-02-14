import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
}

interface HelpCategory {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    color: string;
}

export default function SupportCenterScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

    const helpCategories: HelpCategory[] = [
        { id: 'earnings', icon: 'cash', label: 'Earnings & Payouts', color: '#10B981' },
        { id: 'deliveries', icon: 'bicycle', label: 'Deliveries', color: '#3B82F6' },
        { id: 'account', icon: 'person', label: 'Account', color: '#8B5CF6' },
        { id: 'technical', icon: 'settings', label: 'Technical', color: '#F59E0B' },
    ];

    const faqs: FAQ[] = [
        {
            id: '1',
            category: 'earnings',
            question: 'When will I receive my payout?',
            answer: 'Standard payouts take 1-3 business days. Instant payouts arrive in ~15 minutes for a $1.50 fee.',
        },
        {
            id: '2',
            category: 'earnings',
            question: 'How are my earnings calculated?',
            answer: 'Earnings include base fare, distance bonus, surge pricing, and customer tips.',
        },
        {
            id: '3',
            category: 'deliveries',
            question: 'What if the customer is not available?',
            answer: 'Try calling or messaging them. If they don\'t respond after 5 minutes, contact support.',
        },
        {
            id: '4',
            category: 'deliveries',
            question: 'Can I decline an order?',
            answer: 'Yes, but frequent declines may affect your acceptance rate and priority for future orders.',
        },
        {
            id: '5',
            category: 'account',
            question: 'How do I update my vehicle information?',
            answer: 'Go to Profile > My Vehicle to update your vehicle details and insurance.',
        },
        {
            id: '6',
            category: 'technical',
            question: 'The app is not working properly',
            answer: 'Try restarting the app. If the issue persists, check for updates or contact support.',
        },
    ];

    const filteredFAQs = faqs.filter((faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCall = () => {
        Linking.openURL('tel:+18005551234');
    };

    const handleEmail = () => {
        Linking.openURL('mailto:support@eatvibe.com');
    };

    const handleChat = () => {
        console.log('Open chat');
    };

    return (
        <View className="flex-1 bg-[#0A0E27]">
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">Support Center</Text>
                    <View className="w-6" />
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Search Bar */}
                    <View className="px-6 mb-6">
                        <View className="bg-[#1A1F3A] rounded-full px-4 py-3 flex-row items-center border border-[#2A2F4A]">
                            <Ionicons name="search" size={20} color="#64748B" />
                            <TextInput
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder="Search for help..."
                                placeholderTextColor="#64748B"
                                className="flex-1 text-white ml-3"
                            />
                        </View>
                    </View>

                    {/* Contact Options */}
                    <View className="px-6 mb-6">
                        <Text className="text-gray-400 text-xs font-bold tracking-wider mb-3">
                            CONTACT US
                        </Text>
                        <View className="bg-[#1A1F3A] rounded-2xl border border-[#2A2F4A] overflow-hidden">
                            <TouchableOpacity
                                onPress={handleChat}
                                className="flex-row items-center p-4 border-b border-[#2A2F4A]"
                            >
                                <View className="w-12 h-12 rounded-full bg-[#10B981]/20 items-center justify-center mr-4">
                                    <Ionicons name="chatbubbles" size={24} color="#10B981" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-bold text-base mb-1">
                                        Live Chat
                                    </Text>
                                    <Text className="text-gray-400 text-sm">
                                        Available 24/7 • Avg. response: 2 min
                                    </Text>
                                </View>
                                <View className="w-2 h-2 rounded-full bg-[#10B981]" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleCall}
                                className="flex-row items-center p-4 border-b border-[#2A2F4A]"
                            >
                                <View className="w-12 h-12 rounded-full bg-[#3B82F6]/20 items-center justify-center mr-4">
                                    <Ionicons name="call" size={24} color="#3B82F6" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-bold text-base mb-1">
                                        Phone Support
                                    </Text>
                                    <Text className="text-gray-400 text-sm">
                                        1-800-555-1234 • 24/7
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#64748B" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleEmail}
                                className="flex-row items-center p-4"
                            >
                                <View className="w-12 h-12 rounded-full bg-[#8B5CF6]/20 items-center justify-center mr-4">
                                    <Ionicons name="mail" size={24} color="#8B5CF6" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-bold text-base mb-1">
                                        Email Support
                                    </Text>
                                    <Text className="text-gray-400 text-sm">
                                        support@eatvibe.com
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#64748B" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Help Categories */}
                    {!searchQuery && (
                        <View className="px-6 mb-6">
                            <Text className="text-gray-400 text-xs font-bold tracking-wider mb-3">
                                BROWSE BY CATEGORY
                            </Text>
                            <View className="flex-row flex-wrap gap-3">
                                {helpCategories.map((category) => (
                                    <TouchableOpacity
                                        key={category.id}
                                        className="flex-1 min-w-[45%] bg-[#1A1F3A] rounded-2xl p-4 border border-[#2A2F4A]"
                                    >
                                        <View
                                            className="w-12 h-12 rounded-full items-center justify-center mb-3"
                                            style={{ backgroundColor: `${category.color}20` }}
                                        >
                                            <Ionicons
                                                name={category.icon}
                                                size={24}
                                                color={category.color}
                                            />
                                        </View>
                                        <Text className="text-white font-semibold">
                                            {category.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* FAQs */}
                    <View className="px-6 mb-6">
                        <Text className="text-gray-400 text-xs font-bold tracking-wider mb-3">
                            {searchQuery ? 'SEARCH RESULTS' : 'POPULAR QUESTIONS'}
                        </Text>
                        {filteredFAQs.length > 0 ? (
                            filteredFAQs.map((faq) => (
                                <TouchableOpacity
                                    key={faq.id}
                                    onPress={() =>
                                        setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
                                    }
                                    className="bg-[#1A1F3A] rounded-2xl p-4 mb-3 border border-[#2A2F4A]"
                                >
                                    <View className="flex-row items-center justify-between">
                                        <Text className="text-white font-semibold flex-1 mr-3">
                                            {faq.question}
                                        </Text>
                                        <Ionicons
                                            name={expandedFAQ === faq.id ? 'chevron-up' : 'chevron-down'}
                                            size={20}
                                            color="#64748B"
                                        />
                                    </View>
                                    {expandedFAQ === faq.id && (
                                        <Text className="text-gray-400 text-sm mt-3 leading-5">
                                            {faq.answer}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View className="bg-[#1A1F3A] rounded-2xl p-8 items-center border border-[#2A2F4A]">
                                <Ionicons name="search" size={48} color="#64748B" />
                                <Text className="text-gray-400 text-center mt-4">
                                    No results found for "{searchQuery}"
                                </Text>
                                <Text className="text-gray-500 text-sm text-center mt-2">
                                    Try different keywords or contact support
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Still Need Help */}
                    <View className="px-6 mb-8">
                        <View className="bg-[#3B82F6]/20 rounded-2xl p-6 border border-[#3B82F6]/30">
                            <Text className="text-white font-bold text-lg mb-2">
                                Still need help?
                            </Text>
                            <Text className="text-blue-200 mb-4">
                                Our support team is available 24/7 to assist you
                            </Text>
                            <TouchableOpacity
                                onPress={handleChat}
                                className="bg-[#3B82F6] rounded-full py-3 flex-row items-center justify-center"
                            >
                                <Ionicons name="chatbubbles" size={20} color="#FFF" />
                                <Text className="text-white font-bold ml-2">Start Live Chat</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="h-8" />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
