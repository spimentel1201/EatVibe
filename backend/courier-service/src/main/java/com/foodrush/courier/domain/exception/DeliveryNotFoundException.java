package com.foodrush.courier.domain.exception;

import java.util.UUID;

/**
 * Excepción lanzada cuando no se encuentra una entrega
 */
public class DeliveryNotFoundException extends RuntimeException {

    public DeliveryNotFoundException(UUID id) {
        super("Delivery not found with id: " + id);
    }

    public DeliveryNotFoundException(UUID orderId, boolean byOrder) {
        super("Delivery not found for order id: " + orderId);
    }
}
