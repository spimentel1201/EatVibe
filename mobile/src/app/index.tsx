import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui';

export default function Index() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingSpinner fullScreen message="Cargando..." />;
    }

    // Redirect based on authentication status
    if (isAuthenticated) {
        return <Redirect href="/(consumer)/home" />;
    }

    return <Redirect href="/(auth)/welcome" />;
}
