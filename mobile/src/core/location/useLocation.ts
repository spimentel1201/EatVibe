import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Coordinates } from '@/core/api/types';

interface UseLocationReturn {
    location: Coordinates | null;
    error: string | null;
    loading: boolean;
    requestPermission: () => Promise<boolean>;
    refreshLocation: () => Promise<void>;
}

export const useLocation = (): UseLocationReturn => {
    const [location, setLocation] = useState<Coordinates | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const requestPermission = async (): Promise<boolean> => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Permiso de ubicación denegado');
                return false;
            }
            return true;
        } catch (err) {
            setError('Error al solicitar permisos de ubicación');
            console.error('Location permission error:', err);
            return false;
        }
    };

    const refreshLocation = async (): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const hasPermission = await requestPermission();
            if (!hasPermission) {
                setLoading(false);
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            setLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            });
        } catch (err) {
            setError('Error al obtener la ubicación');
            console.error('Location error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshLocation();
    }, []);

    return {
        location,
        error,
        loading,
        requestPermission,
        refreshLocation,
    };
};
