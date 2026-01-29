package com.foodrush.order.domain.exception;

/**
 * Excepción lanzada cuando se intenta una transición de estado inválida.
 */
public class InvalidOrderStateTransitionException extends RuntimeException {

    public InvalidOrderStateTransitionException(String message) {
        super(message);
    }

    public InvalidOrderStateTransitionException(String message, Throwable cause) {
        super(message, cause);
    }
}
