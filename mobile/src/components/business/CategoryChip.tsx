import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    interpolateColor,
} from 'react-native-reanimated';
import { Category } from '@/features/restaurant/types';
import { ANIMATION_SCALE, SPRING_CONFIG, ANIMATION_DURATION, ANIMATION_EASING } from '@/core/animations/constants';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface CategoryChipProps {
    category: Category;
    isActive: boolean;
    onPress: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({ category, isActive, onPress }) => {
    const scale = useSharedValue(1);
    const activeProgress = useSharedValue(isActive ? 1 : 0);

    React.useEffect(() => {
        activeProgress.value = withTiming(isActive ? 1 : 0, {
            duration: ANIMATION_DURATION.NORMAL,
            easing: ANIMATION_EASING.EASE_IN_OUT,
        });
    }, [isActive]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        backgroundColor: interpolateColor(
            activeProgress.value,
            [0, 1],
            ['#F5F5F5', '#FF5722'] // bg-background-secondary to bg-primary
        ),
    }));

    const handlePressIn = () => {
        scale.value = withSpring(ANIMATION_SCALE.PRESS, SPRING_CONFIG.GENTLE);
    };

    const handlePressOut = () => {
        scale.value = withSpring(ANIMATION_SCALE.NORMAL, SPRING_CONFIG.GENTLE);
    };

    const textClasses = `
    text-sm
    font-semibold
    ${isActive ? 'text-white' : 'text-text-primary'}
  `.trim();

    return (
        <AnimatedTouchable
            className="px-5 py-3 rounded-full mr-3 flex-row items-center"
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.7}
            style={animatedStyle}
        >
            <Text className="text-base mr-1">{category.icon}</Text>
            <Text className={textClasses}>{category.name}</Text>
        </AnimatedTouchable>
    );
};
