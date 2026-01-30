package com.foodrush.payment.infrastructure.gateway;

import com.foodrush.payment.domain.exception.PaymentFailedException;
import com.foodrush.payment.domain.exception.RefundFailedException;
import com.foodrush.payment.domain.model.PaymentProvider;
import com.foodrush.payment.domain.repository.PaymentGateway;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Implementación del gateway de pago para Stripe.
 * 
 * <p>
 * Integración real con Stripe SDK para:
 * - Procesamiento de pagos con tarjeta
 * - Reembolsos
 * - Manejo de errores específicos de Stripe
 * </p>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class StripePaymentGateway implements PaymentGateway {

    @Override
    public PaymentResult processPayment(PaymentRequest request) {
        log.info("Procesando pago con Stripe - Order: {}, Amount: {} {}",
                request.orderId(), request.amount(), request.currency());

        try {
            // Convertir monto a centavos (Stripe usa centavos)
            long amountInCents = request.amount().multiply(BigDecimal.valueOf(100)).longValue();

            // Crear PaymentIntent
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency(request.currency().toLowerCase())
                    .setPaymentMethod(request.paymentMethodToken())
                    .setConfirm(true)
                    .setDescription(request.description())
                    .putMetadata("order_id", request.orderId().toString())
                    .putMetadata("user_id", request.userId().toString())
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .setAllowRedirects(
                                            PaymentIntentCreateParams.AutomaticPaymentMethods.AllowRedirects.NEVER)
                                    .build())
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);

            // Verificar estado
            if ("succeeded".equals(intent.getStatus())) {
                log.info("Pago exitoso con Stripe - PaymentIntent: {}", intent.getId());
                return PaymentResult.success(intent.getId());
            } else if ("requires_action".equals(intent.getStatus())) {
                log.warn("Pago requiere acción adicional - PaymentIntent: {}", intent.getId());
                return PaymentResult.failure("requires_action", "El pago requiere autenticación 3D Secure");
            } else {
                log.error("Pago falló con estado: {}", intent.getStatus());
                return PaymentResult.failure("payment_failed", "El pago no pudo ser procesado");
            }

        } catch (StripeException e) {
            log.error("Error de Stripe al procesar pago: {}", e.getMessage(), e);

            String errorCode = e.getCode() != null ? e.getCode() : "stripe_error";
            String errorMessage = e.getUserMessage() != null ? e.getUserMessage() : e.getMessage();

            throw new PaymentFailedException(
                    String.format("Error al procesar pago con Stripe: %s", errorMessage),
                    errorCode);
        }
    }

    @Override
    public RefundResult processRefund(String transactionId, BigDecimal amount) {
        log.info("Procesando reembolso con Stripe - PaymentIntent: {}, Amount: {}",
                transactionId, amount);

        try {
            // Convertir monto a centavos
            long amountInCents = amount.multiply(BigDecimal.valueOf(100)).longValue();

            // Crear Refund
            RefundCreateParams params = RefundCreateParams.builder()
                    .setPaymentIntent(transactionId)
                    .setAmount(amountInCents)
                    .build();

            Refund refund = Refund.create(params);

            if ("succeeded".equals(refund.getStatus())) {
                log.info("Reembolso exitoso - Refund ID: {}", refund.getId());
                return RefundResult.success(refund.getId());
            } else {
                log.error("Reembolso falló con estado: {}", refund.getStatus());
                return RefundResult.failure("refund_failed", "El reembolso no pudo ser procesado");
            }

        } catch (StripeException e) {
            log.error("Error de Stripe al procesar reembolso: {}", e.getMessage(), e);

            String errorCode = e.getCode() != null ? e.getCode() : "stripe_error";
            String errorMessage = e.getUserMessage() != null ? e.getUserMessage() : e.getMessage();

            throw new RefundFailedException(
                    String.format("Error al procesar reembolso con Stripe: %s", errorMessage),
                    errorCode);
        }
    }

    @Override
    public PaymentProvider getProvider() {
        return PaymentProvider.STRIPE;
    }

    @Override
    public boolean isAvailable() {
        // En producción, podríamos verificar el estado de Stripe API
        return true;
    }
}
