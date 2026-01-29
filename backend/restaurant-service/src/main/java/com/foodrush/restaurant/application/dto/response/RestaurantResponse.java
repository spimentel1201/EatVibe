package main.java.com.foodrush.restaurant.application.dto.response;

import com.foodrush.restaurant.domain.model.RestaurantStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Respuesta con información completa de un restaurante")
public class RestaurantResponse {

    @Schema(description = "ID único del restaurante", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID id;

    @Schema(description = "ID del usuario propietario", example = "660e8400-e29b-41d4-a716-446655440000")
    private UUID ownerUserId;

    @Schema(description = "Nombre del restaurante", example = "La Casa del Sabor")
    private String name;

    @Schema(description = "Descripción del restaurante", example = "Restaurante especializado en comida criolla peruana")
    private String description;

    @Schema(description = "Estado operativo del restaurante", example = "OPEN")
    private RestaurantStatus status;

    @Schema(description = "Calificación promedio del restaurante", example = "4.5")
    private BigDecimal rating;

    @Schema(description = "URL de la imagen del restaurante", example = "https://example.com/restaurant.jpg")
    private String imageUrl;

    @Schema(description = "Fecha y hora de creación del restaurante")
    private Instant createdAt;

    @Schema(description = "Lista de categorías del menú")
    @Builder.Default
    private List<CategoryResponse> categories = new ArrayList<>();
}
