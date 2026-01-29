package com.foodrush.order.application.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * DTO para agregar un item al carrito.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddToCartRequest {

    @NotNull(message = "El ID del cliente es obligatorio")
    private UUID customerId;

    @NotNull(message = "El ID del restaurante es obligatorio")
    private UUID restaurantId;

    @NotNull(message = "El ID del item del menú es obligatorio")
    private UUID menuItemId;

    @NotBlank(message = "El nombre del producto es obligatorio")
    private String productName;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a cero")
    private BigDecimal price;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    private Integer quantity;

    private String specialInstructions;
}
