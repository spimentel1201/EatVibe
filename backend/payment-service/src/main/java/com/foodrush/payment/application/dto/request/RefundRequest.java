package com.foodrush.payment.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * DTO para solicitar un reembolso.
 */
@Schema(description = "Solicitud para procesar un reembolso")
public record RefundRequest(

        @Schema(description = "ID de la transacción original", example = "123e4567-e89b-12d3-a456-426614174002") @NotNull(message = "El ID de la transacción es obligatorio") UUID transactionId,

        @Schema(description = "Monto a reembolsar (opcional, si no se especifica se reembolsa el total)", example = "65.50") @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0") @Digits(integer = 8, fraction = 2, message = "El monto debe tener máximo 8 dígitos enteros y 2 decimales") BigDecimal amount,

        @Schema(description = "Razón del reembolso", example = "Pedido cancelado por el cliente") @Size(max = 255, message = "La razón no puede exceder 255 caracteres") String reason) {
    /**
     * Constructor con valores por defecto.
     */
    public RefundRequest {
        if (reason == null || reason.isBlank()) {
            reason = "Reembolso solicitado";
        }
    }
}
