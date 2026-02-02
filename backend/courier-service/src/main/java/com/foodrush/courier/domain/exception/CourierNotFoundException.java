package com.foodrush.courier.domain.exception;

import java.util.UUID;

/**
 * Excepción lanzada cuando no se encuentra un courier
 */
public class CourierNotFoundException extends RuntimeException {

    public CourierNotFoundException(UUID id) {
        super("Courier not found with id: " + id);
    }

    public CourierNotFoundException(String email) {
        super("Courier not found with email: " + email);
    }
}
