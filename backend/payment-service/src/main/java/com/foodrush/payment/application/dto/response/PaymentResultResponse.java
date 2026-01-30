package com.foodrush.payment.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

/**
 * DTO de respuesta para el resultado de un procesamiento de pago.
 */
@Schema(description = "Resultado del procesamiento de un pago")
public record PaymentResultResponse(

        @Schema(description = "Indica si el pago fue exitoso", example = "true") boolean successful,

        @Schema(description = "ID de la transacción creada", example = "123e4567-e89b-12d3-a456-426614174002") UUID transactionId,

        @Schema(description = "ID de transacción externa del proveedor", example = "pi_1234567890") String externalTransactionId,

        @Schema(description = "Mensaje de error (si aplica)", example = "Tarjeta rechazada") String errorMessage,

        @Schema(description = "Código de error (si aplica)", example = "card_declined") String errorCode) {
    /**
     * Crea una respuesta de pago exitoso.
     */
    public static PaymentResultResponse success(UUID transactionId, String externalTransactionId) {
        return new PaymentResultResponse(true, transactionId, externalTransactionId, null, null);
    }

    /**
     * Crea una respuesta de pago fallido.
     */
    public static PaymentResultResponse failure(UUID transactionId, String errorCode, String errorMessage) {
        return new PaymentResultResponse(false, transactionId, null, errorMessage, errorCode);
    }
}
