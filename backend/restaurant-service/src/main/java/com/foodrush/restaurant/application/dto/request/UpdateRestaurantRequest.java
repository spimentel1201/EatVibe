package com.foodrush.restaurant.application.dto.request;

import com.foodrush.restaurant.domain.model.RestaurantStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Solicitud para actualizar un restaurante existente")
public class UpdateRestaurantRequest {

    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    @Schema(description = "Nombre del restaurante", example = "La Casa del Sabor Premium")
    private String name;

    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    @Schema(description = "Descripción del restaurante", example = "El mejor restaurante de comida criolla en Lima")
    private String description;

    @Schema(description = "Estado operativo del restaurante", example = "OPEN")
    private RestaurantStatus status;

    @Pattern(regexp = "^https?://.*", message = "La URL de la imagen debe ser válida")
    @Schema(description = "URL de la imagen del restaurante", example = "https://example.com/restaurant-updated.jpg")
    private String imageUrl;
}
