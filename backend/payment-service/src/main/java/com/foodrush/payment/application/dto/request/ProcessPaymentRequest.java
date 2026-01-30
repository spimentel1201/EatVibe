package com.foodrush.payment.application.dto.request;

import com.foodrush.payment.domain.model.PaymentProvider;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * DTO para solicitar el procesamiento de un pago.
 */
@Schema(description = "Solicitud para procesar un pago")
public record ProcessPaymentRequest(

        @Schema(description = "ID del pedido", example = "123e4567-e89b-12d3-a456-426614174000") @NotNull(message = "El ID del pedido es obligatorio") UUID orderId,

        @Schema(description = "ID del usuario", example = "123e4567-e89b-12d3-a456-426614174001") @NotNull(message = "El ID del usuario es obligatorio") UUID userId,

        @Schema(description = "Monto a pagar", example = "65.50") @NotNull(message = "El monto es obligatorio") @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0") @Digits(integer = 8, fraction = 2, message = "El monto debe tener máximo 8 dígitos enteros y 2 decimales") BigDecimal amount,

        @Schema(description = "Moneda (ISO 4217)", example = "PEN") @NotBlank(message = "La moneda es obligatoria") @Size(min = 3, max = 3, message = "La moneda debe tener 3 caracteres") String currency,

        @Schema(description = "Proveedor de pago", example = "STRIPE") @NotNull(message = "El proveedor de pago es obligatorio") PaymentProvider provider,

        @Schema(description = "Token del método de pago", example = "pm_1234567890") @NotBlank(message = "El token del método de pago es obligatorio") String paymentMethodToken,

        @Schema(description = "Descripción del pago", example = "Pago de pedido #12345") @Size(max = 255, message = "La descripción no puede exceder 255 caracteres") String description) {
    /**
     * Constructor con valores por defecto.
     */
    public ProcessPaymentRequest {
        if (currency == null || currency.isBlank()) {
            currency = "PEN";
        }
        if (description == null || description.isBlank()) {
            description = "Pago de pedido " + orderId;
        }
    }
}
