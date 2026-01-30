package com.foodrush.payment.domain.exception;

import java.util.UUID;

/**
 * Excepción lanzada cuando falla el procesamiento de un reembolso.
 * 
 * <p>
 * Puede ocurrir por:
 * - Transacción original no encontrada
 * - Transacción ya reembolsada
 * - Error del gateway de pago
 * - Monto de reembolso inválido
 * </p>
 */
public class RefundFailedException extends RuntimeException {

    private final String errorCode;
    private final UUID transactionId;

    public RefundFailedException(String message) {
        super(message);
        this.errorCode = null;
        this.transactionId = null;
    }

    public RefundFailedException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
        this.transactionId = null;
    }

    public RefundFailedException(String message, String errorCode, UUID transactionId) {
        super(message);
        this.errorCode = errorCode;
        this.transactionId = transactionId;
    }

    public RefundFailedException(String message, Throwable cause) {
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
