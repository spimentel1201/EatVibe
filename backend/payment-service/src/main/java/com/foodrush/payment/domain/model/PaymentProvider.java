package com.foodrush.payment.domain.model;

/**
 * Proveedores de pago soportados por el sistema.
 * 
 * <p>
 * Cada proveedor tiene su propia implementación de PaymentGateway
 * siguiendo el patrón Strategy.
 * </p>
 */
public enum PaymentProvider {
    /**
     * Stripe - Pagos con tarjeta de crédito/débito internacional
     */
    STRIPE,

    /**
     * Yape - Billetera digital peruana
     */
    YAPE,

    /**
     * Niubiz - Pasarela de pagos peruana (futuro)
     */
    NIUBIZ
}
