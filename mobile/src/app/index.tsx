
import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui';

export default function Index() {
    const { isAuthenticated, isLoading } = useAuth();

    // Debugging logs
    React.useEffect(() => {
        console.log('🔹 Index Component Mounted');
        console.log('🔹 IsLoading:', isLoading, 'IsAuthenticated:', isAuthenticated);
        if (!isLoading) {
            console.log('🔹 Redirecting based on auth status...');
        }
    }, [isLoading, isAuthenticated]);

    if (isLoading) {
        return <LoadingSpinner fullScreen message="Cargando..." />;
    }

    // Redirect based on authentication status
    if (isAuthenticated) {
        console.log('🔹 Authenticated! Redirecting to /home');
        return <Redirect href={"/(consumer)/home" as any} />; // Explicit path for typed routes
    }

    console.log('🔹 Not authenticated. Redirecting to /(auth)/welcome');
    return <Redirect href="/(auth)/welcome" />;
}
