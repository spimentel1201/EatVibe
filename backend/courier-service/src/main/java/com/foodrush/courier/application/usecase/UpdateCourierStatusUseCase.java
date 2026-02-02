package com.foodrush.courier.application.usecase;

import com.foodrush.courier.application.dto.request.UpdateCourierStatusRequest;
import com.foodrush.courier.application.dto.response.CourierResponse;
import com.foodrush.courier.domain.exception.CourierNotFoundException;
import com.foodrush.courier.domain.model.Courier;
import com.foodrush.courier.domain.repository.CourierRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Use Case: Actualizar estado del courier (Online/Offline/Busy)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UpdateCourierStatusUseCase {

    private final CourierRepository courierRepository;

    @Transactional
    public CourierResponse execute(UUID courierId, UpdateCourierStatusRequest request) {
        log.info("Updating status for courier {}: {}", courierId, request.getStatus());

        Courier courier = courierRepository.findById(courierId)
                .orElseThrow(() -> new CourierNotFoundException(courierId));

        courier.setStatus(request.getStatus());

        Courier saved = courierRepository.save(courier);

        return CourierResponse.builder()
                .id(saved.getId())
                .firstName(saved.getFirstName())
                .lastName(saved.getLastName())
                .email(saved.getEmail())
                .phone(saved.getPhone())
                .vehicleType(saved.getVehicleType())
                .status(saved.getStatus())
                .rating(saved.getRating())
                .active(saved.getStatus() != com.foodrush.courier.domain.model.CourierStatus.OFFLINE)
                .build();
    }
}
