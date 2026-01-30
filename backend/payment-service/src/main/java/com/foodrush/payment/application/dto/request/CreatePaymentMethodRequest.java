package com.foodrush.payment.application.dto.request;

import com.foodrush.payment.domain.model.PaymentMethodType;
import com.foodrush.payment.domain.model.PaymentProvider;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

/**
 * DTO para crear un método de pago.
 */
@Schema(description = "Solicitud para crear un método de pago")
public record CreatePaymentMethodRequest(

        @Schema(description = "ID del usuario", example = "123e4567-e89b-12d3-a456-426614174001") @NotNull(message = "El ID del usuario es obligatorio") UUID userId,

        @Schema(description = "Tipo de método de pago", example = "CARD") @NotNull(message = "El tipo de método de pago es obligatorio") PaymentMethodType type,

        @Schema(description = "Número enmascarado", example = "****1234") @Size(max = 20, message = "El número enmascarado no puede exceder 20 caracteres") String maskedNumber,

        @Schema(description = "Token del proveedor", example = "pm_1234567890") @NotBlank(message = "El token es obligatorio") @Size(max = 255, message = "El token no puede exceder 255 caracteres") String token,

        @Schema(description = "Proveedor del token", example = "STRIPE") @NotNull(message = "El proveedor es obligatorio") PaymentProvider provider,

        @Schema(description = "Marcar como método predeterminado", example = "true") Boolean isDefault) {
    /**
     * Constructor con valores por defecto.
     */
    public CreatePaymentMethodRequest {
        if (isDefault == null) {
            isDefault = false;
        }
    }
}
