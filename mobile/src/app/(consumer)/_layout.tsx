import { Stack } from 'expo-router';

export default function ConsumerLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#FFFFFF' },
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="restaurant/[id]" />
        </Stack>
    );
}
