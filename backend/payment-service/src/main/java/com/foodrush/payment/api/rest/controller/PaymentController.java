package com.foodrush.payment.api.rest.controller;

import com.foodrush.payment.application.dto.request.ProcessPaymentRequest;
import com.foodrush.payment.application.dto.response.PaymentResultResponse;
import com.foodrush.payment.application.dto.response.TransactionResponse;
import com.foodrush.payment.application.mapper.PaymentMapper;
import com.foodrush.payment.application.usecase.GetTransactionByIdUseCase;
import com.foodrush.payment.application.usecase.ProcessPaymentUseCase;
import com.foodrush.payment.domain.repository.TransactionRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Controlador REST para operaciones de pago.
 */
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Pagos", description = "Endpoints para procesamiento de pagos y gestión de transacciones")
public class PaymentController {

    private final ProcessPaymentUseCase processPaymentUseCase;
    private final GetTransactionByIdUseCase getTransactionByIdUseCase;
    private final TransactionRepository transactionRepository;
    private final PaymentMapper mapper;

    @PostMapping("/process")
    @Operation(summary = "Procesar un pago", description = "Procesa un pago utilizando el proveedor especificado (Stripe, Yape, etc.)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pago procesado exitosamente", content = @Content(schema = @Schema(implementation = PaymentResultResponse.class))),
            @ApiResponse(responseCode = "400", description = "Datos de pago inválidos", content = @Content(schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500", description = "Error al procesar el pago", content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    })
    public ResponseEntity<PaymentResultResponse> processPayment(
            @Valid @RequestBody ProcessPaymentRequest request) {
        log.info("POST /api/v1/payments/process - Order: {}, Provider: {}",
                request.orderId(), request.provider());

        PaymentResultResponse response = processPaymentUseCase.execute(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/transactions/{id}")
    @Operation(summary = "Obtener transacción por ID", description = "Obtiene los detalles de una transacción específica")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Transacción encontrada", content = @Content(schema = @Schema(implementation = TransactionResponse.class))),
            @ApiResponse(responseCode = "404", description = "Transacción no encontrada", content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    })
    public ResponseEntity<TransactionResponse> getTransactionById(
            @Parameter(description = "ID de la transacción", example = "123e4567-e89b-12d3-a456-426614174002") @PathVariable UUID id) {
        log.info("GET /api/v1/payments/transactions/{}", id);

        return getTransactionByIdUseCase.execute(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/orders/{orderId}/transactions")
    @Operation(summary = "Obtener transacciones de un pedido", description = "Obtiene todas las transacciones asociadas a un pedido")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de transacciones", content = @Content(schema = @Schema(implementation = TransactionResponse.class)))
    })
    public ResponseEntity<List<TransactionResponse>> getTransactionsByOrderId(
            @Parameter(description = "ID del pedido", example = "123e4567-e89b-12d3-a456-426614174000") @PathVariable UUID orderId) {
        log.info("GET /api/v1/payments/orders/{}/transactions", orderId);

        List<TransactionResponse> transactions = transactionRepository.findByOrderId(orderId)
                .stream()
                .map(mapper::toTransactionResponse)
                .toList();

        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/users/{userId}/transactions")
    @Operation(summary = "Obtener transacciones de un usuario", description = "Obtiene todas las transacciones de un usuario")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de transacciones del usuario", content = @Content(schema = @Schema(implementation = TransactionResponse.class)))
    })
    public ResponseEntity<List<TransactionResponse>> getTransactionsByUserId(
            @Parameter(description = "ID del usuario", example = "123e4567-e89b-12d3-a456-426614174001") @PathVariable UUID userId) {
        log.info("GET /api/v1/payments/users/{}/transactions", userId);

        List<TransactionResponse> transactions = transactionRepository.findByUserId(userId)
                .stream()
                .map(mapper::toTransactionResponse)
                .toList();

        return ResponseEntity.ok(transactions);
    }
}
