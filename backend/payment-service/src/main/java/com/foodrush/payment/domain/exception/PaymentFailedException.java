package com.foodrush.payment.domain.exception;

import java.util.UUID;

/**
 * Excepción lanzada cuando falla el procesamiento de un pago.
 * 
 * <p>
 * Puede ocurrir por:
 * - Tarjeta rechazada
 * - Fondos insuficientes
 * - Error del gateway de pago
 * - Timeout de conexión
 * </p>
 */
public class PaymentFailedException extends RuntimeException {

    private final String errorCode;
    private final UUID transactionId;

    public PaymentFailedException(String message) {
        super(message);
        this.errorCode = null;
        this.transactionId = null;
    }

    public PaymentFailedException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
        this.transactionId = null;
    }

    public PaymentFailedException(String message, String errorCode, UUID transactionId) {
        super(message);
        this.errorCode = errorCode;
        this.transactionId = transactionId;
    }

    public PaymentFailedException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = null;
        this.transactionId = null;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public UUID getTransactionId() {
        return transactionId;
    }
}
