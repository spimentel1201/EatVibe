package com.foodrush.order.application.dto.request;

import com.foodrush.order.domain.model.OrderStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para actualizar el estado de un pedido.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderStatusRequest {

    @NotNull(message = "El nuevo estado es obligatorio")
    private OrderStatus newStatus;

    @NotBlank(message = "La razón del cambio es obligatoria")
    private String reason;
}
