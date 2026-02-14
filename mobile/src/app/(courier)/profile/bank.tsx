import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface BankAccount {
    id: string;
    bankName: string;
    accountType: 'checking' | 'savings';
    last4: string;
    isPrimary: boolean;
    status: 'verified' | 'pending' | 'failed';
    addedDate: string;
}

export default function BankDetailsScreen() {
    const router = useRouter();

    const [accounts] = useState<BankAccount[]>([
        {
            id: '1',
            bankName: 'Chase Bank',
            accountType: 'checking',
            last4: '4920',
            isPrimary: true,
            status: 'verified',
            addedDate: 'Jan 10, 2024',
        },
        {
            id: '2',
            bankName: 'Bank of America',
            accountType: 'savings',
            last4: '8765',
            isPrimary: false,
            status: 'verified',
            addedDate: 'Feb 5, 2024',
        },
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified': return '#10B981';
            case 'pending': return '#F59E0B';
            case 'failed': return '#EF4444';
            default: return '#64748B';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'verified': return 'Verified';
            case 'pending': return 'Pending Verification';
            case 'failed': return 'Verification Failed';
            default: return status;
        }
    };

    const handleAddAccount = () => {
        Alert.alert('Add Bank Account', 'Connect your bank account securely via Plaid');
    };

    const handleSetPrimary = (_accountId: string) => {
        Alert.alert('Set as Primary', 'This account will be used for all payouts');
    };

    const handleRemoveAccount = (_accountId: string) => {
        Alert.alert(
            'Remove Account',
            'Are you sure you want to remove this account?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', style: 'destructive' },
            ]
        );
    };

    return (
        <View className="flex-1 bg-[#0A0E27]">
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">Bank Details</Text>
                    <View className="w-6" />
                </View>

                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                    {/* Info Banner */}
                    <View className="bg-[#3B82F6]/20 rounded-2xl p-4 mb-6 border border-[#3B82F6]/30">
                        <View className="flex-row items-start">
                            <Ionicons name="shield-checkmark" size={24} color="#3B82F6" />
                            <View className="flex-1 ml-3">
                                <Text className="text-[#3B82F6] font-bold mb-1">
                                    Secure & Encrypted
                                </Text>
                                <Text className="text-blue-200 text-sm">
                                    Your bank information is protected with bank-level encryption.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Bank Accounts */}
                    <Text className="text-gray-400 text-xs font-bold tracking-wider mb-3">
                        CONNECTED ACCOUNTS
                    </Text>

                    {accounts.map((account) => (
                        <View
                            key={account.id}
                            className="bg-[#1A1F3A] rounded-2xl p-4 mb-4 border border-[#2A2F4A]"
                        >
                            {/* Account Header */}
                            <View className="flex-row items-center justify-between mb-3">
                                <View className="flex-row items-center flex-1">
                                    <View className="w-12 h-12 rounded-full bg-[#3B82F6]/20 items-center justify-center mr-4">
                                        <Ionicons name="card" size={24} color="#3B82F6" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white font-bold text-base mb-1">
                                            {account.bankName}
                                        </Text>
                                        <Text className="text-gray-400 text-sm capitalize">
                                            {account.accountType} ••••{account.last4}
                                        </Text>
                                    </View>
                                </View>
                                {account.isPrimary && (
                                    <View className="bg-[#10B981]/20 px-3 py-1 rounded-full">
                                        <Text className="text-[#10B981] text-xs font-bold">PRIMARY</Text>
                                    </View>
                                )}
                            </View>

                            {/* Status */}
                            <View className="flex-row items-center mb-3">
                                <View
                                    className="w-2 h-2 rounded-full mr-2"
                                    style={{ backgroundColor: getStatusColor(account.status) }}
                                />
                                <Text
                                    className="text-sm font-semibold"
                                    style={{ color: getStatusColor(account.status) }}
                                >
                                    {getStatusText(account.status)}
                                </Text>
                                <Text className="text-gray-500 text-sm ml-2">
                                    • Added {account.addedDate}
                                </Text>
                            </View>

                            {/* Actions */}
                            <View className="flex-row gap-3">
                                {!account.isPrimary && (
                                    <TouchableOpacity
                                        onPress={() => handleSetPrimary(account.id)}
                                        className="flex-1 bg-[#2A2F4A] rounded-xl py-3 flex-row items-center justify-center"
                                    >
                                        <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                                        <Text className="text-[#10B981] font-semibold ml-2 text-sm">
                                            Set as Primary
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    onPress={() => handleRemoveAccount(account.id)}
                                    className={`${account.isPrimary ? 'flex-1' : 'w-12'} bg-[#2A2F4A] rounded-xl py-3 items-center justify-center`}
                                >
                                    <Ionicons name="trash" size={18} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    {/* Add New Account */}
                    <TouchableOpacity
                        onPress={handleAddAccount}
                        className="bg-[#1A1F3A] rounded-2xl py-4 border-2 border-dashed border-[#3B82F6] flex-row items-center justify-center mb-6"
                    >
                        <Ionicons name="add-circle" size={24} color="#3B82F6" />
                        <Text className="text-[#3B82F6] font-bold text-base ml-2">
                            Add Bank Account
                        </Text>
                    </TouchableOpacity>

                    {/* Help Section */}
                    <View className="bg-[#1A1F3A] rounded-2xl p-4 border border-[#2A2F4A] mb-6">
                        <Text className="text-white font-bold mb-3">Need Help?</Text>
                        <TouchableOpacity className="flex-row items-center py-2">
                            <Ionicons name="help-circle" size={20} color="#3B82F6" />
                            <Text className="text-gray-300 ml-3 flex-1">
                                How to verify my bank account?
                            </Text>
                            <Ionicons name="chevron-forward" size={20} color="#64748B" />
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center py-2">
                            <Ionicons name="time" size={20} color="#3B82F6" />
                            <Text className="text-gray-300 ml-3 flex-1">
                                When will I receive my payout?
                            </Text>
                            <Ionicons name="chevron-forward" size={20} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    <View className="h-8" />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
