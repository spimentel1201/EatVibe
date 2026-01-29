package com.foodrush.order.application.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * DTO para crear un nuevo pedido desde el carrito.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    @NotNull(message = "El ID del cliente es obligatorio")
    private UUID customerId;

    @NotNull(message = "El ID del restaurante es obligatorio")
    private UUID restaurantId;

    @NotNull(message = "El ID de la dirección de entrega es obligatorio")
    private UUID deliveryAddressId;

    @NotNull(message = "La tarifa de entrega es obligatoria")
    @DecimalMin(value = "0.0", message = "La tarifa de entrega debe ser mayor o igual a cero")
    private BigDecimal deliveryFee;
}
