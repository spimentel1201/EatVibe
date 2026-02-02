package com.foodrush.courier.application.usecase;

import com.foodrush.courier.domain.exception.CourierNotFoundException;
import com.foodrush.courier.domain.exception.DeliveryNotFoundException;
import com.foodrush.courier.domain.messaging.DeliveryEventPublisher;
import com.foodrush.courier.domain.model.Courier;
import com.foodrush.courier.domain.model.CourierLocation;
import com.foodrush.courier.domain.model.Delivery;
import com.foodrush.courier.domain.repository.CourierLocationRepository;
import com.foodrush.courier.domain.repository.CourierRepository;
import com.foodrush.courier.domain.repository.DeliveryRepository;
import com.foodrush.courier.domain.service.CourierAssignmentService;
import com.foodrush.courier.domain.service.GeolocationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Use Case: Asignar Courier a Delivery
 * 
 * Proceso:
 * 1. Buscar delivery por ID
 * 2. Obtener couriers disponibles en radio X km del pickup
 * 3. Filtrar couriers con ubicación reciente (últimos 5 min)
 * 4. Aplicar algoritmo de scoring
 * 5. Asignar mejor courier
 * 6. Actualizar estados
 * 7. Publicar evento
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AssignCourierToDeliveryUseCase {

    private final DeliveryRepository deliveryRepository;
    private final CourierRepository courierRepository;
    private final CourierLocationRepository locationRepository;
    private final CourierAssignmentService assignmentService;
    private final GeolocationService geolocationService;
    private final DeliveryEventPublisher eventPublisher;

    @Value("${geolocation.max-assignment-radius-km}")
    private double maxAssignmentRadiusKm;

    /**
     * Asigna automáticamente el mejor courier disponible a una entrega
     * 
     * @param deliveryId ID de la entrega
     * @return ID del courier asignado
     * @throws DeliveryNotFoundException si la entrega no existe
     * @throws IllegalStateException     si no hay couriers disponibles
     */
    @Transactional
    public UUID execute(UUID deliveryId) {
        log.info("Starting courier assignment for delivery: {}", deliveryId);

        // 1. Buscar delivery
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new DeliveryNotFoundException(deliveryId));

        // Validar que la entrega esté en estado PENDING
        if (delivery.getStatus() != com.foodrush.courier.domain.model.DeliveryStatus.PENDING) {
            throw new IllegalStateException(
                    "Delivery " + deliveryId + " is not in PENDING status: " + delivery.getStatus());
        }

        Point pickupLocation = delivery.getPickupLocation();
        Point deliveryLocation = delivery.getDeliveryLocation();

        if (pickupLocation == null || deliveryLocation == null) {
            throw new IllegalStateException("Delivery locations are not set");
        }

        // 2. Buscar couriers disponibles cerca del pickup
        List<Courier> availableCouriers = courierRepository.findAvailableWithinRadius(
                pickupLocation,
                maxAssignmentRadiusKm);

        log.debug("Found {} available couriers within {} km",
                availableCouriers.size(), maxAssignmentRadiusKm);

        if (availableCouriers.isEmpty()) {
            throw new IllegalStateException(
                    "No available couriers found within " + maxAssignmentRadiusKm + " km");
        }

        // 3. Filtrar couriers con ubicación reciente y calcular scores
        List<CourierWithScore> couriersWithScores = new ArrayList<>();

        for (Courier courier : availableCouriers) {
            var latestLocation = locationRepository.findLatestByCourier(courier);

            if (latestLocation.isEmpty()) {
                log.debug("Courier {} has no location data, skipping", courier.getId());
                continue;
            }

            CourierLocation location = latestLocation.get();

            // Verificar que la ubicación sea reciente (últimos 5 minutos)
            if (!location.isRecent()) {
                log.debug("Courier {} location is not recent, skipping", courier.getId());
                continue;
            }

            // Calcular score
            double score = assignmentService.calculateScoreWithLocation(
                    courier,
                    location.getLocation(),
                    pickupLocation,
                    deliveryLocation);

            if (score > 0) {
                couriersWithScores.add(new CourierWithScore(courier, score));
            }
        }

        if (couriersWithScores.isEmpty()) {
            throw new IllegalStateException("No suitable couriers found with recent location data");
        }

        // 4. Seleccionar el courier con mayor score
        Courier bestCourier = couriersWithScores.stream()
                .max((a, b) -> Double.compare(a.score, b.score))
                .map(cs -> cs.courier)
                .orElseThrow(() -> new IllegalStateException("Failed to select best courier"));

        log.info("Selected courier {} for delivery {} with score {}",
                bestCourier.getId(), deliveryId,
                couriersWithScores.stream()
                        .filter(cs -> cs.courier.equals(bestCourier))
                        .findFirst()
                        .map(cs -> cs.score)
                        .orElse(0.0));

        // 5. Asignar courier a la entrega
        delivery.assign(bestCourier);

        // 6. Guardar cambios
        deliveryRepository.save(delivery);
        courierRepository.save(bestCourier);

        log.info("Successfully assigned courier {} to delivery {}",
                bestCourier.getId(), deliveryId);

        // 7. Publicar evento DeliveryAssignedEvent
        eventPublisher.publishDeliveryAssigned(delivery);
        log.info("Published DELIVERY_ASSIGNED event for delivery {}", delivery.getId());

        return bestCourier.getId();
    }

    /**
     * Asigna un courier específico a una entrega (asignación manual)
     * 
     * @param deliveryId ID de la entrega
     * @param courierId  ID del courier
     * @throws DeliveryNotFoundException si la entrega no existe
     * @throws CourierNotFoundException  si el courier no existe
     */
    @Transactional
    public void assignSpecificCourier(UUID deliveryId, UUID courierId) {
        log.info("Manual assignment: courier {} to delivery {}", courierId, deliveryId);

        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new DeliveryNotFoundException(deliveryId));

        Courier courier = courierRepository.findById(courierId)
                .orElseThrow(() -> new CourierNotFoundException(courierId));

        // Validar que el courier pueda recibir entregas
        if (!courier.canReceiveDeliveries()) {
            throw new IllegalStateException(
                    "Courier " + courierId + " cannot receive deliveries. Status: " + courier.getStatus());
        }

        // Asignar
        delivery.assign(courier);

        // Guardar
        deliveryRepository.save(delivery);
        courierRepository.save(courier);

        log.info("Successfully assigned courier {} to delivery {} (manual)", courierId, deliveryId);
    }

    /**
     * Clase interna para asociar courier con score
     */
    private record CourierWithScore(Courier courier, double score) {
    }
}
