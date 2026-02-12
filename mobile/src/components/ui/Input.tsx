import React, { useState } from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    className?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    className = '',
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const containerClasses = `
    ${className}
  `.trim();

    const inputContainerClasses = `
    flex-row
    items-center
    border-2
    rounded-xl
    px-4
    ${isFocused ? 'border-primary' : error ? 'border-error' : 'border-gray-300'}
    bg-white
  `.trim();

    const inputClasses = `
    flex-1
    py-3
    text-base
    text-text-primary
  `.trim();

    return (
        <View className={containerClasses}>
            {label && <Text className="text-sm font-medium text-text-primary mb-2">{label}</Text>}

            <View className={inputContainerClasses}>
                {leftIcon && <View className="mr-2">{leftIcon}</View>}

                <TextInput
                    className={inputClasses}
                    placeholderTextColor="#BDBDBD"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />

                {rightIcon && <View className="ml-2">{rightIcon}</View>}
            </View>

            {error && <Text className="text-sm text-error mt-1">{error}</Text>}

            {helperText && !error && (
                <Text className="text-sm text-text-secondary mt-1">{helperText}</Text>
            )}
        </View>
    );
};
