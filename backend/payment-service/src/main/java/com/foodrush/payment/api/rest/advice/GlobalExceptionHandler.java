package com.foodrush.payment.api.rest.advice;

import com.foodrush.payment.domain.exception.PaymentFailedException;
import com.foodrush.payment.domain.exception.PaymentMethodNotFoundException;
import com.foodrush.payment.domain.exception.RefundFailedException;
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
 * Manejador global de excepciones para el Payment Service.
 * 
 * <p>
 * Utiliza RFC 7807 (Problem Details for HTTP APIs) para
 * respuestas de error estandarizadas.
 * </p>
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * Maneja excepciones de pago fallido.
     */
    @ExceptionHandler(PaymentFailedException.class)
    public ProblemDetail handlePaymentFailedException(PaymentFailedException ex) {
        log.error("Payment failed: {}", ex.getMessage());

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                ex.getMessage());

        problemDetail.setTitle("Pago Fallido");
        problemDetail.setType(URI.create("https://api.foodrush.com/errors/payment-failed"));
        problemDetail.setProperty("timestamp", Instant.now());

        if (ex.getErrorCode() != null) {
            problemDetail.setProperty("errorCode", ex.getErrorCode());
        }
        if (ex.getTransactionId() != null) {
            problemDetail.setProperty("transactionId", ex.getTransactionId());
        }

        return problemDetail;
    }

    /**
     * Maneja excepciones de método de pago no encontrado.
     */
    @ExceptionHandler(PaymentMethodNotFoundException.class)
    public ProblemDetail handlePaymentMethodNotFoundException(PaymentMethodNotFoundException ex) {
        log.error("Payment method not found: {}", ex.getMessage());

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND,
                ex.getMessage());

        problemDetail.setTitle("Método de Pago No Encontrado");
        problemDetail.setType(URI.create("https://api.foodrush.com/errors/payment-method-not-found"));
        problemDetail.setProperty("timestamp", Instant.now());

        if (ex.getPaymentMethodId() != null) {
            problemDetail.setProperty("paymentMethodId", ex.getPaymentMethodId());
        }

        return problemDetail;
    }

    /**
     * Maneja excepciones de reembolso fallido.
     */
    @ExceptionHandler(RefundFailedException.class)
    public ProblemDetail handleRefundFailedException(RefundFailedException ex) {
        log.error("Refund failed: {}", ex.getMessage());

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                ex.getMessage());

        problemDetail.setTitle("Reembolso Fallido");
        problemDetail.setType(URI.create("https://api.foodrush.com/errors/refund-failed"));
        problemDetail.setProperty("timestamp", Instant.now());

        if (ex.getErrorCode() != null) {
            problemDetail.setProperty("errorCode", ex.getErrorCode());
        }
        if (ex.getTransactionId() != null) {
            problemDetail.setProperty("transactionId", ex.getTransactionId());
        }

        return problemDetail;
    }

    /**
     * Maneja errores de validación de datos.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        log.error("Validation error: {}", ex.getMessage());

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "Error de validación en los datos enviados");

        problemDetail.setTitle("Datos Inválidos");
        problemDetail.setType(URI.create("https://api.foodrush.com/errors/validation-error"));
        problemDetail.setProperty("timestamp", Instant.now());

        // Agregar detalles de los errores de validación
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        problemDetail.setProperty("validationErrors", errors);

        return problemDetail;
    }

    /**
     * Maneja argumentos ilegales (ej: proveedor no soportado).
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ProblemDetail handleIllegalArgumentException(IllegalArgumentException ex) {
        log.error("Illegal argument: {}", ex.getMessage());

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                ex.getMessage());

        problemDetail.setTitle("Argumento Inválido");
        problemDetail.setType(URI.create("https://api.foodrush.com/errors/illegal-argument"));
        problemDetail.setProperty("timestamp", Instant.now());

        return problemDetail;
    }

    /**
     * Maneja estados ilegales (ej: gateway no disponible).
     */
    @ExceptionHandler(IllegalStateException.class)
    public ProblemDetail handleIllegalStateException(IllegalStateException ex) {
        log.error("Illegal state: {}", ex.getMessage());

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.SERVICE_UNAVAILABLE,
                ex.getMessage());

        problemDetail.setTitle("Servicio No Disponible");
        problemDetail.setType(URI.create("https://api.foodrush.com/errors/service-unavailable"));
        problemDetail.setProperty("timestamp", Instant.now());

        return problemDetail;
    }

    /**
     * Maneja excepciones genéricas no capturadas.
     */
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGenericException(Exception ex) {
        log.error("Unexpected error: {}", ex.getMessage(), ex);

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Ocurrió un error inesperado. Por favor, intente nuevamente.");

        problemDetail.setTitle("Error Interno del Servidor");
        problemDetail.setType(URI.create("https://api.foodrush.com/errors/internal-server-error"));
        problemDetail.setProperty("timestamp", Instant.now());

        return problemDetail;
    }
}
