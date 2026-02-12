import { Easing } from 'react-native-reanimated';

/**
 * Animation timing constants for consistent micro-animations across the app
 */
export const ANIMATION_DURATION = {
    FAST: 150,
    NORMAL: 250,
    SLOW: 350,
} as const;

/**
 * Easing curves for natural-feeling animations
 */
export const ANIMATION_EASING = {
    EASE_IN_OUT: Easing.bezier(0.4, 0, 0.2, 1),
    EASE_OUT: Easing.bezier(0, 0, 0.2, 1),
    EASE_IN: Easing.bezier(0.4, 0, 1, 1),
    SPRING: Easing.elastic(1),
} as const;

/**
 * Scale values for interactive elements
 */
export const ANIMATION_SCALE = {
    PRESS: 0.95,
    ACTIVE: 1.05,
    NORMAL: 1,
} as const;

/**
 * Spring animation configurations
 */
export const SPRING_CONFIG = {
    BOUNCY: {
        damping: 10,
        stiffness: 100,
    },
    GENTLE: {
        damping: 20,
        stiffness: 90,
    },
    STIFF: {
        damping: 15,
        stiffness: 150,
    },
} as const;
