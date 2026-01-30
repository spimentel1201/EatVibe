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
 * Evento de dominio: Pago completado exitosamente.
 * 
 * <p>
 * Se publica cuando un pago se procesa exitosamente.
 * Otros servicios pueden escuchar este evento para:
 * - Actualizar estado del pedido (Order Service)
 * - Enviar notificaciones (Notification Service)
 * - Actualizar métricas (Analytics Service)
 * </p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentCompletedEvent {

    /**
     * ID único del evento
     */
    private String eventId;

    /**
     * Tipo de evento
     */
    @Builder.Default
    private String eventType = "PAYMENT_COMPLETED";

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
     * Monto pagado
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
     * ID de transacción externa del proveedor
     */
    private String externalTransactionId;

    /**
     * Crea un evento con ID generado automáticamente.
     */
    public static PaymentCompletedEvent create(
            UUID transactionId,
            UUID orderId,
            UUID userId,
            BigDecimal amount,
            String currency,
            PaymentProvider provider,
            String externalTransactionId) {
        return PaymentCompletedEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .transactionId(transactionId)
                .orderId(orderId)
                .userId(userId)
                .amount(amount)
                .currency(currency)
                .provider(provider)
                .externalTransactionId(externalTransactionId)
                .build();
    }
}
