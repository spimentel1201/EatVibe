// import { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

// let storage: any = null;
// try {
//     storage = new MMKV();
// } catch (error) {
//     console.error("Failed to initialize MMKV:", error);
// }

const fallbackStorage = new Map<string, string>();

export const mmkvStorage: StateStorage = {
    setItem: (name, value) => {
        // if (storage) return storage.set(name, value);
        fallbackStorage.set(name, value);
        return;
    },
    getItem: (name) => {
        // if (storage) { // @ts-ignore
        //     const value = storage.getString(name);
        //     return value ?? null;
        // }
        return fallbackStorage.get(name) ?? null;
    },
    removeItem: (name) => {
        // if (storage) return storage.delete(name);
        fallbackStorage.delete(name);
        return;
    },
};
