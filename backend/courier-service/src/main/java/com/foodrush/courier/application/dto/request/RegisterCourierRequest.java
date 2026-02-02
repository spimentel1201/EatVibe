package com.foodrush.courier.application.dto.request;

import com.foodrush.courier.domain.model.VehicleType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request para registrar un nuevo courier
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterCourierRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotNull(message = "Vehicle type is required")
    private VehicleType vehicleType;
}
