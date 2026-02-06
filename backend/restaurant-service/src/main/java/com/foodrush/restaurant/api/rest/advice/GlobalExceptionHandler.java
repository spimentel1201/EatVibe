package com.foodrush.restaurant.api.rest.advice;

import com.foodrush.restaurant.domain.exception.CategoryNotFoundException;
import com.foodrush.restaurant.domain.exception.DuplicateRestaurantNameException;
import com.foodrush.restaurant.domain.exception.RestaurantNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(RestaurantNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleRestaurantNotFound(RestaurantNotFoundException ex) {
        log.error("Restaurant not found: {}", ex.getMessage());

        return buildResponse(HttpStatus.NOT_FOUND, "RESTAURANT_NOT_FOUND", ex.getMessage(), null);
    }

    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleCategoryNotFound(CategoryNotFoundException ex) {
        log.error("Category not found: {}", ex.getMessage());

        return buildResponse(HttpStatus.NOT_FOUND, "CATEGORY_NOT_FOUND", ex.getMessage(), null);
    }

    @ExceptionHandler(DuplicateRestaurantNameException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateRestaurantName(DuplicateRestaurantNameException ex) {
        log.error("Duplicate restaurant name: {}", ex.getMessage());

        return buildResponse(HttpStatus.CONFLICT, "DUPLICATE_RESTAURANT_NAME", ex.getMessage(), null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        log.error("Validation error: {}", ex.getMessage());

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

        return buildResponse(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", "Error de validación en los datos de entrada",
                errors);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        log.error("Illegal argument: {}", ex.getMessage());

        return buildResponse(HttpStatus.BAD_REQUEST, "INVALID_ARGUMENT", ex.getMessage(), null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        log.error("Unexpected error: ", ex);

        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR",
                "Ha ocurrido un error inesperado en el servidor", null);
    }

    private ResponseEntity<ErrorResponse> buildResponse(HttpStatus status, String code, String message,
            Object details) {
        return ResponseEntity.status(status).body(ErrorResponse.builder()
                .code(code)
                .message(message)
                .details(details)
                .timestamp(Instant.now())
                .build());
    }
}
