package com.foodrush.order.domain.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Evento de dominio publicado cuando se crea un nuevo pedido.
 * 
 * <p>
 * Este evento se publica a Kafka para notificar a otros servicios
 * (Payment Service, Notification Service, etc.) sobre la creación del pedido.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreatedEvent {

    /**
     * ID del pedido creado
     */
    private UUID orderId;

    /**
     * ID del cliente que realizó el pedido
     */
    private UUID customerId;

    /**
     * ID del restaurante
     */
    private UUID restaurantId;

    /**
     * Monto total del pedido
     */
    private BigDecimal totalAmount;

    /**
     * Timestamp de creación del evento
     */
    @Builder.Default
    private Instant timestamp = Instant.now();

    /**
     * Tipo de evento
     */
    @Builder.Default
    private String eventType = "ORDER_CREATED";
}
