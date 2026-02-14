import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type FilterType = 'all' | 'earnings' | 'withdrawals';
type TransactionType = 'delivery' | 'payout' | 'bonus' | 'tip' | 'adjustment';

interface Transaction {
    id: string;
    type: TransactionType;
    title: string;
    subtitle: string;
    amount: number;
    date: string;
    time: string;
}

interface TransactionGroup {
    date: string;
    label: string;
    transactions: Transaction[];
}

export default function FinancialHistoryScreen() {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('earnings');

    // Mock data
    const allTransactions: TransactionGroup[] = [
        {
            date: '2024-10-25',
            label: 'TODAY, OCT 25',
            transactions: [
                {
                    id: '1',
                    type: 'delivery',
                    title: 'Order #4521',
                    subtitle: '12:30 PM • 3.2 miles',
                    amount: 8.50,
                    date: '2024-10-25',
                    time: '12:30 PM',
                },
                {
                    id: '2',
                    type: 'delivery',
                    title: 'Order #4498',
                    subtitle: '10:15 AM • 1.5 miles',
                    amount: 6.25,
                    date: '2024-10-25',
                    time: '10:15 AM',
                },
            ],
        },
        {
            date: '2024-10-24',
            label: 'YESTERDAY, OCT 24',
            transactions: [
                {
                    id: '3',
                    type: 'payout',
                    title: 'Weekly Payout',
                    subtitle: '04:45 PM • Bank Transfer',
                    amount: -120.00,
                    date: '2024-10-24',
                    time: '04:45 PM',
                },
                {
                    id: '4',
                    type: 'bonus',
                    title: 'Peak Hour Bonus',
                    subtitle: '02:10 PM • 5 Trips Goal',
                    amount: 15.00,
                    date: '2024-10-24',
                    time: '02:10 PM',
                },
            ],
        },
        {
            date: '2024-10-23',
            label: 'OCT 23, 2023',
            transactions: [
                {
                    id: '5',
                    type: 'delivery',
                    title: 'Order #4312',
                    subtitle: '08:50 PM • 4.1 miles',
                    amount: 12.30,
                    date: '2024-10-23',
                    time: '08:50 PM',
                },
                {
                    id: '6',
                    type: 'delivery',
                    title: 'Order #4289',
                    subtitle: '07:20 PM • 2.8 miles',
                    amount: 9.75,
                    date: '2024-10-23',
                    time: '07:20 PM',
                },
                {
                    id: '7',
                    type: 'tip',
                    title: 'Customer Tip',
                    subtitle: '06:30 PM • Order #4267',
                    amount: 5.00,
                    date: '2024-10-23',
                    time: '06:30 PM',
                },
            ],
        },
    ];

    const getTransactionIcon = (type: TransactionType) => {
        switch (type) {
            case 'delivery':
                return { name: 'bicycle' as const, color: '#3B82F6', bg: '#1E3A8A' };
            case 'payout':
                return { name: 'card' as const, color: '#EF4444', bg: '#7F1D1D' };
            case 'bonus':
                return { name: 'star' as const, color: '#F59E0B', bg: '#78350F' };
            case 'tip':
                return { name: 'cash' as const, color: '#8B5CF6', bg: '#4C1D95' };
            case 'adjustment':
                return { name: 'swap-horizontal' as const, color: '#6B7280', bg: '#374151' };
            default:
                return { name: 'wallet' as const, color: '#6B7280', bg: '#374151' };
        }
    };

    const filterTransactions = (groups: TransactionGroup[]): TransactionGroup[] => {
        return groups.map(group => ({
            ...group,
            transactions: group.transactions.filter(t => {
                // Filter by type
                if (activeFilter === 'earnings' && t.amount < 0) return false;
                if (activeFilter === 'withdrawals' && t.amount > 0) return false;

                // Filter by search query
                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    return (
                        t.title.toLowerCase().includes(query) ||
                        t.subtitle.toLowerCase().includes(query)
                    );
                }

                return true;
            }),
        })).filter(group => group.transactions.length > 0);
    };

    const filteredData = filterTransactions(allTransactions);

    const handleDatePicker = () => {
        // TODO: Open date range picker
        console.log('Open date picker');
    };

    const handleTransactionPress = (transactionId: string) => {
        // TODO: Navigate to transaction details
        router.push(`/courier/earnings/transaction/${transactionId}` as any);
    };

    return (
        <View className="flex-1 bg-[#0A0E27]">
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <View className="px-6 py-4">
                    <Text className="text-white text-3xl font-bold mb-4">
                        Financial History
                    </Text>

                    {/* Search Bar and Calendar */}
                    <View className="flex-row items-center gap-3 mb-4">
                        {/* Search Input */}
                        <View className="flex-1 bg-[#1A1F3A] rounded-full px-4 py-3 flex-row items-center border border-[#2A2F4A]">
                            <Ionicons name="search" size={20} color="#64748B" />
                            <TextInput
                                className="flex-1 ml-2 text-white"
                                placeholder="Search transactions..."
                                placeholderTextColor="#64748B"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>

                        {/* Calendar Button */}
                        <TouchableOpacity
                            onPress={handleDatePicker}
                            className="w-12 h-12 rounded-full bg-[#1A1F3A] items-center justify-center border border-[#2A2F4A]"
                        >
                            <Ionicons name="calendar-outline" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Filter Pills */}
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={() => setActiveFilter('all')}
                            className={`px-6 py-3 rounded-full ${activeFilter === 'all'
                                ? 'bg-[#3B82F6]'
                                : 'bg-[#1A1F3A] border border-[#2A2F4A]'
                                }`}
                        >
                            <Text
                                className={`font-semibold ${activeFilter === 'all' ? 'text-white' : 'text-gray-400'
                                    }`}
                            >
                                All
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setActiveFilter('earnings')}
                            className={`px-6 py-3 rounded-full ${activeFilter === 'earnings'
                                ? 'bg-[#3B82F6]'
                                : 'bg-[#1A1F3A] border border-[#2A2F4A]'
                                }`}
                        >
                            <Text
                                className={`font-semibold ${activeFilter === 'earnings' ? 'text-white' : 'text-gray-400'
                                    }`}
                            >
                                Earnings
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setActiveFilter('withdrawals')}
                            className={`px-6 py-3 rounded-full ${activeFilter === 'withdrawals'
                                ? 'bg-[#3B82F6]'
                                : 'bg-[#1A1F3A] border border-[#2A2F4A]'
                                }`}
                        >
                            <Text
                                className={`font-semibold ${activeFilter === 'withdrawals' ? 'text-white' : 'text-gray-400'
                                    }`}
                            >
                                Withdrawals
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Transactions List */}
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {filteredData.map((group, groupIndex) => (
                        <View key={groupIndex} className="mb-6">
                            {/* Date Header */}
                            <View className="px-6 mb-3">
                                <Text className="text-gray-500 text-xs font-bold tracking-wider">
                                    {group.label}
                                </Text>
                            </View>

                            {/* Transaction Cards */}
                            <View className="px-6 gap-3">
                                {group.transactions.map((transaction) => {
                                    const icon = getTransactionIcon(transaction.type);
                                    const isNegative = transaction.amount < 0;

                                    return (
                                        <TouchableOpacity
                                            key={transaction.id}
                                            onPress={() => handleTransactionPress(transaction.id)}
                                            className="bg-[#1A1F3A] rounded-2xl p-4 flex-row items-center border border-[#2A2F4A]"
                                        >
                                            {/* Icon */}
                                            <View
                                                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                                                style={{ backgroundColor: icon.bg }}
                                            >
                                                <Ionicons name={icon.name} size={24} color={icon.color} />
                                            </View>

                                            {/* Info */}
                                            <View className="flex-1">
                                                <Text className="text-white font-bold text-base mb-1">
                                                    {transaction.title}
                                                </Text>
                                                <Text className="text-gray-400 text-xs">
                                                    {transaction.subtitle}
                                                </Text>
                                            </View>

                                            {/* Amount */}
                                            <Text
                                                className={`text-lg font-bold ${isNegative ? 'text-[#EF4444]' : 'text-[#10B981]'
                                                    }`}
                                            >
                                                {isNegative ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    ))}

                    {/* Empty State */}
                    {filteredData.length === 0 && (
                        <View className="items-center justify-center py-20">
                            <Ionicons name="receipt-outline" size={64} color="#374151" />
                            <Text className="text-gray-500 text-lg mt-4">
                                No transactions found
                            </Text>
                            <Text className="text-gray-600 text-sm mt-2">
                                Try adjusting your filters
                            </Text>
                        </View>
                    )}

                    {/* Bottom spacing */}
                    <View className="h-24" />
                </ScrollView>

                {/* Bottom Navigation */}
                <SafeAreaView edges={['bottom']} className="bg-[#0A0E27]">
                    <View className="flex-row items-center justify-around px-6 py-3 border-t border-[#1E293B]">
                        {/* Dashboard */}
                        <TouchableOpacity
                            onPress={() => {
                                setActiveTab('dashboard');
                                router.push('/courier/dashboard' as any);
                            }}
                            className="items-center py-2"
                        >
                            <Ionicons
                                name="grid-outline"
                                size={24}
                                color={activeTab === 'dashboard' ? '#3B82F6' : '#64748B'}
                            />
                            <Text
                                className={`text-xs mt-1 font-semibold ${activeTab === 'dashboard' ? 'text-[#3B82F6]' : 'text-gray-500'
                                    }`}
                            >
                                Dashboard
                            </Text>
                        </TouchableOpacity>

                        {/* Trips */}
                        <TouchableOpacity
                            onPress={() => {
                                setActiveTab('trips');
                                router.push('/courier/trips' as any);
                            }}
                            className="items-center py-2"
                        >
                            <Ionicons
                                name="time-outline"
                                size={24}
                                color={activeTab === 'trips' ? '#3B82F6' : '#64748B'}
                            />
                            <Text
                                className={`text-xs mt-1 font-semibold ${activeTab === 'trips' ? 'text-[#3B82F6]' : 'text-gray-500'
                                    }`}
                            >
                                Trips
                            </Text>
                        </TouchableOpacity>

                        {/* Earnings */}
                        <TouchableOpacity
                            onPress={() => setActiveTab('earnings')}
                            className="items-center py-2 relative"
                        >
                            <Ionicons
                                name="card"
                                size={24}
                                color={activeTab === 'earnings' ? '#3B82F6' : '#64748B'}
                            />
                            <Text
                                className={`text-xs mt-1 font-semibold ${activeTab === 'earnings' ? 'text-[#3B82F6]' : 'text-gray-500'
                                    }`}
                            >
                                Earnings
                            </Text>
                            {activeTab === 'earnings' && (
                                <View className="absolute -top-1 w-1 h-1 rounded-full bg-[#3B82F6]" />
                            )}
                        </TouchableOpacity>

                        {/* Profile */}
                        <TouchableOpacity
                            onPress={() => {
                                setActiveTab('profile');
                                router.push('/courier/profile' as any);
                            }}
                            className="items-center py-2"
                        >
                            <Ionicons
                                name="person-outline"
                                size={24}
                                color={activeTab === 'profile' ? '#3B82F6' : '#64748B'}
                            />
                            <Text
                                className={`text-xs mt-1 font-semibold ${activeTab === 'profile' ? 'text-[#3B82F6]' : 'text-gray-500'
                                    }`}
                            >
                                Profile
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </SafeAreaView>
        </View>
    );
}
