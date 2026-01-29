package com.foodrush.order.domain.exception;

import java.util.UUID;

/**
 * Excepción lanzada cuando no se encuentra un pedido.
 */
public class OrderNotFoundException extends RuntimeException {

    public OrderNotFoundException(UUID orderId) {
        super(String.format("Pedido no encontrado con ID: %s", orderId));
    }

    public OrderNotFoundException(String message) {
        super(message);
    }

    public OrderNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
