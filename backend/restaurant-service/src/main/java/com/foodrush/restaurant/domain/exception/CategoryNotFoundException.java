package com.foodrush.restaurant.domain.exception;

import java.util.UUID;

/**
 * Excepción lanzada cuando no se encuentra una categoría en el sistema.
 * 
 * @author FoodRush Team
 * @version 1.0.0
 * @since 2026-01-29
 */
public class CategoryNotFoundException extends RuntimeException {

    private static final String DEFAULT_MESSAGE = "Categoría no encontrada";

    public CategoryNotFoundException() {
        super(DEFAULT_MESSAGE);
    }

    public CategoryNotFoundException(String message) {
        super(message);
    }

    public CategoryNotFoundException(UUID categoryId) {
        super(String.format("Categoría con ID %s no encontrada", categoryId));
    }

    public CategoryNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
