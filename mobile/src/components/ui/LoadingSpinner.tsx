import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    color?: string;
    message?: string;
    fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'large',
    color = '#FF5722',
    message,
    fullScreen = false,
}) => {
    const containerClasses = fullScreen
        ? 'flex-1 justify-center items-center bg-white'
        : 'justify-center items-center py-8';

    return (
        <View className={containerClasses}>
            <ActivityIndicator size={size} color={color} />
            {message && <Text className="text-text-secondary mt-4 text-base">{message}</Text>}
        </View>
    );
};
