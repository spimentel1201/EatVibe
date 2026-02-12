import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
    children: React.ReactNode;
    className?: string;
    pressable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    const cardClasses = `
    bg-white
    rounded-2xl
    shadow-card
    ${className}
  `.trim();

    return (
        <View className={cardClasses} {...props}>
            {children}
        </View>
    );
};
