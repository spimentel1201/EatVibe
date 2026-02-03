package com.foodrush.courier.application.usecase;

import com.foodrush.courier.domain.model.CourierLocation;
import com.foodrush.courier.domain.repository.CourierLocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetLatestLocationUseCase {

    private final CourierLocationRepository locationRepository;
    private final com.foodrush.courier.domain.repository.CourierRepository courierRepository;

    public CourierLocation execute(UUID courierId) {
        var courier = courierRepository.findById(courierId)
                .orElseThrow(() -> new RuntimeException("Courier not found: " + courierId));

        return locationRepository.findLatestByCourier(courier)
                .orElseThrow(() -> new RuntimeException("Location not found for courier: " + courierId));
    }
}
