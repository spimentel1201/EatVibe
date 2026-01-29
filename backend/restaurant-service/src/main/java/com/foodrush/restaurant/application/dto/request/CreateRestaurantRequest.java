package com.foodrush.restaurant.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Solicitud para crear un nuevo restaurante")
public class CreateRestaurantRequest {

    @NotNull(message = "El ID del propietario es obligatorio")
    @Schema(description = "ID del usuario propietario del restaurante", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID ownerUserId;

    @NotBlank(message = "El nombre del restaurante es obligatorio")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    @Schema(description = "Nombre del restaurante", example = "La Casa del Sabor")
    private String name;

    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    @Schema(description = "Descripción del restaurante", example = "Restaurante especializado en comida criolla peruana")
    private String description;

    @Pattern(regexp = "^https?://.*", message = "La URL de la imagen debe ser válida")
    @Schema(description = "URL de la imagen del restaurante", example = "https://example.com/restaurant.jpg")
    private String imageUrl;
}
