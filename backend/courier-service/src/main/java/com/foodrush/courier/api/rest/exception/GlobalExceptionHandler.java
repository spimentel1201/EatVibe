package com.foodrush.courier.api.rest.exception;

import com.foodrush.courier.domain.exception.CourierNotAtLocationException;
import com.foodrush.courier.domain.exception.CourierNotFoundException;
import com.foodrush.courier.domain.exception.DeliveryNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.URI;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * Global Exception Handler para Courier Service
 * Implementa RFC 7807 (Problem Details for HTTP APIs)
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * Maneja excepciones de courier no encontrado
     */
    @ExceptionHandler(CourierNotFoundException.class)
    public ProblemDetail handleCourierNotFound(CourierNotFoundException ex) {
        log.error("Courier not found: {}", ex.getMessage());

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND,
                ex.getMessage());
        problemDetail.setTitle("Courier Not Found");
        problemDetail.setType(URI.create("https://api.foodrush.com/errors/courier-not-found"));
        problemDetail.setProperty("timestamp", Instant.now());

        return problemDetail;
    }

    /**
     * Maneja excepciones de delivery no encontrada
     */
    @ExceptionHandler(DeliveryNotFoundException.class)
    public ProblemDetail handleDeliveryNotFound(DeliveryNotFoundException ex) {
        log.error("Delivery not found: {}", ex.getMessage());

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND,
                ex.getMessage());
        problemDetail.setTitle("Delivery Not Found");
        problemDetail.setType(URI.create("https://api.foodrush.com/errors/delivery-not-found"));
        problemDetail.setProperty("timestamp", Instant.now());

        return problemDetail;
    }

    /**
     * Maneja excepciones de geofencing (courier no está en ubicación)
     */
    @ExceptionHandler(CourierNotAtLocationException.class)
    public ProblemDetail handleCourierNotAtLocation(CourierNotAtLocationException ex) {
        log.warn("Courier not at location: {}", ex.getMessage());

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.FORBIDDEN,
                ex.getMessage());
        problemDetail.setTitle("Courier Not At Location");
        problemDetail.setType(URI.create("https://api.foodrush.com/errors/courier-not-at-location"));
        problemDetail.setProperty("timestamp", Instant.now());

        return problemDetail;
    }

    /**
     * Maneja errores de validación
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidationErrors(MethodArgumentNotValidException ex) {
        log.error("Validation error: {}", ex.getMessage());

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "Validation failed for one or more fields");
        problemDetail.setTitle("Validation Error");
        problemDetail.setType(URI.create("https://api.foodrush.com/errors/validation-error"));
        problemDetail.setProperty("timestamp", Instant.now());
        problemDetail.setProperty("errors", errors);

        return problemDetail;
    }

    /**
     * Maneja errores de argumentos ilegales (ej: coordenadas inválidas)
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ProblemDetail handleIllegalArgument(IllegalArgumentException ex) {
        log.error("Illegal argument: {}", ex.getMessage());

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                ex.getMessage());
        problemDetail.setTitle("Invalid Argument");
        problemDetail.setType(URI.create("https://api.foodrush.com/errors/invalid-argument"));
        problemDetail.setProperty("timestamp", Instant.now());

        return problemDetail;
    }

    /**
     * Maneja excepciones genéricas
     */
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGenericException(Exception ex) {
        log.error("Unexpected error", ex);

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred");
        problemDetail.setTitle("Internal Server Error");
        problemDetail.setType(URI.create("https://api.foodrush.com/errors/internal-error"));
        problemDetail.setProperty("timestamp", Instant.now());

        return problemDetail;
    }
}
