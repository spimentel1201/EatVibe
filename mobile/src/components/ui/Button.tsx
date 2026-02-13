import React from 'react';
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    TouchableOpacityProps,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    children: React.ReactNode;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    children,
    className = '',
    ...props
}) => {
    const getVariantStyles = (): string => {
        switch (variant) {
            case 'primary':
                return 'bg-primary active:bg-primary-600';
            case 'secondary':
                return 'bg-secondary active:bg-secondary-600';
            case 'outline':
                return 'bg-transparent border-2 border-primary active:bg-primary-50';
            case 'ghost':
                return 'bg-transparent active:bg-gray-100';
            default:
                return 'bg-primary active:bg-primary-600';
        }
    };

    const getSizeStyles = (): string => {
        switch (size) {
            case 'sm':
                return 'px-4 py-2';
            case 'md':
                return 'px-6 py-3';
            case 'lg':
                return 'px-8 py-4';
            default:
                return 'px-6 py-3';
        }
    };

    const getTextVariantStyles = (): string => {
        switch (variant) {
            case 'primary':
            case 'secondary':
                return 'text-white';
            case 'outline':
                return 'text-primary';
            case 'ghost':
                return 'text-text-primary';
            default:
                return 'text-white';
        }
    };

    const getTextSizeStyles = (): string => {
        switch (size) {
            case 'sm':
                return 'text-sm';
            case 'md':
                return 'text-base';
            case 'lg':
                return 'text-lg';
            default:
                return 'text-base';
        }
    };

    const buttonClasses = `
    ${getVariantStyles()}
    ${getSizeStyles()}
    rounded-xl
    flex-row
    items-center
    justify-center
    ${disabled || loading ? 'opacity-50' : ''}
    ${className}
  `.trim();

    const textClasses = `
    ${getTextVariantStyles()}
    ${getTextSizeStyles()}
    font-semibold
  `.trim();

    return (
        <TouchableOpacity
            className={buttonClasses}
            disabled={disabled || loading}
            activeOpacity={0.7}
            {...props}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'outline' || variant === 'ghost' ? '#FF5722' : '#FFFFFF'}
                    size="small"
                />
            ) : (
                <Text className={textClasses}>{children}</Text>
            )}
        </TouchableOpacity>
    );
};
