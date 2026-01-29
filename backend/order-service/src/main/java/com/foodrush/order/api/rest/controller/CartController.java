package com.foodrush.order.api.rest.controller;

import com.foodrush.order.application.dto.request.AddToCartRequest;
import com.foodrush.order.application.dto.response.CartResponse;
import com.foodrush.order.application.usecase.AddToCartUseCase;
import com.foodrush.order.application.usecase.ClearCartUseCase;
import com.foodrush.order.application.usecase.GetCartUseCase;
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

import java.util.UUID;

/**
 * Controlador REST para la gestión del carrito de compras.
 */
@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@Tag(name = "Carrito", description = "API para gestionar el carrito de compras temporal")
public class CartController {

    private final AddToCartUseCase addToCartUseCase;
    private final GetCartUseCase getCartUseCase;
    private final ClearCartUseCase clearCartUseCase;

    @PostMapping("/items")
    @Operation(summary = "Agregar item al carrito", description = "Agrega un item del menú al carrito temporal del cliente en Redis. "
            +
            "Si el item ya existe, se actualiza la cantidad. " +
            "El carrito tiene un TTL de 24 horas.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Item agregado exitosamente", content = @Content(schema = @Schema(implementation = CartResponse.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o intento de agregar items de diferentes restaurantes")
    })
    public ResponseEntity<CartResponse> addToCart(
            @Valid @RequestBody AddToCartRequest request) {
        CartResponse response = addToCartUseCase.execute(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{customerId}")
    @Operation(summary = "Obtener carrito", description = "Obtiene el carrito actual del cliente. Si no existe, retorna un carrito vacío.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Carrito del cliente", content = @Content(schema = @Schema(implementation = CartResponse.class)))
    })
    public ResponseEntity<CartResponse> getCart(
            @Parameter(description = "ID del cliente", required = true) @PathVariable UUID customerId) {
        CartResponse response = getCartUseCase.execute(customerId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{customerId}")
    @Operation(summary = "Vaciar carrito", description = "Elimina todos los items del carrito del cliente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Carrito vaciado exitosamente")
    })
    public ResponseEntity<Void> clearCart(
            @Parameter(description = "ID del cliente", required = true) @PathVariable UUID customerId) {
        clearCartUseCase.execute(customerId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
