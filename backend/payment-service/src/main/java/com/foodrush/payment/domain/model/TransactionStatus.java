package com.foodrush.payment.domain.model;

/**
 * Estados posibles de una transacción de pago.
 * 
 * <p>
 * Flujo típico: PENDING → COMPLETED
 * Flujo de error: PENDING → FAILED → REFUNDED (opcional)
 * </p>
 */
public enum TransactionStatus {
    /**
     * Transacción creada, esperando procesamiento
     */
    PENDING,

    /**
     * Pago completado exitosamente
     */
    COMPLETED,

    /**
     * Pago falló (tarjeta rechazada, fondos insuficientes, etc.)
     */
    FAILED,

    /**
     * Pago reembolsado total o parcialmente
     */
    REFUNDED
}
