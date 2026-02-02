package com.foodrush.courier.application.dto.response;

import com.foodrush.courier.domain.model.CourierStatus;
import com.foodrush.courier.domain.model.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Response DTO con información del courier
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourierResponse {

    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private VehicleType vehicleType;
    private CourierStatus status;
    private Double rating;
    private boolean active;
}
