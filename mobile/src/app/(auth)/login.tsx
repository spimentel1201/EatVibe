import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function LoginScreen() {
    const router = useRouter();
    const { login, isLoading, error, clearError } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validateForm = (): boolean => {
        let isValid = true;

        // Reset errors
        setEmailError('');
        setPasswordError('');
        clearError();

        // Validate email
        if (!email) {
            setEmailError('El correo es requerido');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Correo inválido');
            isValid = false;
        }

        // Validate password
        if (!password) {
            setPasswordError('La contraseña es requerida');
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError('La contraseña debe tener al menos 6 caracteres');
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
            // Error is handled by the store
            console.error('Login error:', err);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 px-6 justify-center">
                        {/* Logo and Title */}
                        <View className="items-center mb-12">
                            <Text className="text-5xl mb-4">🍔</Text>
                            <Text className="text-3xl font-bold text-text-primary mb-2">FoodRush</Text>
                            <Text className="text-base text-text-secondary">
                                Tu comida favorita en minutos
                            </Text>
                        </View>

                        {/* Login Form */}
                        <View className="mb-6">
                            <Input
                                label="Correo electrónico"
                                placeholder="tu@email.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                                error={emailError}
                                className="mb-4"
                            />

                            <Input
                                label="Contraseña"
                                placeholder="••••••••"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoCapitalize="none"
                                autoComplete="password"
                                error={passwordError}
                                className="mb-2"
                            />

                            <TouchableOpacity className="self-end mb-6">
                                <Text className="text-sm text-primary font-semibold">
                                    ¿Olvidaste tu contraseña?
                                </Text>
                            </TouchableOpacity>

                            {error && (
                                <View className="bg-error/10 p-3 rounded-xl mb-4">
                                    <Text className="text-error text-sm text-center">{error}</Text>
                                </View>
                            )}

                            <Button
                                variant="primary"
                                size="lg"
                                onPress={handleLogin}
                                loading={isLoading}
                                className="mb-4"
                            >
                                Iniciar Sesión
                            </Button>

                            {/* Demo Credentials */}
                            <View className="bg-info/10 p-3 rounded-xl mb-4">
                                <Text className="text-info text-xs text-center font-semibold mb-1">
                                    Credenciales de prueba:
                                </Text>
                                <Text className="text-info text-xs text-center">
                                    Email: user@foodrush.com
                                </Text>
                                <Text className="text-info text-xs text-center">Password: password</Text>
                            </View>
                        </View>

                        {/* Social Login */}
                        <View className="mb-6">
                            <View className="flex-row items-center mb-4">
                                <View className="flex-1 h-px bg-gray-300" />
                                <Text className="mx-4 text-sm text-text-secondary">O continúa con</Text>
                                <View className="flex-1 h-px bg-gray-300" />
                            </View>

                            <View className="flex-row gap-4">
                                <Button variant="outline" size="md" className="flex-1">
                                    <Text className="text-base mr-2">🔍</Text>
                                    <Text>Google</Text>
                                </Button>

                                <Button variant="outline" size="md" className="flex-1">
                                    <Text className="text-base mr-2">🍎</Text>
                                    <Text>Apple</Text>
                                </Button>
                            </View>
                        </View>

                        {/* Register Link */}
                        <View className="flex-row justify-center">
                            <Text className="text-sm text-text-secondary">¿No tienes cuenta? </Text>
                            <Link href="/(auth)/register" asChild>
                                <TouchableOpacity>
                                    <Text className="text-sm text-primary font-semibold">Regístrate</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
