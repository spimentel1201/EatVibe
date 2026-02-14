import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type TransactionType = 'delivery' | 'payout' | 'bonus' | 'tip';

interface Transaction {
    id: string;
    type: TransactionType;
    title: string;
    date: string;
    amount: number;
}

export default function EarningsScreen() {
    const router = useRouter();


    // Mock data
    const weeklyEarnings = {
        period: 'Oct 16 - Oct 22',
        days: [
            { day: 'M', amount: 45.50 },
            { day: 'T', amount: 78.20 },
            { day: 'W', amount: 92.30 },
            { day: 'T', amount: 65.80 },
            { day: 'F', amount: 120.50 },
            { day: 'S', amount: 150.70 },
            { day: 'S', amount: 89.50 },
        ],
        total: 642.50,
    };

    const availableBalance = 250.00;

    const recentTransactions: Transaction[] = [
        {
            id: '1',
            type: 'delivery',
            title: 'Delivery #4920',
            date: 'Oct 20, 14:32',
            amount: 12.50,
        },
        {
            id: '2',
            type: 'payout',
            title: 'Payout to Bank',
            date: 'Oct 19, 09:15',
            amount: -100.00,
        },
        {
            id: '3',
            type: 'delivery',
            title: 'Delivery #4891',
            date: 'Oct 18, 19:44',
            amount: 18.20,
        },
        {
            id: '4',
            type: 'bonus',
            title: 'Peak Hour Bonus',
            date: 'Oct 18, 20:00',
            amount: 15.00,
        },
        {
            id: '5',
            type: 'tip',
            title: 'Customer Tip',
            date: 'Oct 17, 18:22',
            amount: 5.50,
        },
    ];

    const maxEarning = Math.max(...weeklyEarnings.days.map(d => d.amount));

    const handleCashOut = () => {
        // TODO: Navigate to cash out screen
        router.push('/(courier)/earnings/cash-out' as any);
    };

    const handleSeeAllTransactions = () => {
        // TODO: Navigate to all transactions screen
        router.push('/(courier)/earnings/transactions' as any);
    };

    const getTransactionIcon = (type: TransactionType) => {
        switch (type) {
            case 'delivery':
                return { name: 'bicycle' as const, color: '#10B981', bg: '#065F46' };
            case 'payout':
                return { name: 'card-outline' as const, color: '#3B82F6', bg: '#1E3A8A' };
            case 'bonus':
                return { name: 'star' as const, color: '#F59E0B', bg: '#78350F' };
            case 'tip':
                return { name: 'cash-outline' as const, color: '#8B5CF6', bg: '#4C1D95' };
            default:
                return { name: 'wallet-outline' as const, color: '#6B7280', bg: '#374151' };
        }
    };

    return (
        <View className="flex-1 bg-[#0A0E27]">
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <View className="px-6 py-4 flex-row justify-between items-center">
                    <View>
                        <Text className="text-white text-3xl font-bold mb-1">
                            Earnings Hub
                        </Text>
                        <Text className="text-gray-400 text-sm">
                            {weeklyEarnings.period}
                        </Text>
                    </View>
                    <TouchableOpacity className="w-12 h-12 rounded-full bg-[#1A1F3A] items-center justify-center">
                        <Ionicons name="calendar-outline" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Weekly Earnings Chart */}
                    <View className="mx-6 mb-6 bg-[#1A1F3A] rounded-3xl p-6 border border-[#2A2F4A]">
                        {/* Chart */}
                        <View className="flex-row items-end justify-between mb-6" style={{ height: 120 }}>
                            {weeklyEarnings.days.map((day, index) => {
                                const heightPercentage = (day.amount / maxEarning) * 100;
                                return (
                                    <View key={index} className="flex-1 items-center justify-end">
                                        {/* Bar */}
                                        <View
                                            className="w-8 bg-[#2A2F4A] rounded-t-lg mb-2"
                                            style={{
                                                height: `${Math.max(heightPercentage, 10)}%`,
                                            }}
                                        />
                                        {/* Day label */}
                                        <Text className="text-gray-500 text-xs font-semibold">
                                            {day.day}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>

                        {/* Weekly Total */}
                        <View className="flex-row justify-between items-center pt-4 border-t border-[#2A2F4A]">
                            <Text className="text-gray-400 text-sm">Weekly Total</Text>
                            <Text className="text-[#10B981] text-xl font-bold">
                                +${weeklyEarnings.total.toFixed(2)}
                            </Text>
                        </View>
                    </View>

                    {/* Available for Withdrawal */}
                    <View className="mx-6 mb-6 bg-[#1E3A8A] rounded-3xl p-6 border border-[#3B82F6]/30">
                        <Text className="text-[#3B82F6] text-xs font-bold tracking-widest mb-3 text-center">
                            AVAILABLE FOR WITHDRAWAL
                        </Text>

                        <Text className="text-white text-5xl font-bold text-center mb-6">
                            ${availableBalance.toFixed(2)}
                        </Text>

                        <TouchableOpacity
                            onPress={handleCashOut}
                            className="bg-[#3B82F6] rounded-full py-4 flex-row items-center justify-center mb-3"
                        >
                            <Ionicons name="card-outline" size={20} color="#FFF" />
                            <Text className="text-white font-bold text-base ml-2">
                                Cash Out Now
                            </Text>
                        </TouchableOpacity>

                        <View className="flex-row items-center justify-center">
                            <Ionicons name="information-circle-outline" size={14} color="#9CA3AF" />
                            <Text className="text-gray-400 text-xs ml-1">
                                Funds are typically available within 15 minutes
                            </Text>
                        </View>
                    </View>

                    {/* Recent Transactions */}
                    <View className="px-6 mb-6">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-white text-xl font-bold">
                                Recent Transactions
                            </Text>
                            <TouchableOpacity onPress={handleSeeAllTransactions}>
                                <Text className="text-[#3B82F6] text-sm font-semibold">
                                    See All
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Transaction List */}
                        <View className="gap-3">
                            {recentTransactions.map((transaction) => {
                                const icon = getTransactionIcon(transaction.type);
                                const isNegative = transaction.amount < 0;

                                return (
                                    <View
                                        key={transaction.id}
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
                                            <Text className="text-white font-semibold mb-1">
                                                {transaction.title}
                                            </Text>
                                            <Text className="text-gray-400 text-xs">
                                                {transaction.date}
                                            </Text>
                                        </View>

                                        {/* Amount */}
                                        <Text
                                            className={`text-lg font-bold ${isNegative ? 'text-gray-400' : 'text-[#10B981]'
                                                }`}
                                        >
                                            {isNegative ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* Bottom spacing */}
                    <View className="h-24" />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
