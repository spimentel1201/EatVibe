package com.foodrush.courier.application.usecase;

import com.foodrush.courier.application.dto.request.RegisterCourierRequest;
import com.foodrush.courier.application.dto.response.CourierResponse;
import com.foodrush.courier.domain.model.Courier;
import com.foodrush.courier.domain.model.CourierStatus;
import com.foodrush.courier.domain.repository.CourierRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Use Case: Registrar nuevo courier
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RegisterCourierUseCase {

    private final CourierRepository courierRepository;

    @Transactional
    public CourierResponse execute(RegisterCourierRequest request) {
        log.info("Registering new courier: {}", request.getEmail());

        // 1. Validar duplicados
        if (courierRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already active: " + request.getEmail());
        }

        if (courierRepository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("Phone already active: " + request.getPhone());
        }

        // 2. Crear entidad
        Courier courier = Courier.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .vehicleType(request.getVehicleType())
                .status(CourierStatus.OFFLINE) // Inicialmente offline
                .rating(5.0) // Rating inicial
                .build();

        // 3. Guardar
        Courier saved = courierRepository.save(courier);

        log.info("Courier registered successfully with ID: {}", saved.getId());

        // 4. Mapear a response
        return mapToResponse(saved);
    }

    private CourierResponse mapToResponse(Courier courier) {
        return CourierResponse.builder()
                .id(courier.getId())
                .firstName(courier.getFirstName())
                .lastName(courier.getLastName())
                .email(courier.getEmail())
                .phone(courier.getPhone())
                .vehicleType(courier.getVehicleType())
                .status(courier.getStatus())
                .rating(courier.getRating())
                .active(courier.getStatus() != CourierStatus.OFFLINE)
                .build();
    }
}
