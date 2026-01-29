package com.foodrush.order.api.rest.controller;

import com.foodrush.order.application.dto.request.CreateOrderRequest;
import com.foodrush.order.application.dto.request.UpdateOrderStatusRequest;
import com.foodrush.order.application.dto.response.OrderResponse;
import com.foodrush.order.application.usecase.CreateOrderUseCase;
import com.foodrush.order.application.usecase.GetOrderByIdUseCase;
import com.foodrush.order.application.usecase.GetOrdersByCustomerUseCase;
import com.foodrush.order.application.usecase.UpdateOrderStatusUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Controlador REST para la gestión de pedidos.
 */
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Pedidos", description = "API para gestionar pedidos")
public class OrderController {

    private final CreateOrderUseCase createOrderUseCase;
    private final GetOrderByIdUseCase getOrderByIdUseCase;
    private final GetOrdersByCustomerUseCase getOrdersByCustomerUseCase;
    private final UpdateOrderStatusUseCase updateOrderStatusUseCase;

    @PostMapping
    @Operation(summary = "Crear pedido", description = "Crea un nuevo pedido a partir del carrito temporal almacenado en Redis. "
            +
            "El carrito debe contener al menos un item y pertenecer al restaurante especificado.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Pedido creado exitosamente", content = @Content(schema = @Schema(implementation = OrderResponse.class))),
            @ApiResponse(responseCode = "400", description = "Carrito vacío o datos inválidos"),
            @ApiResponse(responseCode = "404", description = "Carrito no encontrado")
    })
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody CreateOrderRequest request) {
        OrderResponse response = createOrderUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consultar pedido", description = "Obtiene los detalles completos de un pedido por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pedido encontrado", content = @Content(schema = @Schema(implementation = OrderResponse.class))),
            @ApiResponse(responseCode = "404", description = "Pedido no encontrado")
    })
    public ResponseEntity<OrderResponse> getOrderById(
            @Parameter(description = "ID del pedido", required = true) @PathVariable UUID id) {
        OrderResponse response = getOrderByIdUseCase.execute(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Listar pedidos del cliente", description = "Obtiene todos los pedidos realizados por un cliente específico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de pedidos del cliente", content = @Content(schema = @Schema(implementation = OrderResponse.class)))
    })
    public ResponseEntity<List<OrderResponse>> getOrdersByCustomer(
            @Parameter(description = "ID del cliente", required = true) @PathVariable UUID customerId) {
        List<OrderResponse> response = getOrdersByCustomerUseCase.execute(customerId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Cambiar estado del pedido", description = "Actualiza el estado del pedido validando que la transición sea permitida "
            +
            "según la máquina de estados. Solo para uso interno o administradores.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Estado actualizado exitosamente", content = @Content(schema = @Schema(implementation = OrderResponse.class))),
            @ApiResponse(responseCode = "400", description = "Transición de estado inválida"),
            @ApiResponse(responseCode = "404", description = "Pedido no encontrado")
    })
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @Parameter(description = "ID del pedido", required = true) @PathVariable UUID id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        OrderResponse response = updateOrderStatusUseCase.execute(id, request);
        return ResponseEntity.ok(response);
    }
}
