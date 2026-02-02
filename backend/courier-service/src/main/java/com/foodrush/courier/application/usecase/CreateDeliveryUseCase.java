package com.foodrush.courier.application.usecase;

import com.foodrush.courier.application.dto.request.CreateDeliveryRequest;
import com.foodrush.courier.application.dto.response.DeliveryResponse;
import com.foodrush.courier.domain.model.Delivery;
import com.foodrush.courier.domain.repository.DeliveryRepository;
import com.foodrush.courier.domain.service.GeolocationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;

/**
 * Use Case: Crear Delivery
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CreateDeliveryUseCase {

    private final DeliveryRepository deliveryRepository;
    private final GeolocationService geolocationService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public DeliveryResponse execute(CreateDeliveryRequest request) {
        log.info("Creating delivery for order: {}", request.getOrderId());

        // 1. Validar y crear puntos PostGIS
        Point pickupLocation = geolocationService.createPoint(
                request.getPickupLatitude(),
                request.getPickupLongitude());

        Point deliveryLocation = geolocationService.createPoint(
                request.getDeliveryLatitude(),
                request.getDeliveryLongitude());

        // 2. Calcular distancia
        double distanceKm = geolocationService.calculateDistance(pickupLocation, deliveryLocation);

        // 3. Generar PIN si no se proporcionó
        String pin = request.getDeliveryPin();
        if (pin == null || pin.isEmpty()) {
            pin = generateDeliveryPin();
        }

        // 4. Crear entidad Delivery
        Delivery delivery = Delivery.builder()
                .orderId(request.getOrderId())
                .pickupLocation(pickupLocation)
                .deliveryLocation(deliveryLocation)
                .deliveryPin(pin)
                .distance(BigDecimal.valueOf(distanceKm))
                .build();

        // 5. Guardar
        Delivery saved = deliveryRepository.save(delivery);

        log.info("Created delivery {} for order {} with distance {} km",
                saved.getId(), request.getOrderId(), distanceKm);

        // 6. Mapear a response
        return mapToResponse(saved);
    }

    /**
     * Genera un PIN aleatorio de 6 dígitos
     */
    private String generateDeliveryPin() {
        int pin = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(pin);
    }

    private DeliveryResponse mapToResponse(Delivery delivery) {
        return DeliveryResponse.builder()
                .id(delivery.getId())
                .orderId(delivery.getOrderId())
                .courierId(delivery.getCourier() != null ? delivery.getCourier().getId() : null)
                .courierName(delivery.getCourier() != null ? delivery.getCourier().getName() : null)
                .status(delivery.getStatus())
                .pickupLatitude(delivery.getPickupLocation().getY())
                .pickupLongitude(delivery.getPickupLocation().getX())
                .deliveryLatitude(delivery.getDeliveryLocation().getY())
                .deliveryLongitude(delivery.getDeliveryLocation().getX())
                .earnings(delivery.getEarnings())
                .distance(delivery.getDistance())
                .assignedAt(delivery.getAssignedAt())
                .pickedUpAt(delivery.getPickedUpAt())
                .deliveredAt(delivery.getDeliveredAt())
                .cancelledAt(delivery.getCancelledAt())
                .createdAt(delivery.getCreatedAt())
                .updatedAt(delivery.getUpdatedAt())
                .build();
    }
}
