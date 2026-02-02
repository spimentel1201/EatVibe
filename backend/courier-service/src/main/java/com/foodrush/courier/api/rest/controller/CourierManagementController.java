package com.foodrush.courier.api.rest.controller;

import com.foodrush.courier.application.dto.request.RegisterCourierRequest;
import com.foodrush.courier.application.dto.request.UpdateCourierStatusRequest;
import com.foodrush.courier.application.dto.response.CourierResponse;
import com.foodrush.courier.application.usecase.RegisterCourierUseCase;
import com.foodrush.courier.application.usecase.UpdateCourierStatusUseCase;
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
 * Controller para gestión de couriers
 */
@RestController
@RequestMapping("/api/v1/couriers")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Courier Management", description = "Endpoints para registro y gestión de couriers")
public class CourierManagementController {

    private final RegisterCourierUseCase registerCourierUseCase;
    private final UpdateCourierStatusUseCase updateCourierStatusUseCase;

    /**
     * Registrar un nuevo courier
     */
    @PostMapping
    @Operation(summary = "Registrar nuevo courier", description = "Crea una nueva cuenta de courier")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Courier registrado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o email/teléfono duplicado")
    })
    public ResponseEntity<CourierResponse> registerCourier(
            @Valid @RequestBody RegisterCourierRequest request) {
        log.info("Received request to register courier: {}", request.getEmail());
        CourierResponse response = registerCourierUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Actualizar estado del courier
     */
    @PatchMapping("/{courierId}/status")
    @Operation(summary = "Actualizar estado", description = "Cambia el estado del courier (AVAILABLE, OFFLINE, BUSY)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Estado actualizado"),
            @ApiResponse(responseCode = "404", description = "Courier no encontrado")
    })
    public ResponseEntity<CourierResponse> updateStatus(
            @Parameter(description = "ID del courier", required = true) @PathVariable UUID courierId,
            @Valid @RequestBody UpdateCourierStatusRequest request) {
        log.info("Received status update for courier {}", courierId);
        CourierResponse response = updateCourierStatusUseCase.execute(courierId, request);
        return ResponseEntity.ok(response);
    }
}
