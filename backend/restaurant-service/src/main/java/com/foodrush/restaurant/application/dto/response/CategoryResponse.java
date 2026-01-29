package main.java.com.foodrush.restaurant.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Respuesta con información de una categoría de menú")
public class CategoryResponse {

    @Schema(description = "ID único de la categoría", example = "770e8400-e29b-41d4-a716-446655440000")
    private UUID id;

    @Schema(description = "Nombre de la categoría", example = "Platos Principales")
    private String name;

    @Schema(description = "Orden de visualización", example = "1")
    private Integer sortOrder;

    @Schema(description = "Lista de items del menú")
    @Builder.Default
    private List<MenuItemResponse> menuItems = new ArrayList<>();
}
