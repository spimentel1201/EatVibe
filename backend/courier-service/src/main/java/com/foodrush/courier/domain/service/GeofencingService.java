package com.foodrush.courier.domain.service;

import com.foodrush.courier.domain.exception.CourierNotAtLocationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Servicio de Geofencing
 * 
 * Valida si un courier está en una ubicación específica
 * usando un radio de geofencing configurable.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GeofencingService {

    private final GeolocationService geolocationService;

    @Value("${geolocation.geofence-radius-meters}")
    private double geofenceRadiusMeters;

    /**
     * Valida si el courier está en la ubicación de pickup
     * 
     * @param courierLocation Ubicación actual del courier
     * @param pickupLocation  Ubicación del restaurante
     * @throws CourierNotAtLocationException si el courier está muy lejos
     */
    public void validateCourierAtPickup(Point courierLocation, Point pickupLocation) {
        double distanceKm = geolocationService.calculateDistance(courierLocation, pickupLocation);
        double distanceMeters = distanceKm * 1000;

        if (distanceMeters > geofenceRadiusMeters) {
            log.warn("Courier not at pickup location. Distance: {} meters, Required: {} meters",
                    distanceMeters, geofenceRadiusMeters);
            throw new CourierNotAtLocationException("mark as picked up", distanceMeters);
        }

        log.debug("Courier at pickup location. Distance: {} meters", distanceMeters);
    }

    /**
     * Valida si el courier está en la ubicación de delivery
     * 
     * @param courierLocation  Ubicación actual del courier
     * @param deliveryLocation Ubicación del cliente
     * @throws CourierNotAtLocationException si el courier está muy lejos
     */
    public void validateCourierAtDelivery(Point courierLocation, Point deliveryLocation) {
        double distanceKm = geolocationService.calculateDistance(courierLocation, deliveryLocation);
        double distanceMeters = distanceKm * 1000;

        if (distanceMeters > geofenceRadiusMeters) {
            log.warn("Courier not at delivery location. Distance: {} meters, Required: {} meters",
                    distanceMeters, geofenceRadiusMeters);
            throw new CourierNotAtLocationException("mark as delivered", distanceMeters);
        }

        log.debug("Courier at delivery location. Distance: {} meters", distanceMeters);
    }

    /**
     * Verifica si el courier está en la ubicación (sin lanzar excepción)
     * 
     * @param courierLocation Ubicación actual del courier
     * @param targetLocation  Ubicación objetivo
     * @return true si el courier está dentro del radio de geofencing
     */
    public boolean isCourierAtLocation(Point courierLocation, Point targetLocation) {
        double distanceKm = geolocationService.calculateDistance(courierLocation, targetLocation);
        double distanceMeters = distanceKm * 1000;
        return distanceMeters <= geofenceRadiusMeters;
    }

    /**
     * Calcula la distancia en metros entre dos puntos
     * 
     * @param point1 Primer punto
     * @param point2 Segundo punto
     * @return Distancia en metros
     */
    public double getDistanceMeters(Point point1, Point point2) {
        return geolocationService.calculateDistance(point1, point2) * 1000;
    }
}
