package com.foodrush.payment.api.rest.controller;

import com.foodrush.payment.application.dto.request.CreatePaymentMethodRequest;
import com.foodrush.payment.application.dto.response.PaymentMethodResponse;
import com.foodrush.payment.application.usecase.CreatePaymentMethodUseCase;
import com.foodrush.payment.application.usecase.GetPaymentMethodsByUserUseCase;
import com.foodrush.payment.domain.exception.PaymentMethodNotFoundException;
import com.foodrush.payment.domain.repository.PaymentMethodRepository;
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
 * Controlador REST para métodos de pago.
 */
@RestController
@RequestMapping("/api/v1/payment-methods")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Métodos de Pago", description = "Endpoints para gestión de métodos de pago tokenizados")
public class PaymentMethodController {

    private final CreatePaymentMethodUseCase createPaymentMethodUseCase;
    private final GetPaymentMethodsByUserUseCase getPaymentMethodsByUserUseCase;
    private final PaymentMethodRepository paymentMethodRepository;

    @PostMapping
    @Operation(summary = "Crear método de pago", description = "Crea un nuevo método de pago tokenizado. NUNCA enviar datos sensibles de tarjetas.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Método de pago creado exitosamente", content = @Content(schema = @Schema(implementation = PaymentMethodResponse.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    })
    public ResponseEntity<PaymentMethodResponse> createPaymentMethod(
            @Valid @RequestBody CreatePaymentMethodRequest request) {
        log.info("POST /api/v1/payment-methods - User: {}, Type: {}",
                request.userId(), request.type());

        PaymentMethodResponse response = createPaymentMethodUseCase.execute(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Obtener métodos de pago de un usuario", description = "Obtiene todos los métodos de pago de un usuario")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de métodos de pago", content = @Content(schema = @Schema(implementation = PaymentMethodResponse.class)))
    })
    public ResponseEntity<List<PaymentMethodResponse>> getPaymentMethodsByUser(
            @Parameter(description = "ID del usuario", example = "123e4567-e89b-12d3-a456-426614174001") @PathVariable UUID userId) {
        log.info("GET /api/v1/payment-methods/user/{}", userId);

        List<PaymentMethodResponse> paymentMethods = getPaymentMethodsByUserUseCase.execute(userId);

        return ResponseEntity.ok(paymentMethods);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar método de pago", description = "Elimina un método de pago por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Método de pago eliminado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Método de pago no encontrado", content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    })
    public ResponseEntity<Void> deletePaymentMethod(
            @Parameter(description = "ID del método de pago", example = "123e4567-e89b-12d3-a456-426614174003") @PathVariable UUID id) {
        log.info("DELETE /api/v1/payment-methods/{}", id);

        if (!paymentMethodRepository.existsById(id)) {
            throw new PaymentMethodNotFoundException(id);
        }

        paymentMethodRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
