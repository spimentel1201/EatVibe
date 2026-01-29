package main.java.com.foodrush.restaurant.domain.exception;

import java.util.UUID;

public class RestaurantNotFoundException extends RuntimeException {

    private static final String DEFAULT_MESSAGE = "Restaurante no encontrado";

    public RestaurantNotFoundException() {
        super(DEFAULT_MESSAGE);
    }

    public RestaurantNotFoundException(String message) {
        super(message);
    }

    public RestaurantNotFoundException(UUID restaurantId) {
        super(String.format("Restaurante con ID %s no encontrado", restaurantId));
    }

    public RestaurantNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
