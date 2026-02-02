package com.foodrush.courier.domain.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.locationtech.jts.geom.Point;

import static org.junit.jupiter.api.Assertions.*;

class GeolocationServiceTest {

    private final GeolocationService geolocationService = new GeolocationService();

    @Test
    @DisplayName("Should create valid Point from coordinates")
    void shouldCreatePoint() {
        Point point = geolocationService.createPoint(40.7128, -74.0060);
        assertNotNull(point);
        assertEquals(40.7128, point.getY(), 0.0001); // Latitud
        assertEquals(-74.0060, point.getX(), 0.0001); // Longitud
        assertEquals(4326, point.getSRID());
    }

    @Test
    @DisplayName("Should validate invalid coordinates")
    void shouldValidateCoordinates() {
        assertThrows(IllegalArgumentException.class, () -> geolocationService.createPoint(91.0, 0.0)); // Invalid Lat

        assertThrows(IllegalArgumentException.class, () -> geolocationService.createPoint(0.0, 181.0)); // Invalid Lon
    }

    @Test
    @DisplayName("Should calculate Haversine distance correctly")
    void shouldCalculateDistance() {
        // Distancia aproximada entre 1 grado de latitud ~ 111 km
        Point p1 = geolocationService.createPoint(0.0, 0.0);
        Point p2 = geolocationService.createPoint(1.0, 0.0);

        double distance = geolocationService.calculateDistance(p1, p2);

        assertEquals(111.19, distance, 0.5); // Margen de error 500m
    }

    @Test
    @DisplayName("Should check if within radius")
    void shouldCheckWithinRadius() {
        Point center = geolocationService.createPoint(0.0, 0.0);
        Point targetInside = geolocationService.createPoint(0.01, 0.01); // Muy cerca
        Point targetOutside = geolocationService.createPoint(10.0, 10.0); // Muy lejos

        assertTrue(geolocationService.isWithinRadius(center, targetInside, 5.0));
        assertFalse(geolocationService.isWithinRadius(center, targetOutside, 5.0));
    }
}
