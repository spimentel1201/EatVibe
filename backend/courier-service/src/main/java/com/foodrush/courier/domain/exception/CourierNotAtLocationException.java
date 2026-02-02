package com.foodrush.courier.domain.exception;

/**
 * Excepción lanzada cuando un courier no está en la ubicación requerida
 * para realizar una acción (geofencing validation failed)
 */
public class CourierNotAtLocationException extends RuntimeException {

    public CourierNotAtLocationException(String action, double distanceMeters) {
        super(String.format("Courier cannot %s: too far from location (%.2f meters away)",
                action, distanceMeters));
    }
}
