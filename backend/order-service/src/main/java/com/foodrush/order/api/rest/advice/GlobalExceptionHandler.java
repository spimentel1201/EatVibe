package com.foodrush.order.api.rest.advice;

import com.foodrush.order.domain.exception.EmptyCartException;
import com.foodrush.order.domain.exception.InvalidOrderStateTransitionException;
import com.foodrush.order.domain.exception.OrderNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.URI;
import java.time.Instant;

/**
 * Manejador global de excepciones para el Order Service.
 * 
 * <p>
 * Utiliza RFC 7807 (Problem Details) para retornar respuestas de error
 * estandarizadas.
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(OrderNotFoundException.class)
    public ProblemDetail handleOrderNotFound(OrderNotFoundException ex) {
        log.error("Pedido no encontrado: {}", ex.getMessage());

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND,
                ex.getMessage());
        problemDetail.setTitle("Pedido no encontrado");
        problemDetail.setType(URI.create("https://foodrush.com/errors/order-not-found"));
        problemDetail.setProperty("timestamp", Instant.now());

        return problemDetail;
    }

    @ExceptionHandler(InvalidOrderStateTransitionException.class)
    public ProblemDetail handleInvalidStateTransition(InvalidOrderStateTransitionException ex) {
        log.error("Transición de estado inválida: {}", ex.getMessage());

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                ex.getMessage());
        problemDetail.setTitle("Transición de estado inválida");
        problemDetail.setType(URI.create("https://foodrush.com/errors/invalid-state-transition"));
        problemDetail.setProperty("timestamp", Instant.now());

        return problemDetail;
    }

    @ExceptionHandler(EmptyCartException.class)
    public ProblemDetail handleEmptyCart(EmptyCartException ex) {
        log.error("Carrito vacío: {}", ex.getMessage());

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                ex.getMessage());
        problemDetail.setTitle("Carrito vacío");
        problemDetail.setType(URI.create("https://foodrush.com/errors/empty-cart"));
        problemDetail.setProperty("timestamp", Instant.now());

        return problemDetail;
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ProblemDetail handleIllegalArgument(IllegalArgumentException ex) {
        log.error("Argumento inválido: {}", ex.getMessage());

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                ex.getMessage());
        problemDetail.setTitle("Argumento inválido");
        problemDetail.setType(URI.create("https://foodrush.com/errors/invalid-argument"));
        problemDetail.setProperty("timestamp", Instant.now());

        return problemDetail;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidationErrors(MethodArgumentNotValidException ex) {
        log.error("Error de validación: {}", ex.getMessage());

        StringBuilder errors = new StringBuilder();
        ex.getBindingResult().getFieldErrors().forEach(error -> errors.append(error.getField())
                .append(": ")
                .append(error.getDefaultMessage())
                .append("; "));

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                errors.toString());
        problemDetail.setTitle("Error de validación");
        problemDetail.setType(URI.create("https://foodrush.com/errors/validation-error"));
        problemDetail.setProperty("timestamp", Instant.now());

        return problemDetail;
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGenericException(Exception ex) {
        log.error("Error interno del servidor: {}", ex.getMessage(), ex);

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Ha ocurrido un error interno. Por favor, intente nuevamente más tarde.");
        problemDetail.setTitle("Error interno del servidor");
        problemDetail.setType(URI.create("https://foodrush.com/errors/internal-error"));
        problemDetail.setProperty("timestamp", Instant.now());

        return problemDetail;
    }
}
