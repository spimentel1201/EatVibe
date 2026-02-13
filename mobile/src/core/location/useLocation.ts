import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface Coordinates {
    latitude: number;
    longitude: number;
}

interface UseLocationReturn {
    location: Coordinates | null;
    address: string | null;
    error: string | null;
    isLoading: boolean;
    requestPermission: () => Promise<boolean>;
    refreshLocation: () => Promise<void>;
}

export const useLocation = (): UseLocationReturn => {
    const [location, setLocation] = useState<Coordinates | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const requestPermission = async (): Promise<boolean> => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Location permission denied');
                return false;
            }
            return true;
        } catch (err) {
            setError('Error requesting location permissions');
            console.error('Location permission error:', err);
            return false;
        }
    };

    const refreshLocation = async (): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            // MOCK LOCATION FOR DEVELOPMENT to prevent native module errors
            await new Promise(resolve => setTimeout(resolve, 800));

            const mockCoords = {
                latitude: -12.121980,
                longitude: -77.029580 // Parque Kennedy, Lima
            };
            setLocation(mockCoords);
            setAddress('Calle Los Pinos 123, Miraflores');

            /* REAL IMPLEMENTATION COMMENTED OUT
            const hasPermission = await requestPermission();
            if (!hasPermission) {
                setIsLoading(false);
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            // ... (rest of logic)
            */
        } catch (err) {
            setError('Error obtaining location');
            console.error('Location error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshLocation();
    }, []);

    return {
        location,
        address,
        error,
        isLoading,
        requestPermission,
        refreshLocation,
    };
};
