package com.foodrush.courier.api.rest.controller;

import com.foodrush.courier.application.usecase.AssignCourierToDeliveryUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

/**
 * REST Controller para gestión de deliveries
 */
@RestController
@RequestMapping("/api/v1/deliveries")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Delivery Management", description = "Endpoints para gestión de entregas")
public class DeliveryController {

    private final AssignCourierToDeliveryUseCase assignCourierToDeliveryUseCase;

    /**
     * Asigna automáticamente el mejor courier disponible a una entrega
     */
    @PostMapping("/{deliveryId}/assign")
    @Operation(summary = "Asignar courier automáticamente", description = "Encuentra y asigna el mejor courier disponible basado en distancia, vehículo y rating")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Courier asignado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Delivery no encontrada"),
            @ApiResponse(responseCode = "400", description = "Delivery no está en estado PENDING"),
            @ApiResponse(responseCode = "503", description = "No hay couriers disponibles")
    })
    public ResponseEntity<Map<String, UUID>> assignCourier(
            @Parameter(description = "ID de la entrega", required = true) @PathVariable UUID deliveryId) {
        log.info("Received request to assign courier to delivery: {}", deliveryId);

        UUID courierId = assignCourierToDeliveryUseCase.execute(deliveryId);

        return ResponseEntity.ok(Map.of("courierId", courierId));
    }

    /**
     * Asigna un courier específico a una entrega (asignación manual)
     */
    @PostMapping("/{deliveryId}/assign/{courierId}")
    @Operation(summary = "Asignar courier manualmente", description = "Asigna un courier específico a una entrega")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Courier asignado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Delivery o Courier no encontrado"),
            @ApiResponse(responseCode = "400", description = "Courier no puede recibir entregas")
    })
    public ResponseEntity<Void> assignSpecificCourier(
            @Parameter(description = "ID de la entrega", required = true) @PathVariable UUID deliveryId,

            @Parameter(description = "ID del courier", required = true) @PathVariable UUID courierId) {
        log.info("Received request to manually assign courier {} to delivery {}",
                courierId, deliveryId);

        assignCourierToDeliveryUseCase.assignSpecificCourier(deliveryId, courierId);

        return ResponseEntity.ok().build();
    }
}
