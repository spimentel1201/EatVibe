package com.foodrush.courier.api.rest.controller;

import com.foodrush.courier.application.dto.request.CompleteDeliveryRequest;
import com.foodrush.courier.application.dto.request.CreateDeliveryRequest;
import com.foodrush.courier.application.dto.response.DeliveryResponse;
import com.foodrush.courier.application.usecase.AssignCourierToDeliveryUseCase;
import com.foodrush.courier.application.usecase.CreateDeliveryUseCase;
import com.foodrush.courier.application.usecase.MarkAsDeliveredUseCase;
import com.foodrush.courier.application.usecase.MarkAsPickedUpUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
        private final CreateDeliveryUseCase createDeliveryUseCase;
        private final MarkAsPickedUpUseCase markAsPickedUpUseCase;
        private final MarkAsDeliveredUseCase markAsDeliveredUseCase;

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

        /**
         * Crea una nueva entrega (llamado por Order Service)
         */
        @PostMapping
        @Operation(summary = "Crear nueva entrega", description = "Crea un registro de entrega para una orden (Internal/Order Service)")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Entrega creada exitosamente"),
                        @ApiResponse(responseCode = "400", description = "Datos inválidos")
        })
        public ResponseEntity<DeliveryResponse> createDelivery(
                        @Valid @RequestBody CreateDeliveryRequest request) {
                log.info("Received request to create delivery for order: {}", request.getOrderId());
                DeliveryResponse response = createDeliveryUseCase.execute(request);
                return ResponseEntity.ok(response);
        }

        /**
         * Marca la entrega como recogida (Picked Up)
         */
        @PostMapping("/{deliveryId}/pickup")
        @Operation(summary = "Marcar como recogida", description = "Actualiza el estado a PICKED_UP. Requiere que el courier esté cerca del restaurante.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Entrega marcada como recogida"),
                        @ApiResponse(responseCode = "404", description = "Delivery no encontrada"),
                        @ApiResponse(responseCode = "403", description = "Courier no está en la ubicación de pickup (Geofencing)")
        })
        public ResponseEntity<Void> markAsPickedUp(
                        @Parameter(description = "ID de la entrega", required = true) @PathVariable UUID deliveryId) {
                log.info("Received request to mark delivery {} as picked up", deliveryId);
                markAsPickedUpUseCase.execute(deliveryId);
                return ResponseEntity.ok().build();
        }

        /**
         * Marca la entrega como completada (Delivered)
         */
        @PostMapping("/{deliveryId}/complete")
        @Operation(summary = "Completar entrega", description = "Marca la entrega como DELIVERED. Requiere PIN de validación y estar en ubicación del cliente.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Entrega completada exitosamente"),
                        @ApiResponse(responseCode = "400", description = "PIN inválido"),
                        @ApiResponse(responseCode = "403", description = "Courier no está en la ubicación de delivery (Geofencing)")
        })
        public ResponseEntity<Void> completeDelivery(
                        @Parameter(description = "ID de la entrega", required = true) @PathVariable UUID deliveryId,
                        @Valid @RequestBody CompleteDeliveryRequest request) {
                log.info("Received request to complete delivery {}", deliveryId);
                markAsDeliveredUseCase.execute(deliveryId, request.getPin());
                return ResponseEntity.ok().build();
        }
}
