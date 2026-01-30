package com.foodrush.payment.domain.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Evento de dominio: Reembolso procesado.
 * 
 * <p>
 * Se publica cuando un reembolso se procesa exitosamente.
 * </p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefundProcessedEvent {

    /**
     * ID único del evento
     */
    private String eventId;

    /**
     * Tipo de evento
     */
    @Builder.Default
    private String eventType = "REFUND_PROCESSED";

    /**
     * Timestamp del evento
     */
    @Builder.Default
    private Instant timestamp = Instant.now();

    /**
     * ID de la transacción original
     */
    private UUID originalTransactionId;

    /**
     * ID del pedido
     */
    private UUID orderId;

    /**
     * ID del usuario
     */
    private UUID userId;

    /**
     * Monto reembolsado
     */
    private BigDecimal amount;

    /**
     * Moneda
     */
    private String currency;

    /**
     * ID del reembolso en el proveedor
     */
    private String refundId;

    /**
     * Razón del reembolso
     */
    private String reason;

    /**
     * Crea un evento con ID generado automáticamente.
     */
    public static RefundProcessedEvent create(
            UUID originalTransactionId,
            UUID orderId,
            UUID userId,
            BigDecimal amount,
            String currency,
            String refundId,
            String reason) {
        return RefundProcessedEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .originalTransactionId(originalTransactionId)
                .orderId(orderId)
                .userId(userId)
                .amount(amount)
                .currency(currency)
                .refundId(refundId)
                .reason(reason)
                .build();
    }
}
