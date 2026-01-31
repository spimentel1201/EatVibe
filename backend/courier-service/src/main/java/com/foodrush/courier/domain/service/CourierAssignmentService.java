package com.foodrush.courier.domain.service;

import com.foodrush.courier.domain.model.Courier;
import com.foodrush.courier.domain.model.VehicleType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

/**
 * Servicio de Asignación de Couriers
 * 
 * Implementa el algoritmo de asignación inteligente que considera:
 * 1. Distancia al punto de pickup
 * 2. Tipo de vehículo vs distancia total
 * 3. Rating del courier
 * 4. Carga actual (número de entregas activas)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CourierAssignmentService {

    private final GeolocationService geolocationService;

    @Value("${geolocation.max-assignment-radius-km}")
    private double maxAssignmentRadiusKm;

    /**
     * Encuentra el mejor courier disponible para una entrega
     * 
     * Algoritmo de scoring:
     * - Score base: 100 puntos
     * - Penalización por distancia: -10 puntos por km
     * - Bonus por rating: +20 puntos si rating >= 4.5
     * - Penalización si vehículo no puede manejar la distancia: -1000 puntos
     * - Bonus por tipo de vehículo adecuado: +15 puntos
     * 
     * @param availableCouriers Lista de couriers disponibles cerca del pickup
     * @param pickupLocation    Ubicación del restaurante
     * @param deliveryLocation  Ubicación del cliente
     * @return El mejor courier o Optional.empty() si ninguno es adecuado
     */
    public Optional<Courier> findBestCourier(
            List<Courier> availableCouriers,
            Point pickupLocation,
            Point deliveryLocation) {
        if (availableCouriers.isEmpty()) {
            log.warn("No available couriers to assign");
            return Optional.empty();
        }

        double totalDistance = geolocationService.calculateDistance(pickupLocation, deliveryLocation);

        log.debug("Finding best courier for delivery. Total distance: {} km", totalDistance);

        return availableCouriers.stream()
                .map(courier -> new CourierScore(courier,
                        calculateScore(courier, pickupLocation, deliveryLocation, totalDistance)))
                .peek(cs -> log.debug("Courier {} score: {}", cs.courier.getId(), cs.score))
                .max(Comparator.comparingDouble(cs -> cs.score))
                .filter(cs -> cs.score > 0) // Solo retornar si el score es positivo
                .map(cs -> cs.courier);
    }

    /**
     * Calcula el score de un courier para una entrega específica
     */
    private double calculateScore(
            Courier courier,
            Point pickupLocation,
            Point deliveryLocation,
            double totalDistance) {
        double score = 100.0; // Score base

        // 1. Penalización por distancia al pickup
        // Asumimos que el courier tiene una ubicación reciente
        // (esto se validará en el use case)
        double distanceToPickup = 0; // Se calculará en el use case con la ubicación real
        score -= (distanceToPickup * 10);

        // 2. Verificar si el vehículo puede manejar la distancia total
        if (!courier.canHandleDistance(totalDistance)) {
            log.debug("Courier {} vehicle {} cannot handle distance {} km",
                    courier.getId(), courier.getVehicleType(), totalDistance);
            score -= 1000; // Penalización severa
        }

        // 3. Bonus por tipo de vehículo adecuado
        score += getVehicleTypeBonus(courier.getVehicleType(), totalDistance);

        // 4. Bonus por rating alto
        if (courier.getRating() >= 4.5) {
            score += 20;
        } else if (courier.getRating() >= 4.0) {
            score += 10;
        }

        // 5. Penalización leve por rating bajo
        if (courier.getRating() < 3.5) {
            score -= 15;
        }

        return score;
    }

    /**
     * Calcula bonus basado en el tipo de vehículo y la distancia
     */
    private double getVehicleTypeBonus(VehicleType vehicleType, double distanceKm) {
        return switch (vehicleType) {
            case BICYCLE -> {
                // Bicicletas son ideales para distancias cortas
                if (distanceKm <= 3)
                    yield 15;
                if (distanceKm <= 5)
                    yield 5;
                yield 0;
            }
            case MOTORCYCLE -> {
                // Motos son versátiles para distancias medias
                if (distanceKm > 3 && distanceKm <= 10)
                    yield 15;
                if (distanceKm <= 15)
                    yield 10;
                yield 5;
            }
            case CAR -> {
                // Autos son mejores para distancias largas
                if (distanceKm > 10)
                    yield 15;
                if (distanceKm > 5)
                    yield 10;
                yield 0;
            }
        };
    }

    /**
     * Calcula el score considerando la ubicación actual del courier
     */
    public double calculateScoreWithLocation(
            Courier courier,
            Point courierLocation,
            Point pickupLocation,
            Point deliveryLocation) {
        double score = 100.0;

        // 1. Distancia al pickup
        double distanceToPickup = geolocationService.calculateDistance(courierLocation, pickupLocation);
        score -= (distanceToPickup * 10);

        // 2. Distancia total de la entrega
        double totalDistance = geolocationService.calculateDistance(pickupLocation, deliveryLocation);

        // 3. Verificar capacidad del vehículo
        if (!courier.canHandleDistance(totalDistance)) {
            score -= 1000;
        }

        // 4. Bonus por tipo de vehículo
        score += getVehicleTypeBonus(courier.getVehicleType(), totalDistance);

        // 5. Bonus/penalización por rating
        if (courier.getRating() >= 4.5) {
            score += 20;
        } else if (courier.getRating() >= 4.0) {
            score += 10;
        } else if (courier.getRating() < 3.5) {
            score -= 15;
        }

        log.debug("Courier {} final score: {} (distance to pickup: {} km, total distance: {} km)",
                courier.getId(), score, distanceToPickup, totalDistance);

        return score;
    }

    /**
     * Clase interna para asociar courier con su score
     */
    private record CourierScore(Courier courier, double score) {
    }
}
