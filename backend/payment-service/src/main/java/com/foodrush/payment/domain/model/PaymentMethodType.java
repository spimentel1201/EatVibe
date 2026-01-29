package com.foodrush.payment.domain.model;

/**
 * Tipos de métodos de pago soportados.
 */
public enum PaymentMethodType {
    /**
     * Tarjeta de crédito o débito
     */
    CARD,

    /**
     * Billetera digital (Yape, etc.)
     */
    WALLET
}
