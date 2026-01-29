package com.foodrush.order.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * DTO de respuesta para un item del carrito.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Item individual en el carrito")
public class CartItemResponse {

    @Schema(description = "ID del item del menú")
    private UUID menuItemId;

    @Schema(description = "Nombre del producto", example = "Hamburguesa Clásica")
    private String productName;

    @Schema(description = "Precio unitario", example = "25.00")
    private BigDecimal price;

    @Schema(description = "Cantidad", example = "2")
    private Integer quantity;

    @Schema(description = "Instrucciones especiales", example = "Sin cebolla")
    private String specialInstructions;

    @Schema(description = "Subtotal del item", example = "50.00")
    private BigDecimal subtotal;
}
