package com.foodrush.courier.application.dto.request;

import com.foodrush.courier.domain.model.CourierStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request para actualizar estado del courier
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCourierStatusRequest {

    @NotNull(message = "Status is required")
    private CourierStatus status;
}
