package com.foodrush.order.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * DTO de respuesta para un item de pedido.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Item individual de un pedido")
public class OrderItemResponse {

    @Schema(description = "ID único del item", example = "123e4567-e89b-12d3-a456-426614174003")
    private UUID id;

    @Schema(description = "ID del item del menú", example = "123e4567-e89b-12d3-a456-426614174004")
    private UUID menuItemId;

    @Schema(description = "Nombre del producto al momento de la compra", example = "Hamburguesa Clásica")
    private String productSnapshotName;

    @Schema(description = "Precio unitario al momento de la compra", example = "25.00")
    private BigDecimal unitSnapshotPrice;

    @Schema(description = "Cantidad de items", example = "2")
    private Integer quantity;

    @Schema(description = "Instrucciones especiales", example = "Sin cebolla, salsa aparte")
    private String specialInstructions;

    @Schema(description = "Subtotal del item (precio × cantidad)", example = "50.00")
    private BigDecimal subtotal;
}
