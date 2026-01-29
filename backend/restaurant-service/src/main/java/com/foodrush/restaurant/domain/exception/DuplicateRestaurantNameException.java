package com.foodrush.restaurant.domain.exception;

/**
 * Excepción lanzada cuando se intenta crear un restaurante con un nombre que ya
 * existe.
 * 
 * <p>
 * Esta excepción de dominio se utiliza para validar la unicidad del nombre
 * del restaurante en el sistema.
 * 
 * @author FoodRush Team
 * @version 1.0.0
 * @since 2026-01-29
 */
public class DuplicateRestaurantNameException extends RuntimeException {

    private static final String DEFAULT_MESSAGE = "Ya existe un restaurante con ese nombre";

    /**
     * Constructor con mensaje por defecto.
     */
    public DuplicateRestaurantNameException() {
        super(DEFAULT_MESSAGE);
    }

    /**
     * Constructor con mensaje personalizado.
     * 
     * @param message mensaje de error
     */
    public DuplicateRestaurantNameException(String message) {
        super(message);
    }

    /**
     * Constructor con nombre del restaurante duplicado.
     * 
     * @param restaurantName nombre del restaurante que ya existe
     */
    public DuplicateRestaurantNameException(String restaurantName, boolean includeNameInMessage) {
        super(includeNameInMessage
                ? String.format("Ya existe un restaurante con el nombre '%s'", restaurantName)
                : DEFAULT_MESSAGE);
    }

    /**
     * Constructor con mensaje y causa.
     * 
     * @param message mensaje de error
     * @param cause   causa de la excepción
     */
    public DuplicateRestaurantNameException(String message, Throwable cause) {
        super(message, cause);
    }
}
