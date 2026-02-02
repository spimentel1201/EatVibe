package com.foodrush.courier.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO to complete a delivery
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompleteDeliveryRequest {

    @NotBlank(message = "PIN is required")
    @Pattern(regexp = "\\d{6}", message = "PIN must be 6 digits")
    private String pin;
}
