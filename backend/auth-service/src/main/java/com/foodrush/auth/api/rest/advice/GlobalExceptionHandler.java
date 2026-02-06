package com.foodrush.auth.api.rest.advice;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex) {
        log.warn("Authentication failed: {}", ex.getMessage());
        return buildResponse(HttpStatus.UNAUTHORIZED, "AUTH_INVALID_CREDENTIALS", "Usuario o contraseña incorrectos",
                null);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UsernameNotFoundException ex) {
        log.warn("User not found during auth: {}", ex.getMessage());
        return buildResponse(HttpStatus.UNAUTHORIZED, "AUTH_USER_NOT_FOUND", ex.getMessage(), null);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        log.error("Runtime exception: {}", ex.getMessage());
        // Handle specific cases based on message or create custom exceptions
        if (ex.getMessage().contains("Email already active")) {
            return buildResponse(HttpStatus.CONFLICT, "AUTH_EMAIL_ALREADY_EXISTS", ex.getMessage(), null);
        }
        if (ex.getMessage().contains("Refresh token was expired")) {
            return buildResponse(HttpStatus.FORBIDDEN, "AUTH_REFRESH_TOKEN_EXPIRED", ex.getMessage(), null);
        }
        return buildResponse(HttpStatus.BAD_REQUEST, "INTERNAL_ERROR", ex.getMessage(), null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        log.error("Validation error: {}", ex.getMessage());

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

        return buildResponse(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", "Error de validación", errors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        log.error("Unexpected error: ", ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", "Error inesperado", null);
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
