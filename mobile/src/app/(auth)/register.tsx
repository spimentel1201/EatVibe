import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    TextInput
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
    const router = useRouter();
    const { register, isLoading, error, clearError } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validateForm = (): boolean => {
        let isValid = true;
        setNameError('');
        setEmailError('');
        setPasswordError('');
        clearError();

        if (!name) {
            setNameError('Full Name is required');
            isValid = false;
        }

        if (!email) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Invalid email address');
            isValid = false;
        }

        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            isValid = false;
        }

        return isValid;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        try {
            await register({ name, email, password, phone: phone || undefined });
            router.replace('/(consumer)');
        } catch (err) {
            console.error('Register error:', err);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {/* Header with Back Button */}
                <View className="px-5 pt-2 mb-4">
                    <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center bg-white border border-gray-100 rounded-full shadow-sm">
                        <Ionicons name="chevron-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 px-6 pt-2">
                        {/* Title Section */}
                        <Text className="text-4xl font-extrabold text-gray-900 mb-2">Let's get started</Text>
                        <Text className="text-gray-500 text-base mb-8">Create an account to get food delivered</Text>

                        {/* Register Form */}
                        <View className="space-y-6">
                            {/* Full Name */}
                            <View>
                                <Text className="font-bold text-gray-900 mb-2 ml-1 text-sm">Full Name</Text>
                                <View className={`bg-gray-50 rounded-[20px] px-5 py-4 border ${nameError ? 'border-red-500' : 'border-gray-100'}`}>
                                    <TextInput
                                        className="text-gray-900 text-base"
                                        placeholder="John Doe"
                                        value={name}
                                        onChangeText={setName}
                                        autoCapitalize="words"
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>
                                {nameError ? <Text className="text-red-500 text-xs mt-1 ml-2">{nameError}</Text> : null}
                            </View>

                            {/* Email */}
                            <View>
                                <Text className="font-bold text-gray-900 mb-2 ml-1 text-sm">Email</Text>
                                <View className={`bg-gray-50 rounded-[20px] px-5 py-4 border ${emailError ? 'border-red-500' : 'border-gray-100'}`}>
                                    <TextInput
                                        className="text-gray-900 text-base"
                                        placeholder="john@example.com"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>
                                {emailError ? <Text className="text-red-500 text-xs mt-1 ml-2">{emailError}</Text> : null}
                            </View>

                            {/* Phone Number */}
                            <View>
                                <Text className="font-bold text-gray-900 mb-2 ml-1 text-sm">Phone Number</Text>
                                <View className="flex-row items-center bg-gray-50 rounded-[20px] px-5 py-4 border border-gray-100">
                                    <View className="flex-row items-center border-r border-gray-200 pr-3 mr-3">
                                        <Text className="text-base mr-1">🇵🇪</Text>
                                        <Text className="text-gray-900 text-base">+51</Text>
                                    </View>
                                    <TextInput
                                        className="flex-1 text-gray-900 text-base"
                                        placeholder="999 000 000"
                                        value={phone}
                                        onChangeText={setPhone}
                                        keyboardType="phone-pad"
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>
                            </View>

                            {/* Password */}
                            <View>
                                <Text className="font-bold text-gray-900 mb-2 ml-1 text-sm">Password</Text>
                                <View className={`flex-row items-center bg-gray-50 rounded-[20px] px-5 py-4 border ${passwordError ? 'border-red-500' : 'border-gray-100'}`}>
                                    <TextInput
                                        className="flex-1 text-gray-900 text-base"
                                        placeholder="••••••••"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                        placeholderTextColor="#9CA3AF"
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#9CA3AF" />
                                    </TouchableOpacity>
                                </View>
                                {passwordError ? <Text className="text-red-500 text-xs mt-1 ml-2">{passwordError}</Text> : null}
                            </View>

                            {error && (
                                <View className="bg-red-50 p-3 rounded-xl mt-2">
                                    <Text className="text-red-500 text-sm text-center">{error}</Text>
                                </View>
                            )}

                            {/* Sign Up Button */}
                            <TouchableOpacity
                                onPress={handleRegister}
                                disabled={isLoading}
                                className={`bg-[#FF5722] py-4 rounded-full shadow-lg shadow-orange-500/30 items-center justify-center mt-4 ${isLoading ? 'opacity-70' : ''}`}
                            >
                                <Text className="text-white font-bold text-lg">
                                    {isLoading ? 'Signing Up...' : 'Sign Up'}
                                </Text>
                            </TouchableOpacity>

                            {/* Terms */}
                            <Text className="text-gray-400 text-[10px] text-center mt-2 px-6">
                                By signing up, you agree to our{' '}
                                <Text className="text-[#FF5722]">Terms of Service</Text> and{' '}
                                <Text className="text-[#FF5722]">Privacy Policy</Text>.
                            </Text>

                            {/* Divider */}
                            <View className="flex-row items-center py-6">
                                <View className="flex-1 h-[1px] bg-gray-100" />
                                <Text className="mx-4 text-gray-400 font-bold text-xs uppercase">Or continue with</Text>
                                <View className="flex-1 h-[1px] bg-gray-100" />
                            </View>

                            {/* Social Buttons */}
                            <View className="flex-row justify-center space-x-6 mb-8">
                                <TouchableOpacity className="w-16 h-16 items-center justify-center bg-white border border-gray-100 rounded-full shadow-sm">
                                    <Ionicons name="logo-google" size={24} color="black" />
                                </TouchableOpacity>
                                <TouchableOpacity className="w-16 h-16 items-center justify-center bg-white border border-gray-100 rounded-full shadow-sm">
                                    <Ionicons name="logo-apple" size={26} color="black" />
                                </TouchableOpacity>
                            </View>

                            {/* Footer */}
                            <View className="flex-row justify-center py-8 bg-gray-50 -mx-6 mb-[-40px]">
                                <Text className="text-gray-600 text-base">Already have an account? </Text>
                                <Link href="/(auth)/login" asChild>
                                    <TouchableOpacity>
                                        <Text className="text-[#FF5722] font-bold text-base">Log In</Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
