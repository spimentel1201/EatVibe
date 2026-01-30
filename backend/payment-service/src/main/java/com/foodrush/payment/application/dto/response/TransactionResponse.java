package com.foodrush.payment.application.dto.response;

import com.foodrush.payment.domain.model.PaymentProvider;
import com.foodrush.payment.domain.model.TransactionStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * DTO de respuesta para una transacción.
 */
@Schema(description = "Información de una transacción de pago")
public record TransactionResponse(

        @Schema(description = "ID de la transacción", example = "123e4567-e89b-12d3-a456-426614174002") UUID id,

        @Schema(description = "ID del pedido", example = "123e4567-e89b-12d3-a456-426614174000") UUID orderId,

        @Schema(description = "ID del usuario", example = "123e4567-e89b-12d3-a456-426614174001") UUID userId,

        @Schema(description = "Monto de la transacción", example = "65.50") BigDecimal amount,

        @Schema(description = "Moneda", example = "PEN") String currency,

        @Schema(description = "Estado de la transacción", example = "COMPLETED") TransactionStatus status,

        @Schema(description = "Proveedor de pago", example = "STRIPE") PaymentProvider provider,

        @Schema(description = "ID de transacción externa", example = "pi_1234567890") String externalTransactionId,

        @Schema(description = "Mensaje de error (si aplica)", example = "Tarjeta rechazada") String errorMessage,

        @Schema(description = "Código de error (si aplica)", example = "card_declined") String errorCode,

        @Schema(description = "Fecha de creación", example = "2026-01-29T23:45:00Z") Instant createdAt,

        @Schema(description = "Fecha de actualización", example = "2026-01-29T23:46:00Z") Instant updatedAt) {
}
