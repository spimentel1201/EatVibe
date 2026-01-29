package com.foodrush.restaurant.domain.exception;

import java.util.UUID;

/**
 * Excepción lanzada cuando no se encuentra un restaurante en el sistema.
 * 
 * <p>
 * Esta excepción de dominio se utiliza cuando se intenta acceder a un
 * restaurante que no existe en la base de datos.
 * 
 * @author FoodRush Team
 * @version 1.0.0
 * @since 2026-01-29
 */
public class RestaurantNotFoundException extends RuntimeException {

    private static final String DEFAULT_MESSAGE = "Restaurante no encontrado";

    /**
     * Constructor con mensaje por defecto.
     */
    public RestaurantNotFoundException() {
        super(DEFAULT_MESSAGE);
    }

    /**
     * Constructor con mensaje personalizado.
     * 
     * @param message mensaje de error
     */
    public RestaurantNotFoundException(String message) {
        super(message);
    }

    /**
     * Constructor con ID del restaurante no encontrado.
     * 
     * @param restaurantId ID del restaurante buscado
     */
    public RestaurantNotFoundException(UUID restaurantId) {
        super(String.format("Restaurante con ID %s no encontrado", restaurantId));
    }

    /**
     * Constructor con mensaje y causa.
     * 
     * @param message mensaje de error
     * @param cause   causa de la excepción
     */
    public RestaurantNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
