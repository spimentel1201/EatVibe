import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProofOfDeliveryScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [pin, setPin] = useState('');
    const [showEarnings, setShowEarnings] = useState(false);

    // Mock data
    const delivery = {
        id: params.id || 'ORD-12345',
        earnings: 4.50,
        customerPin: '1234', // In real app, this comes from backend
    };

    const PIN_LENGTH = 4;

    const verifyPin = useCallback(async () => {
        // Simulate API call
        setTimeout(() => {
            if (pin === delivery.customerPin) {
                // PIN correct
                setShowEarnings(true);
                Vibration.vibrate([0, 100, 50, 100]); // Success pattern

                // Navigate to completion screen after showing earnings
                setTimeout(() => {
                    router.push(`/courier/delivery/complete?id=${delivery.id}` as any);
                }, 2000);
            } else {
                // PIN incorrect
                Vibration.vibrate([0, 100, 100, 100, 100, 100]); // Error pattern
                Alert.alert(
                    'Incorrect PIN',
                    'The PIN entered is incorrect. Please ask the customer to provide the correct 4-digit PIN.',
                    [
                        {
                            text: 'Try Again',
                            onPress: () => {
                                setPin('');
                            },
                        },
                    ]
                );
            }
        }, 500);
    }, [pin, delivery.customerPin, delivery.id, router]);

    useEffect(() => {
        // Auto-verify when PIN is complete
        if (pin.length === PIN_LENGTH) {
            verifyPin();
        }
    }, [pin.length, verifyPin]);

    const handleNumberPress = (number: string) => {
        if (pin.length < PIN_LENGTH) {
            setPin(pin + number);
            // Haptic feedback
            Vibration.vibrate(10);
        }
    };

    const handleDelete = () => {
        setPin(pin.slice(0, -1));
        Vibration.vibrate(10);
    };

    const handleScanQRCode = () => {
        // TODO: Open camera to scan QR code
        router.push(`/courier/delivery/scan-qr?id=${delivery.id}` as any);
    };

    const handleContactSupport = () => {
        Alert.alert(
            'Contact Support',
            'Choose how you want to contact support:',
            [
                {
                    text: 'Call Support',
                    onPress: () => {
                        // TODO: Call support number
                        console.log('Calling support...');
                    },
                },
                {
                    text: 'Chat with Support',
                    onPress: () => {
                        // TODO: Open support chat
                        console.log('Opening support chat...');
                    },
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ]
        );
    };

    const renderPinDots = () => {
        return (
            <View className="flex-row justify-center gap-4 mb-8">
                {[0, 1, 2, 3].map((index) => (
                    <View
                        key={index}
                        className={`w-16 h-16 rounded-full border-2 items-center justify-center ${index < pin.length
                            ? 'border-[#3B82F6] bg-[#3B82F6]/10'
                            : 'border-[#2A2F3E] bg-transparent'
                            }`}
                    >
                        {index < pin.length && (
                            <View className="w-4 h-4 rounded-full bg-[#3B82F6]" />
                        )}
                    </View>
                ))}
            </View>
        );
    };

    const renderNumberPad = () => {
        const numbers = [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['', '0', 'delete'],
        ];

        return (
            <View className="px-8 mb-8">
                {numbers.map((row, rowIndex) => (
                    <View key={rowIndex} className="flex-row justify-center gap-6 mb-6">
                        {row.map((item, colIndex) => {
                            if (item === '') {
                                return <View key={colIndex} className="w-20 h-20" />;
                            }

                            if (item === 'delete') {
                                return (
                                    <TouchableOpacity
                                        key={colIndex}
                                        onPress={handleDelete}
                                        className="w-20 h-20 items-center justify-center"
                                        disabled={pin.length === 0}
                                    >
                                        <Ionicons
                                            name="backspace-outline"
                                            size={32}
                                            color={pin.length === 0 ? '#2A2F3E' : '#FFF'}
                                        />
                                    </TouchableOpacity>
                                );
                            }

                            return (
                                <TouchableOpacity
                                    key={colIndex}
                                    onPress={() => handleNumberPress(item)}
                                    className="w-20 h-20 rounded-full bg-[#2A2F3E] items-center justify-center active:bg-[#3A3F4E]"
                                    disabled={pin.length >= PIN_LENGTH}
                                >
                                    <Text className="text-white text-3xl font-semibold">
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View className="flex-1 bg-black">
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <View className="items-center pt-8 pb-4">
                    <View className="w-12 h-1 bg-gray-800 rounded-full mb-8" />

                    <Text className="text-white text-3xl font-bold mb-3">
                        Confirm Delivery
                    </Text>

                    <Text className="text-gray-400 text-center px-8">
                        Ask the customer for their{' '}
                        <Text className="text-white font-bold">4-digit PIN</Text>
                        {' '}to{'\n'}complete the order.
                    </Text>
                </View>

                {/* PIN Dots */}
                <View className="py-8">
                    {renderPinDots()}

                    {/* Earnings Badge */}
                    {showEarnings && (
                        <View className="items-center">
                            <View className="bg-[#065F46] px-6 py-3 rounded-full flex-row items-center">
                                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                                <Text className="text-[#10B981] font-bold text-sm ml-2">
                                    EARNINGS ADDED: +${delivery.earnings.toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Number Pad */}
                <View className="flex-1 justify-center">
                    {renderNumberPad()}
                </View>

                {/* QR Code Button */}
                <View className="px-6 mb-6">
                    <TouchableOpacity
                        onPress={handleScanQRCode}
                        className="bg-[#3B82F6] rounded-full py-4 flex-row items-center justify-center"
                    >
                        <Ionicons name="qr-code-outline" size={24} color="#FFF" />
                        <Text className="text-white font-bold text-base ml-3 tracking-wider">
                            SCAN QR CODE
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Support Link */}
                <TouchableOpacity
                    onPress={handleContactSupport}
                    className="items-center pb-6"
                >
                    <Text className="text-gray-500 text-sm">
                        Unable to verify?{' '}
                        <Text className="text-gray-400 underline">Contact Support</Text>
                    </Text>
                </TouchableOpacity>

                {/* Home Indicator */}
                <View className="items-center pb-2">
                    <View className="w-32 h-1 bg-gray-800 rounded-full" />
                </View>
            </SafeAreaView>
        </View>
    );
}
