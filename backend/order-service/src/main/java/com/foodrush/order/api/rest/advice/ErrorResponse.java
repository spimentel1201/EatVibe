package com.foodrush.order.api.rest.advice;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ErrorResponse {
    private String code;
    private String message;
    private Object details;
    private Instant timestamp;
}
