package com.foodrush.courier.application.usecase;

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
 * Use Case: Marcar entrega como entregada
 * 
 * Valida:
 * 1. PIN de entrega
 * 2. Ubicación del courier (geofencing)
 * 3. Estado de la entrega
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MarkAsDeliveredUseCase {

    private final DeliveryRepository deliveryRepository;
    private final CourierLocationRepository locationRepository;
    private final GeofencingService geofencingService;

    @Transactional
    public void execute(UUID deliveryId, String pin) {
        log.info("Marking delivery {} as delivered", deliveryId);

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

        // 4. Validar que el courier esté en el delivery location (geofencing)
        geofencingService.validateCourierAtDelivery(
                courierLocation.getLocation(),
                delivery.getDeliveryLocation());

        // 5. Marcar como delivered (valida PIN internamente)
        boolean success = delivery.markAsDelivered(pin);

        if (!success) {
            throw new IllegalArgumentException("Invalid delivery PIN");
        }

        // 6. Actualizar courier (completa delivery, actualiza rating si aplica)
        if (delivery.getCourier() != null) {
            delivery.getCourier().completeDelivery(null); // Rating se actualizará después
        }

        // 7. Guardar
        deliveryRepository.save(delivery);

        log.info("Delivery {} marked as delivered by courier {}",
                deliveryId, delivery.getCourier().getId());

        // 8. TODO: Publicar evento DeliveryCompletedEvent
        // 9. TODO: Calcular earnings del courier
    }
}
