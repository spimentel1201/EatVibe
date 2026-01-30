package com.foodrush.payment.domain.repository;

import com.foodrush.payment.domain.model.PaymentProvider;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Puerto (interfaz) para gateways de pago.
 * 
 * <p>
 * Define el contrato que deben cumplir todos los proveedores de pago.
 * Implementa el patrón Strategy permitiendo cambiar dinámicamente
 * entre diferentes gateways (Stripe, Yape, Niubiz) sin modificar
 * el código cliente.
 * </p>
 * 
 * <p>
 * Cada implementación (StripePaymentGateway, YapePaymentGateway)
 * debe residir en la capa de infraestructura.
 * </p>
 */
public interface PaymentGateway {

    /**
     * Procesa un pago con el gateway.
     * 
     * @param request Datos del pago a procesar
     * @return Resultado del procesamiento
     * @throws com.foodrush.payment.domain.exception.PaymentFailedException si el
     *                                                                      pago
     *                                                                      falla
     */
    PaymentResult processPayment(PaymentRequest request);

    /**
     * Procesa un reembolso.
     * 
     * @param transactionId ID de la transacción original
     * @param amount        Monto a reembolsar
     * @return Resultado del reembolso
     * @throws com.foodrush.payment.domain.exception.RefundFailedException si el
     *                                                                     reembolso
     *                                                                     falla
     */
    RefundResult processRefund(String transactionId, BigDecimal amount);

    /**
     * Obtiene el nombre del proveedor.
     * 
     * @return Provider enum (STRIPE, YAPE, NIUBIZ)
     */
    PaymentProvider getProvider();

    /**
     * Verifica si el gateway está disponible.
     * 
     * @return true si el gateway está operativo
     */
    boolean isAvailable();

    /**
     * Request para procesar un pago.
     */
    record PaymentRequest(
            UUID orderId,
            UUID userId,
            BigDecimal amount,
            String currency,
            String paymentMethodToken,
            String description) {
    }

    /**
     * Resultado del procesamiento de un pago.
     */
    record PaymentResult(
            boolean successful,
            String externalTransactionId,
            String errorCode,
            String errorMessage) {
        public static PaymentResult success(String externalTransactionId) {
            return new PaymentResult(true, externalTransactionId, null, null);
        }

        public static PaymentResult failure(String errorCode, String errorMessage) {
            return new PaymentResult(false, null, errorCode, errorMessage);
        }
    }

    /**
     * Resultado del procesamiento de un reembolso.
     */
    record RefundResult(
            boolean successful,
            String refundId,
            String errorCode,
            String errorMessage) {
        public static RefundResult success(String refundId) {
            return new RefundResult(true, refundId, null, null);
        }

        public static RefundResult failure(String errorCode, String errorMessage) {
            return new RefundResult(false, null, errorCode, errorMessage);
        }
    }
}
