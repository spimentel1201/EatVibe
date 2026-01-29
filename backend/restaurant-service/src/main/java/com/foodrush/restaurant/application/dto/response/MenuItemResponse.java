package main.java.com.foodrush.restaurant.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Respuesta con información de un item del menú")
public class MenuItemResponse {

    @Schema(description = "ID único del item", example = "880e8400-e29b-41d4-a716-446655440000")
    private UUID id;

    @Schema(description = "Nombre del item", example = "Lomo Saltado")
    private String name;

    @Schema(description = "Descripción del item", example = "Carne de res salteada con papas fritas y arroz")
    private String description;

    @Schema(description = "Precio del item", example = "25.90")
    private BigDecimal price;

    @Schema(description = "Indica si el item está disponible", example = "true")
    private Boolean available;

    @Schema(description = "URL de la imagen del item", example = "https://example.com/lomo-saltado.jpg")
    private String imageUrl;
}
