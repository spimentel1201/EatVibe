package com.foodrush.courier.api.rest.controller;

import com.foodrush.courier.application.dto.response.ShiftResponse;
import com.foodrush.courier.application.usecase.EndShiftUseCase;
import com.foodrush.courier.application.usecase.StartShiftUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

/**
 * Controller para gestión de turnos (Shifts)
 */
@RestController
@RequestMapping("/api/v1/couriers")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Courier Shifts", description = "Endpoints para gestión de turnos y clock-in/out")
public class CourierShiftController {

    private final StartShiftUseCase startShiftUseCase;
    private final EndShiftUseCase endShiftUseCase;

    /**
     * Iniciar turno (Clock In)
     */
    @PostMapping("/{courierId}/shifts/start")
    @Operation(summary = "Iniciar turno (Clock In)", description = "Inicia un nuevo turno de trabajo y pone al courier ONLINE")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Turno iniciado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Courier no encontrado"),
            @ApiResponse(responseCode = "409", description = "Ya existe un turno activo")
    })
    public ResponseEntity<ShiftResponse> startShift(
            @Parameter(description = "ID del courier", required = true) @PathVariable UUID courierId) {
        log.info("Request to start shift for courier {}", courierId);
        ShiftResponse response = startShiftUseCase.execute(courierId);
        return ResponseEntity.ok(response);
    }

    /**
     * Finalizar turno (Clock Out)
     */
    @PostMapping("/{courierId}/shifts/end")
    @Operation(summary = "Finalizar turno (Clock Out)", description = "Finaliza el turno actual y pone al courier OFFLINE. Requiere no tener entregas activas.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Turno finalizado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Courier o turno no encontrado"),
            @ApiResponse(responseCode = "409", description = "No se puede finalizar turno con entregas activas")
    })
    public ResponseEntity<ShiftResponse> endShift(
            @Parameter(description = "ID del courier", required = true) @PathVariable UUID courierId) {
        log.info("Request to end shift for courier {}", courierId);
        ShiftResponse response = endShiftUseCase.execute(courierId);
        return ResponseEntity.ok(response);
    }
}
