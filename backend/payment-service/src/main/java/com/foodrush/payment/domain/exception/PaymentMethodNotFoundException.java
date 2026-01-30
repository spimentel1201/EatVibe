package com.foodrush.payment.domain.exception;

import java.util.UUID;

/**
 * Excepción lanzada cuando no se encuentra un método de pago.
 */
public class PaymentMethodNotFoundException extends RuntimeException {

    private final UUID paymentMethodId;

    public PaymentMethodNotFoundException(UUID paymentMethodId) {
        super(String.format("Método de pago no encontrado con ID: %s", paymentMethodId));
        this.paymentMethodId = paymentMethodId;
    }

    public PaymentMethodNotFoundException(String message) {
        super(message);
        this.paymentMethodId = null;
    }

    public UUID getPaymentMethodId() {
        return paymentMethodId;
    }
}
