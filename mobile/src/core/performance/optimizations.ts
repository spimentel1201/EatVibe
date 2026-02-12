import React from 'react';

/**
 * Performance optimization utilities for React Native
 */

/**
 * Creates a memoized component with custom comparison
 */
export function createMemoComponent<P extends object>(
    Component: React.ComponentType<P>,
    propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
) {
    return React.memo(Component, propsAreEqual);
}

/**
 * Shallow equality check for objects
 */
export function shallowEqual(objA: any, objB: any): boolean {
    if (objA === objB) {
        return true;
    }

    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
        return false;
    }

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
        return false;
    }

    for (let i = 0; i < keysA.length; i++) {
        if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
            return false;
        }
    }

    return true;
}

/**
 * FlatList optimization helpers
 */
export const FlatListOptimizations = {
    /**
     * Get item layout for fixed-height items (improves scrolling performance)
     */
    getItemLayout: (itemHeight: number, separatorHeight: number = 0) => (
        _data: any,
        index: number
    ) => ({
        length: itemHeight,
        offset: (itemHeight + separatorHeight) * index,
        index,
    }),

    /**
     * Default key extractor
     */
    keyExtractor: (item: any, index: number) => item?.id?.toString() || index.toString(),
};
