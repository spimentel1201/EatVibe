package com.foodrush.courier.application.usecase;

import com.foodrush.courier.domain.exception.CourierNotAtLocationException;
import com.foodrush.courier.domain.exception.DeliveryNotFoundException;
import com.foodrush.courier.domain.model.CourierLocation;
import com.foodrush.courier.domain.model.Delivery;
import com.foodrush.courier.domain.repository.CourierLocationRepository;
import com.foodrush.courier.domain.repository.DeliveryRepository;
import com.foodrush.courier.domain.service.GeofencingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Use Case: Marcar entrega como recogida del restaurante
 * 
 * Valida que el courier esté en la ubicación del restaurante
 * usando geofencing antes de permitir marcar como picked up.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MarkAsPickedUpUseCase {

    private final DeliveryRepository deliveryRepository;
    private final CourierLocationRepository locationRepository;
    private final GeofencingService geofencingService;

    @Transactional
    public void execute(UUID deliveryId) {
        log.info("Marking delivery {} as picked up", deliveryId);

        // 1. Buscar delivery
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new DeliveryNotFoundException(deliveryId));

        // 2. Validar que tenga courier asignado
        if (delivery.getCourier() == null) {
            throw new IllegalStateException("Delivery has no courier assigned");
        }

        // 3. Obtener ubicación actual del courier
        CourierLocation courierLocation = locationRepository
                .findLatestByCourier(delivery.getCourier())
                .orElseThrow(() -> new IllegalStateException("Courier has no location data"));

        // 4. Validar que el courier esté en el pickup location (geofencing)
        geofencingService.validateCourierAtPickup(
                courierLocation.getLocation(),
                delivery.getPickupLocation());

        // 5. Marcar como picked up
        delivery.markAsPickedUp();

        // 6. Guardar
        deliveryRepository.save(delivery);

        log.info("Delivery {} marked as picked up by courier {}",
                deliveryId, delivery.getCourier().getId());

        // 7. TODO: Publicar evento DeliveryPickedUpEvent
    }
}
