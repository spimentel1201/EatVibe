import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function RegisterScreen() {
    const router = useRouter();
    const { register, isLoading, error, clearError } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const validateForm = (): boolean => {
        let isValid = true;

        // Reset errors
        setNameError('');
        setEmailError('');
        setPhoneError('');
        setPasswordError('');
        setConfirmPasswordError('');
        clearError();

        // Validate name
        if (!name) {
            setNameError('El nombre es requerido');
            isValid = false;
        } else if (name.length < 2) {
            setNameError('El nombre debe tener al menos 2 caracteres');
            isValid = false;
        }

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

        // Validate confirm password
        if (!confirmPassword) {
            setConfirmPasswordError('Confirma tu contraseña');
            isValid = false;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError('Las contraseñas no coinciden');
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
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 px-6 justify-center py-8">
                        {/* Header */}
                        <View className="items-center mb-8">
                            <Text className="text-3xl font-bold text-text-primary mb-2">Crear Cuenta</Text>
                            <Text className="text-base text-text-secondary text-center">
                                Únete a FoodRush y disfruta de tus comidas favoritas
                            </Text>
                        </View>

                        {/* Register Form */}
                        <View className="mb-6">
                            <Input
                                label="Nombre completo"
                                placeholder="Juan Pérez"
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                                autoComplete="name"
                                error={nameError}
                                className="mb-4"
                            />

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
                                label="Teléfono (opcional)"
                                placeholder="+51 999 999 999"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                autoComplete="tel"
                                error={phoneError}
                                className="mb-4"
                            />

                            <Input
                                label="Contraseña"
                                placeholder="••••••••"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoCapitalize="none"
                                autoComplete="password-new"
                                error={passwordError}
                                className="mb-4"
                            />

                            <Input
                                label="Confirmar contraseña"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                autoCapitalize="none"
                                autoComplete="password-new"
                                error={confirmPasswordError}
                                className="mb-6"
                            />

                            {error && (
                                <View className="bg-error/10 p-3 rounded-xl mb-4">
                                    <Text className="text-error text-sm text-center">{error}</Text>
                                </View>
                            )}

                            <Button
                                variant="primary"
                                size="lg"
                                onPress={handleRegister}
                                loading={isLoading}
                                className="mb-4"
                            >
                                Registrarse
                            </Button>

                            <Text className="text-xs text-text-secondary text-center mb-4">
                                Al registrarte, aceptas nuestros{' '}
                                <Text className="text-primary">Términos y Condiciones</Text> y{' '}
                                <Text className="text-primary">Política de Privacidad</Text>
                            </Text>
                        </View>

                        {/* Social Register */}
                        <View className="mb-6">
                            <View className="flex-row items-center mb-4">
                                <View className="flex-1 h-px bg-gray-300" />
                                <Text className="mx-4 text-sm text-text-secondary">O regístrate con</Text>
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

                        {/* Login Link */}
                        <View className="flex-row justify-center">
                            <Text className="text-sm text-text-secondary">¿Ya tienes cuenta? </Text>
                            <Link href="/(auth)/login" asChild>
                                <TouchableOpacity>
                                    <Text className="text-sm text-primary font-semibold">Inicia Sesión</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
