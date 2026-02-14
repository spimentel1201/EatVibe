import '../global.css';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuth, AuthStore } from '@/features/auth/hooks/useAuth';
import React from 'react';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
        },
    },
});

export default function RootLayout() {
    const checkAuth = useAuth((state: AuthStore) => state.checkAuth);

    useEffect(() => {
        // Check authentication status on app load (non-blocking)
        checkAuth().catch(console.error);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <QueryClientProvider client={queryClient}>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#FFFFFF' },
                }}
            />
        </QueryClientProvider>
    );
}
