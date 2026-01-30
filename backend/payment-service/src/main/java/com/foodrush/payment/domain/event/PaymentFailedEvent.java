package com.foodrush.payment.domain.event;

import com.foodrush.payment.domain.model.PaymentProvider;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Evento de dominio: Pago fallido.
 * 
 * <p>
 * Se publica cuando un pago falla.
 * Permite a otros servicios:
 * - Actualizar estado del pedido a PAYMENT_FAILED
 * - Notificar al usuario del error
 * - Registrar métricas de fallos
 * </p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentFailedEvent {

    /**
     * ID único del evento
     */
    private String eventId;

    /**
     * Tipo de evento
     */
    @Builder.Default
    private String eventType = "PAYMENT_FAILED";

    /**
     * Timestamp del evento
     */
    @Builder.Default
    private Instant timestamp = Instant.now();

    /**
     * ID de la transacción
     */
    private UUID transactionId;

    /**
     * ID del pedido
     */
    private UUID orderId;

    /**
     * ID del usuario
     */
    private UUID userId;

    /**
     * Monto que se intentó pagar
     */
    private BigDecimal amount;

    /**
     * Moneda
     */
    private String currency;

    /**
     * Proveedor de pago utilizado
     */
    private PaymentProvider provider;

    /**
     * Código de error
     */
    private String errorCode;

    /**
     * Mensaje de error
     */
    private String errorMessage;

    /**
     * Crea un evento con ID generado automáticamente.
     */
    public static PaymentFailedEvent create(
            UUID transactionId,
            UUID orderId,
            UUID userId,
            BigDecimal amount,
            String currency,
            PaymentProvider provider,
            String errorCode,
            String errorMessage) {
        return PaymentFailedEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .transactionId(transactionId)
                .orderId(orderId)
                .userId(userId)
                .amount(amount)
                .currency(currency)
                .provider(provider)
                .errorCode(errorCode)
                .errorMessage(errorMessage)
                .build();
    }
}
