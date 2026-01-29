package com.foodrush.order.application.dto.response;

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
 * DTO de respuesta para el carrito de compras.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Carrito de compras temporal")
public class CartResponse {

    @Schema(description = "ID del cliente dueño del carrito")
    private UUID customerId;

    @Schema(description = "ID del restaurante")
    private UUID restaurantId;

    @Schema(description = "Items en el carrito")
    private List<CartItemResponse> items;

    @Schema(description = "Subtotal del carrito", example = "45.50")
    private BigDecimal subtotal;

    @Schema(description = "Fecha de creación del carrito")
    private Instant createdAt;

    @Schema(description = "Fecha de última actualización")
    private Instant updatedAt;

    @Schema(description = "Indica si el carrito está vacío")
    private boolean empty;
}
