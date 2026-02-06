/// <reference types="expo/types" />

// Declare module for CSS imports
declare module '*.css' {
    const content: any;
    export default content;
}

// Ensure all node_modules types are recognized
declare module '@tanstack/react-query';
declare module 'zustand';
declare module 'axios';
declare module 'react-native-maps';
declare module 'react-native-mmkv';
