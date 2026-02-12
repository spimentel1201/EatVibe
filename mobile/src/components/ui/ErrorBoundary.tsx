import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            return (
                <View className="flex-1 bg-white items-center justify-center px-6">
                    <View className="bg-orange-50 w-24 h-24 rounded-full items-center justify-center mb-6">
                        <Ionicons name="warning-outline" size={48} color="#FF5722" />
                    </View>

                    <Text className="text-2xl font-black text-gray-900 mb-2">Oops! Something went wrong</Text>
                    <Text className="text-gray-500 text-center mb-8">
                        An unexpected error occurred. Don't worry, we're on it!
                    </Text>

                    <TouchableOpacity
                        onPress={this.handleReset}
                        className="bg-[#FF5722] px-8 py-4 rounded-full shadow-lg shadow-orange-500/30"
                    >
                        <Text className="text-white font-bold text-lg">Try Again</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return this.props.children;
    }
}
