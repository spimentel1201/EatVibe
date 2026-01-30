package com.foodrush.payment.application.dto.response;

import com.foodrush.payment.domain.model.PaymentMethodType;
import com.foodrush.payment.domain.model.PaymentProvider;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.UUID;

/**
 * DTO de respuesta para un método de pago.
 */
@Schema(description = "Información de un método de pago")
public record PaymentMethodResponse(

        @Schema(description = "ID del método de pago", example = "123e4567-e89b-12d3-a456-426614174003") UUID id,

        @Schema(description = "ID del usuario", example = "123e4567-e89b-12d3-a456-426614174001") UUID userId,

        @Schema(description = "Tipo de método de pago", example = "CARD") PaymentMethodType type,

        @Schema(description = "Número enmascarado", example = "****1234") String maskedNumber,

        @Schema(description = "Proveedor del token", example = "STRIPE") PaymentProvider provider,

        @Schema(description = "Indica si es el método predeterminado", example = "true") Boolean isDefault,

        @Schema(description = "Fecha de creación", example = "2026-01-29T23:45:00Z") Instant createdAt) {
}
