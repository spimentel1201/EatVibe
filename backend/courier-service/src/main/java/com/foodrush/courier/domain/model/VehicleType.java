package com.foodrush.courier.domain.model;

/**
 * Tipo de vehículo del repartidor
 * 
 * Afecta:
 * - Velocidad de entrega estimada
 * - Distancia máxima asignable
 * - Tarifa de entrega
 */
public enum VehicleType {
    /**
     * Bicicleta - Cortas distancias, zonas urbanas congestionadas
     * Velocidad promedio: 15 km/h
     * Distancia máxima: 5 km
     */
    BICYCLE(15.0, 5.0),

    /**
     * Motocicleta - Distancias medias, más ágil en tráfico
     * Velocidad promedio: 30 km/h
     * Distancia máxima: 15 km
     */
    MOTORCYCLE(30.0, 15.0),

    /**
     * Auto - Largas distancias, pedidos grandes
     * Velocidad promedio: 40 km/h
     * Distancia máxima: 25 km
     */
    CAR(40.0, 25.0);

    private final double averageSpeedKmh;
    private final double maxDistanceKm;

    VehicleType(double averageSpeedKmh, double maxDistanceKm) {
        this.averageSpeedKmh = averageSpeedKmh;
        this.maxDistanceKm = maxDistanceKm;
    }

    public double getAverageSpeedKmh() {
        return averageSpeedKmh;
    }

    public double getMaxDistanceKm() {
        return maxDistanceKm;
    }

    /**
     * Calcula el tiempo estimado de entrega en minutos
     */
    public double calculateETA(double distanceKm) {
        return (distanceKm / averageSpeedKmh) * 60;
    }

    /**
     * Verifica si el vehículo puede manejar la distancia
     */
    public boolean canHandleDistance(double distanceKm) {
        return distanceKm <= maxDistanceKm;
    }
}
