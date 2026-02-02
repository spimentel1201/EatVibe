package com.foodrush.courier.application.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * DTO para crear una nueva entrega
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateDeliveryRequest {

    @NotNull(message = "Order ID is required")
    private UUID orderId;

    @NotNull(message = "Pickup latitude is required")
    private Double pickupLatitude;

    @NotNull(message = "Pickup longitude is required")
    private Double pickupLongitude;

    @NotNull(message = "Delivery latitude is required")
    private Double deliveryLatitude;

    @NotNull(message = "Delivery longitude is required")
    private Double deliveryLongitude;

    /**
     * PIN de 6 dígitos para verificación de entrega
     */
    private String deliveryPin;
}
