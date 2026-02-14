import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface PaymentMethod {
    id: string;
    type: 'bank' | 'debit';
    name: string;
    last4: string;
    icon: keyof typeof Ionicons.glyphMap;
}

interface Payout {
    id: string;
    amount: number;
    date: string;
    status: 'completed' | 'pending' | 'failed';
    method: string;
}

export default function CashOutScreen() {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('1');
    const [payoutType, setPayoutType] = useState<'instant' | 'standard'>('instant');

    const availableBalance = 245.50;
    const instantFee = 1.50;

    const paymentMethods: PaymentMethod[] = [
        { id: '1', type: 'bank', name: 'Chase Bank', last4: '4920', icon: 'card' },
        { id: '2', type: 'debit', name: 'Visa Debit', last4: '8765', icon: 'card-outline' },
    ];

    const recentPayouts: Payout[] = [
        { id: '1', amount: 120.00, date: 'Feb 10, 2026', status: 'completed', method: 'Chase ****4920' },
        { id: '2', amount: 85.50, date: 'Feb 7, 2026', status: 'completed', method: 'Chase ****4920' },
        { id: '3', amount: 150.00, date: 'Feb 3, 2026', status: 'completed', method: 'Visa ****8765' },
    ];

    const setQuickAmount = (percentage: number) => {
        const quickAmount = (availableBalance * percentage / 100).toFixed(2);
        setAmount(quickAmount);
    };

    const handleCashOut = () => {
        const cashOutAmount = parseFloat(amount);

        if (!amount || cashOutAmount <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount to cash out.');
            return;
        }

        if (cashOutAmount > availableBalance) {
            Alert.alert('Insufficient Balance', 'You cannot cash out more than your available balance.');
            return;
        }

        const fee = payoutType === 'instant' ? instantFee : 0;
        const totalReceived = cashOutAmount - fee;

        Alert.alert(
            'Confirm Cash Out',
            `You will receive $${totalReceived.toFixed(2)} ${payoutType === 'instant' ? 'in ~15 minutes' : 'in 1-3 business days'}.\n\nFee: $${fee.toFixed(2)}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: () => {
                        Alert.alert(
                            'Cash Out Successful!',
                            `$${totalReceived.toFixed(2)} is on the way to your account.`,
                            [{ text: 'OK', onPress: () => router.back() }]
                        );
                    },
                },
            ]
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return '#10B981';
            case 'pending': return '#F59E0B';
            case 'failed': return '#EF4444';
            default: return '#64748B';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed': return 'Completed';
            case 'pending': return 'Pending';
            case 'failed': return 'Failed';
            default: return status;
        }
    };

    const calculateTotal = () => {
        const cashOutAmount = parseFloat(amount) || 0;
        const fee = payoutType === 'instant' ? instantFee : 0;
        return Math.max(0, cashOutAmount - fee);
    };

    return (
        <View className="flex-1 bg-[#0A0E27]">
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">Cash Out</Text>
                    <View className="w-6" />
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Available Balance */}
                    <View className="px-6 mb-6">
                        <View className="bg-gradient-to-br from-[#3B82F6] to-[#1E40AF] rounded-3xl p-6">
                            <Text className="text-blue-200 text-sm mb-2">AVAILABLE BALANCE</Text>
                            <Text className="text-white text-5xl font-bold mb-4">
                                ${availableBalance.toFixed(2)}
                            </Text>
                            <View className="flex-row items-center">
                                <Ionicons name="information-circle" size={16} color="#93C5FD" />
                                <Text className="text-blue-200 text-xs ml-2">
                                    Earnings from completed deliveries
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Amount Input */}
                    <View className="px-6 mb-6">
                        <Text className="text-gray-400 text-xs font-bold tracking-wider mb-3">
                            CASH OUT AMOUNT
                        </Text>
                        <View className="bg-[#1A1F3A] rounded-2xl p-4 border-2 border-[#3B82F6]">
                            <Text className="text-gray-400 text-sm mb-2">Amount</Text>
                            <View className="flex-row items-center">
                                <Text className="text-white text-3xl font-bold mr-2">$</Text>
                                <TextInput
                                    value={amount}
                                    onChangeText={setAmount}
                                    placeholder="0.00"
                                    placeholderTextColor="#64748B"
                                    keyboardType="decimal-pad"
                                    className="text-white text-3xl font-bold flex-1"
                                />
                            </View>
                        </View>

                        {/* Quick Amount Buttons */}
                        <View className="flex-row gap-3 mt-4">
                            {[25, 50, 75, 100].map((percentage) => (
                                <TouchableOpacity
                                    key={percentage}
                                    onPress={() => setQuickAmount(percentage)}
                                    className="flex-1 bg-[#1A1F3A] rounded-xl py-3 border border-[#2A2F4A]"
                                >
                                    <Text className="text-[#3B82F6] font-bold text-center">
                                        {percentage}%
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Payout Speed */}
                    <View className="px-6 mb-6">
                        <Text className="text-gray-400 text-xs font-bold tracking-wider mb-3">
                            PAYOUT SPEED
                        </Text>

                        {/* Instant Payout */}
                        <TouchableOpacity
                            onPress={() => setPayoutType('instant')}
                            className={`bg-[#1A1F3A] rounded-2xl p-4 mb-3 border-2 ${payoutType === 'instant' ? 'border-[#3B82F6]' : 'border-[#2A2F4A]'
                                }`}
                        >
                            <View className="flex-row items-center justify-between mb-2">
                                <View className="flex-row items-center">
                                    <View className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${payoutType === 'instant' ? 'border-[#3B82F6] bg-[#3B82F6]' : 'border-gray-600'
                                        }`}>
                                        {payoutType === 'instant' && (
                                            <Ionicons name="checkmark" size={16} color="#FFF" />
                                        )}
                                    </View>
                                    <View>
                                        <Text className="text-white font-bold text-base">Instant Payout</Text>
                                        <Text className="text-gray-400 text-sm">~15 minutes</Text>
                                    </View>
                                </View>
                                <Text className="text-[#F59E0B] font-bold">$1.50 fee</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Standard Payout */}
                        <TouchableOpacity
                            onPress={() => setPayoutType('standard')}
                            className={`bg-[#1A1F3A] rounded-2xl p-4 border-2 ${payoutType === 'standard' ? 'border-[#3B82F6]' : 'border-[#2A2F4A]'
                                }`}
                        >
                            <View className="flex-row items-center justify-between mb-2">
                                <View className="flex-row items-center">
                                    <View className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${payoutType === 'standard' ? 'border-[#3B82F6] bg-[#3B82F6]' : 'border-gray-600'
                                        }`}>
                                        {payoutType === 'standard' && (
                                            <Ionicons name="checkmark" size={16} color="#FFF" />
                                        )}
                                    </View>
                                    <View>
                                        <Text className="text-white font-bold text-base">Standard Payout</Text>
                                        <Text className="text-gray-400 text-sm">1-3 business days</Text>
                                    </View>
                                </View>
                                <Text className="text-[#10B981] font-bold">FREE</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Payment Method */}
                    <View className="px-6 mb-6">
                        <Text className="text-gray-400 text-xs font-bold tracking-wider mb-3">
                            PAYMENT METHOD
                        </Text>
                        {paymentMethods.map((method) => (
                            <TouchableOpacity
                                key={method.id}
                                onPress={() => setSelectedMethod(method.id)}
                                className={`bg-[#1A1F3A] rounded-2xl p-4 mb-3 border-2 ${selectedMethod === method.id ? 'border-[#3B82F6]' : 'border-[#2A2F4A]'
                                    }`}
                            >
                                <View className="flex-row items-center">
                                    <View className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${selectedMethod === method.id ? 'border-[#3B82F6] bg-[#3B82F6]' : 'border-gray-600'
                                        }`}>
                                        {selectedMethod === method.id && (
                                            <Ionicons name="checkmark" size={16} color="#FFF" />
                                        )}
                                    </View>
                                    <Ionicons name={method.icon} size={24} color="#3B82F6" />
                                    <View className="ml-3">
                                        <Text className="text-white font-bold">{method.name}</Text>
                                        <Text className="text-gray-400 text-sm">****{method.last4}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Summary */}
                    {amount && parseFloat(amount) > 0 && (
                        <View className="px-6 mb-6">
                            <View className="bg-[#1A1F3A] rounded-2xl p-4 border border-[#2A2F4A]">
                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="text-gray-400">Cash Out Amount</Text>
                                    <Text className="text-white font-semibold">
                                        ${parseFloat(amount).toFixed(2)}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="text-gray-400">Fee</Text>
                                    <Text className="text-white font-semibold">
                                        ${(payoutType === 'instant' ? instantFee : 0).toFixed(2)}
                                    </Text>
                                </View>
                                <View className="h-px bg-[#2A2F4A] my-2" />
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-white font-bold text-lg">You'll Receive</Text>
                                    <Text className="text-[#10B981] font-bold text-2xl">
                                        ${calculateTotal().toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Recent Payouts */}
                    <View className="px-6 mb-6">
                        <Text className="text-gray-400 text-xs font-bold tracking-wider mb-3">
                            RECENT PAYOUTS
                        </Text>
                        {recentPayouts.map((payout) => (
                            <View
                                key={payout.id}
                                className="bg-[#1A1F3A] rounded-2xl p-4 mb-3 border border-[#2A2F4A]"
                            >
                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="text-white font-bold text-lg">
                                        ${payout.amount.toFixed(2)}
                                    </Text>
                                    <View
                                        className="px-3 py-1 rounded-full"
                                        style={{ backgroundColor: `${getStatusColor(payout.status)}20` }}
                                    >
                                        <Text
                                            className="text-xs font-bold"
                                            style={{ color: getStatusColor(payout.status) }}
                                        >
                                            {getStatusText(payout.status)}
                                        </Text>
                                    </View>
                                </View>
                                <Text className="text-gray-400 text-sm">{payout.method}</Text>
                                <Text className="text-gray-500 text-xs mt-1">{payout.date}</Text>
                            </View>
                        ))}
                    </View>

                    <View className="h-32" />
                </ScrollView>

                {/* Bottom Button */}
                <SafeAreaView edges={['bottom']} className="bg-[#0A0E27]">
                    <View className="px-6 py-4 border-t border-[#1E293B]">
                        <TouchableOpacity
                            onPress={handleCashOut}
                            className={`rounded-full py-4 ${amount && parseFloat(amount) > 0
                                    ? 'bg-[#10B981]'
                                    : 'bg-gray-700'
                                }`}
                            disabled={!amount || parseFloat(amount) <= 0}
                        >
                            <Text className="text-white font-bold text-center text-lg">
                                Cash Out ${calculateTotal().toFixed(2)}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </SafeAreaView>
        </View>
    );
}
