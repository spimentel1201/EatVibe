package com.foodrush.courier.api.rest.controller;

import com.foodrush.courier.application.dto.request.LocationUpdateRequest;
import com.foodrush.courier.application.dto.response.LocationResponse;
import com.foodrush.courier.application.usecase.UpdateCourierLocationUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST Controller para gestión de ubicaciones de couriers
 */
@RestController
@RequestMapping("/api/v1/couriers")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Courier Location", description = "Endpoints para tracking de ubicación de couriers")
public class CourierLocationController {

        private final UpdateCourierLocationUseCase updateCourierLocationUseCase;
        private final com.foodrush.courier.application.usecase.GetLatestLocationUseCase getLatestLocationUseCase;

        /**
         * Actualiza la ubicación del courier
         * 
         * Este endpoint debe ser llamado periódicamente por la app del courier
         * para mantener su ubicación actualizada en tiempo real.
         * 
         * Rate limit: Máximo 1 update cada 5 segundos por courier
         */
        @PostMapping("/{courierId}/location")
        @Operation(summary = "Actualizar ubicación del courier", description = "Actualiza la ubicación GPS del courier. Debe ser llamado cada 5-10 segundos durante entregas activas.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Ubicación actualizada exitosamente"),
                        @ApiResponse(responseCode = "400", description = "Coordenadas inválidas"),
                        @ApiResponse(responseCode = "404", description = "Courier no encontrado"),
                        @ApiResponse(responseCode = "429", description = "Demasiadas solicitudes (rate limit)")
        })
        public ResponseEntity<LocationResponse> updateLocation(
                        @Parameter(description = "ID del courier", required = true) @PathVariable UUID courierId,

                        @Parameter(description = "Datos de ubicación", required = true) @Valid @RequestBody LocationUpdateRequest request) {
                log.debug("Received location update for courier: {}", courierId);

                LocationResponse response = updateCourierLocationUseCase.execute(courierId, request);

                return ResponseEntity.ok(response);
        }

        /**
         * Obtiene la última ubicación conocida del courier
         */
        @GetMapping("/{courierId}/location")
        @Operation(summary = "Obtener última ubicación del courier", description = "Retorna la ubicación más reciente registrada del courier")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Ubicación encontrada"),
                        @ApiResponse(responseCode = "404", description = "Courier no encontrado o sin ubicación")
        })
        public ResponseEntity<LocationResponse> getLatestLocation(
                        @Parameter(description = "ID del courier", required = true) @PathVariable UUID courierId) {

                var location = getLatestLocationUseCase.execute(courierId);

                return ResponseEntity.ok(LocationResponse.builder()
                                .courierId(location.getCourier().getId())
                                .latitude(location.getLatitude())
                                .longitude(location.getLongitude())
                                .timestamp(location.getTimestamp())
                                .build());
        }
}
