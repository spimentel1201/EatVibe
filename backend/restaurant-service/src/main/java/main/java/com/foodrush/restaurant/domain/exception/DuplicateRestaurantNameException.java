package main.java.com.foodrush.restaurant.domain.exception;

public class DuplicateRestaurantNameException extends RuntimeException {

    private static final String DEFAULT_MESSAGE = "Ya existe un restaurante con ese nombre";

    public DuplicateRestaurantNameException() {
        super(DEFAULT_MESSAGE);
    }

    public DuplicateRestaurantNameException(String message) {
        super(message);
    }

    public DuplicateRestaurantNameException(String restaurantName, boolean includeNameInMessage) {
        super(includeNameInMessage
                ? String.format("Ya existe un restaurante con el nombre '%s'", restaurantName)
                : DEFAULT_MESSAGE);
    }

    public DuplicateRestaurantNameException(String message, Throwable cause) {
        super(message, cause);
    }
}
