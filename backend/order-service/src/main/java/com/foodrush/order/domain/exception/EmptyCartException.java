package com.foodrush.order.domain.exception;

import java.util.UUID;

/**
 * Excepción lanzada cuando se intenta crear un pedido con un carrito vacío.
 */
public class EmptyCartException extends RuntimeException {

    public EmptyCartException(UUID customerId) {
        super(String.format("El carrito del cliente %s está vacío. No se puede crear un pedido.", customerId));
    }

    public EmptyCartException(String message) {
        super(message);
    }

    public EmptyCartException(String message, Throwable cause) {
        super(message, cause);
    }
}
