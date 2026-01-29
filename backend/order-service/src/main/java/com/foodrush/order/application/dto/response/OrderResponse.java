package com.foodrush.order.application.dto.response;

import com.foodrush.order.domain.model.OrderStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * DTO de respuesta para un pedido.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Información completa de un pedido")
public class OrderResponse {

    @Schema(description = "ID único del pedido", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;

    @Schema(description = "ID del cliente", example = "123e4567-e89b-12d3-a456-426614174001")
    private UUID customerId;

    @Schema(description = "ID del restaurante", example = "123e4567-e89b-12d3-a456-426614174002")
    private UUID restaurantId;

    @Schema(description = "ID del repartidor (puede ser null si aún no está asignado)")
    private UUID courierId;

    @Schema(description = "Estado actual del pedido", example = "CREATED")
    private OrderStatus status;

    @Schema(description = "Subtotal del pedido (sin tarifa de entrega)", example = "45.50")
    private BigDecimal subtotal;

    @Schema(description = "Tarifa de entrega", example = "5.00")
    private BigDecimal deliveryFee;

    @Schema(description = "Monto total del pedido", example = "50.50")
    private BigDecimal totalAmount;

    @Schema(description = "Items del pedido")
    private List<OrderItemResponse> items;

    @Schema(description = "Fecha y hora de creación del pedido")
    private Instant createdAt;

    @Schema(description = "Fecha y hora de última actualización")
    private Instant updatedAt;

    @Schema(description = "Tiempo estimado de entrega")
    private Instant estimatedDeliveryTime;
}
