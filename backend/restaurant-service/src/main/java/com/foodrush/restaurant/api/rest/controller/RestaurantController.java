package com.foodrush.restaurant.api.rest.controller;

import com.foodrush.restaurant.application.dto.request.CreateRestaurantRequest;
import com.foodrush.restaurant.application.dto.request.UpdateRestaurantRequest;
import com.foodrush.restaurant.application.dto.response.RestaurantResponse;
import com.foodrush.restaurant.application.usecase.*;
import com.foodrush.restaurant.domain.model.RestaurantStatus;
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

@RestController
@RequestMapping("/api/v1/restaurants")
@RequiredArgsConstructor
@Tag(name = "Restaurants", description = "API para gestión de restaurantes")
public class RestaurantController {

    private final CreateRestaurantUseCase createRestaurantUseCase;
    private final GetRestaurantByIdUseCase getRestaurantByIdUseCase;
    private final GetAllRestaurantsUseCase getAllRestaurantsUseCase;
    private final UpdateRestaurantUseCase updateRestaurantUseCase;
    private final DeleteRestaurantUseCase deleteRestaurantUseCase;
    private final UpdateRestaurantStatusUseCase updateRestaurantStatusUseCase;

    @PostMapping
    @Operation(summary = "Crear un nuevo restaurante", description = "Crea un nuevo restaurante en el sistema")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Restaurante creado exitosamente", content = @Content(schema = @Schema(implementation = RestaurantResponse.class))),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
            @ApiResponse(responseCode = "409", description = "Ya existe un restaurante con ese nombre")
    })
    public ResponseEntity<RestaurantResponse> createRestaurant(
            @Valid @RequestBody CreateRestaurantRequest request) {
        RestaurantResponse response = createRestaurantUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener restaurante por ID", description = "Obtiene la información completa de un restaurante")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Restaurante encontrado", content = @Content(schema = @Schema(implementation = RestaurantResponse.class))),
            @ApiResponse(responseCode = "404", description = "Restaurante no encontrado")
    })
    public ResponseEntity<RestaurantResponse> getRestaurantById(
            @Parameter(description = "ID del restaurante") @PathVariable UUID id) {
        RestaurantResponse response = getRestaurantByIdUseCase.execute(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Listar todos los restaurantes", description = "Obtiene la lista completa de restaurantes")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de restaurantes obtenida exitosamente")
    })
    public ResponseEntity<List<RestaurantResponse>> getAllRestaurants() {
        List<RestaurantResponse> response = getAllRestaurantsUseCase.execute();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar restaurante", description = "Actualiza la información de un restaurante existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Restaurante actualizado exitosamente", content = @Content(schema = @Schema(implementation = RestaurantResponse.class))),
            @ApiResponse(responseCode = "404", description = "Restaurante no encontrado"),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    })
    public ResponseEntity<RestaurantResponse> updateRestaurant(
            @Parameter(description = "ID del restaurante") @PathVariable UUID id,
            @Valid @RequestBody UpdateRestaurantRequest request) {
        RestaurantResponse response = updateRestaurantUseCase.execute(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar restaurante", description = "Elimina un restaurante del sistema")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Restaurante eliminado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Restaurante no encontrado")
    })
    public ResponseEntity<Void> deleteRestaurant(
            @Parameter(description = "ID del restaurante") @PathVariable UUID id) {
        deleteRestaurantUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Actualizar estado del restaurante", description = "Cambia el estado operativo del restaurante (OPEN, CLOSED, BUSY)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Estado actualizado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Restaurante no encontrado"),
            @ApiResponse(responseCode = "400", description = "Estado inválido")
    })
    public ResponseEntity<Void> updateRestaurantStatus(
            @Parameter(description = "ID del restaurante") @PathVariable UUID id,
            @Parameter(description = "Nuevo estado del restaurante") @RequestParam RestaurantStatus status) {
        updateRestaurantStatusUseCase.execute(id, status);
        return ResponseEntity.ok().build();
    }
}
