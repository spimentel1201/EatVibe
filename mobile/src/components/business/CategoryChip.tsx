import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Category } from '@/features/restaurant/types';

interface CategoryChipProps {
    category: Category;
    isActive: boolean;
    onPress: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({ category, isActive, onPress }) => {
    const containerClasses = `
    px-5
    py-3
    rounded-full
    mr-3
    flex-row
    items-center
    ${isActive ? 'bg-primary' : 'bg-background-secondary'}
  `.trim();

    const textClasses = `
    text-sm
    font-semibold
    ${isActive ? 'text-white' : 'text-text-primary'}
  `.trim();

    return (
        <TouchableOpacity
            className={containerClasses}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text className="text-base mr-1">{category.icon}</Text>
            <Text className={textClasses}>{category.name}</Text>
        </TouchableOpacity>
    );
};
