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

export default function LoginScreen() {
    const router = useRouter();
    const { login, isLoading, error, clearError } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const validateForm = (): boolean => {
        let isValid = true;
        setEmailError('');
        setPasswordError('');
        clearError();

        if (!email) {
            setEmailError('Email Address is required');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Invalid email address');
            isValid = false;
        }

        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        }

        return isValid;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        try {
            await login({ email, password });
            router.replace('/(consumer)');
        } catch (err) {
            // Error handled by store
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {/* Header with Back Button and Logo */}
                <View className="px-5 pt-2 mb-4 flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center bg-white border border-gray-100 rounded-full shadow-sm">
                        <Ionicons name="chevron-back" size={24} color="#1F2937" />
                    </TouchableOpacity>

                    <View className="flex-1 flex-row justify-center items-center mr-10">
                        <View className="bg-[#FF5722] p-1.5 rounded-lg mr-2">
                            <Ionicons name="bicycle" size={16} color="white" />
                        </View>
                        <Text className="text-xl font-bold text-gray-900 tracking-tight">FoodRush</Text>
                    </View>
                </View>

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="px-6 pt-2">
                        {/* Title Section */}
                        <Text className="text-4xl font-extrabold text-gray-900 mb-2">Welcome Back</Text>
                        <Text className="text-gray-500 text-base mb-10">Sign in to continue ordering your favorites.</Text>

                        {/* Form */}
                        <View className="space-y-6">
                            {/* Email Input */}
                            <View>
                                <Text className="font-bold text-gray-900 mb-2 ml-1 text-sm">Email Address</Text>
                                <View className={`flex-row items-center bg-gray-50 rounded-[20px] px-5 py-4 border ${emailError ? 'border-red-500' : 'border-gray-100'}`}>
                                    <TextInput
                                        className="flex-1 text-gray-900 text-base"
                                        placeholder="hello@example.com"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>
                                {emailError ? <Text className="text-red-500 text-xs mt-1 ml-2">{emailError}</Text> : null}
                            </View>

                            {/* Password Input */}
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

                            {/* Forgot Password */}
                            <TouchableOpacity className="self-end">
                                <Text className="text-[#FF5722] font-bold text-sm">Forgot Password?</Text>
                            </TouchableOpacity>

                            {/* General Error */}
                            {error && (
                                <View className="bg-red-50 p-3 rounded-xl">
                                    <Text className="text-red-500 text-sm text-center">{error}</Text>
                                </View>
                            )}

                            {/* Login Button */}
                            <TouchableOpacity
                                onPress={handleLogin}
                                disabled={isLoading}
                                className={`bg-[#FF5722] py-4 rounded-full shadow-lg shadow-orange-500/30 items-center justify-center mt-2 ${isLoading ? 'opacity-70' : ''}`}
                            >
                                <Text className="text-white font-bold text-lg">
                                    {isLoading ? 'Signing In...' : 'Sign In'}
                                </Text>
                            </TouchableOpacity>

                            {/* OR Divider */}
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
                                <Text className="text-gray-600 text-base">Don't have an account? </Text>
                                <Link href="/(auth)/register" asChild>
                                    <TouchableOpacity>
                                        <Text className="text-[#FF5722] font-bold text-base">Sign Up</Text>
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
