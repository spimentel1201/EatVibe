package com.foodrush.courier.domain.service;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Service;

/**
 * Servicio de Geolocalización
 * 
 * Proporciona funcionalidades para:
 * - Cálculo de distancias usando fórmula de Haversine
 * - Creación de puntos PostGIS
 * - Validaciones de coordenadas
 */
@Service
public class GeolocationService {

    private static final int SRID_WGS84 = 4326;
    private static final double EARTH_RADIUS_KM = 6371.0;

    private final GeometryFactory geometryFactory;

    public GeolocationService() {
        this.geometryFactory = new GeometryFactory(new PrecisionModel(), SRID_WGS84);
    }

    /**
     * Calcula la distancia entre dos puntos usando la fórmula de Haversine
     * 
     * La fórmula de Haversine calcula la distancia del gran círculo entre dos
     * puntos
     * en una esfera dado sus longitudes y latitudes.
     * 
     * @param p1 Primer punto
     * @param p2 Segundo punto
     * @return Distancia en kilómetros
     */
    public double calculateDistance(Point p1, Point p2) {
        double lat1 = Math.toRadians(p1.getY());
        double lon1 = Math.toRadians(p1.getX());
        double lat2 = Math.toRadians(p2.getY());
        double lon2 = Math.toRadians(p2.getX());

        double dLat = lat2 - lat1;
        double dLon = lon2 - lon1;

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c;
    }

    /**
     * Calcula la distancia entre dos coordenadas
     * 
     * @param lat1 Latitud del primer punto
     * @param lon1 Longitud del primer punto
     * @param lat2 Latitud del segundo punto
     * @param lon2 Longitud del segundo punto
     * @return Distancia en kilómetros
     */
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        Point p1 = createPoint(lat1, lon1);
        Point p2 = createPoint(lat2, lon2);
        return calculateDistance(p1, p2);
    }

    /**
     * Verifica si un punto está dentro del radio de otro punto
     * 
     * @param center   Punto central
     * @param target   Punto objetivo
     * @param radiusKm Radio en kilómetros
     * @return true si el punto objetivo está dentro del radio
     */
    public boolean isWithinRadius(Point center, Point target, double radiusKm) {
        return calculateDistance(center, target) <= radiusKm;
    }

    /**
     * Crea un punto PostGIS a partir de latitud y longitud
     * 
     * @param latitude  Latitud (-90 a 90)
     * @param longitude Longitud (-180 a 180)
     * @return Punto PostGIS con SRID 4326 (WGS84)
     */
    public Point createPoint(double latitude, double longitude) {
        validateCoordinates(latitude, longitude);
        return geometryFactory.createPoint(new Coordinate(longitude, latitude));
    }

    /**
     * Valida que las coordenadas estén en rangos válidos
     * 
     * @param latitude  Latitud (-90 a 90)
     * @param longitude Longitud (-180 a 180)
     * @throws IllegalArgumentException si las coordenadas son inválidas
     */
    public void validateCoordinates(double latitude, double longitude) {
        if (latitude < -90 || latitude > 90) {
            throw new IllegalArgumentException(
                    String.format("Invalid latitude: %.6f. Must be between -90 and 90", latitude));
        }
        if (longitude < -180 || longitude > 180) {
            throw new IllegalArgumentException(
                    String.format("Invalid longitude: %.6f. Must be between -180 and 180", longitude));
        }
    }

    /**
     * Calcula el punto medio entre dos puntos
     * 
     * @param p1 Primer punto
     * @param p2 Segundo punto
     * @return Punto medio
     */
    public Point calculateMidpoint(Point p1, Point p2) {
        double lat1 = Math.toRadians(p1.getY());
        double lon1 = Math.toRadians(p1.getX());
        double lat2 = Math.toRadians(p2.getY());
        double lon2 = Math.toRadians(p2.getX());

        double dLon = lon2 - lon1;

        double bx = Math.cos(lat2) * Math.cos(dLon);
        double by = Math.cos(lat2) * Math.sin(dLon);

        double lat3 = Math.atan2(
                Math.sin(lat1) + Math.sin(lat2),
                Math.sqrt((Math.cos(lat1) + bx) * (Math.cos(lat1) + bx) + by * by));
        double lon3 = lon1 + Math.atan2(by, Math.cos(lat1) + bx);

        return createPoint(Math.toDegrees(lat3), Math.toDegrees(lon3));
    }

    /**
     * Convierte metros a kilómetros
     */
    public double metersToKilometers(double meters) {
        return meters / 1000.0;
    }

    /**
     * Convierte kilómetros a metros
     */
    public double kilometersToMeters(double kilometers) {
        return kilometers * 1000.0;
    }
}
