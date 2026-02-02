package com.foodrush.courier.application.usecase;

import com.foodrush.courier.application.dto.request.LocationUpdateRequest;
import com.foodrush.courier.application.dto.response.LocationResponse;
import com.foodrush.courier.domain.exception.CourierNotFoundException;
import com.foodrush.courier.domain.model.Courier;
import com.foodrush.courier.domain.model.CourierLocation;
import com.foodrush.courier.domain.model.Delivery;
import com.foodrush.courier.domain.repository.CourierLocationRepository;
import com.foodrush.courier.domain.repository.CourierRepository;
import com.foodrush.courier.domain.repository.DeliveryRepository;
import com.foodrush.courier.domain.service.GeolocationService;
import com.foodrush.courier.infrastructure.messaging.event.CourierLocationUpdatedEvent;
import com.foodrush.courier.infrastructure.messaging.publisher.LocationEventPublisher;
import com.foodrush.courier.infrastructure.messaging.websocket.WebSocketNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Use Case: Actualizar ubicación del courier
 * 
 * Funcionalidades:
 * - Valida coordenadas
 * - Crea punto PostGIS
 * - Guarda ubicación en base de datos
 * - Publica evento a Kafka
 * - Broadcast vía WebSocket
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UpdateCourierLocationUseCase {

        private final CourierRepository courierRepository;
        private final CourierLocationRepository locationRepository;
        private final DeliveryRepository deliveryRepository;
        private final GeolocationService geolocationService;
        private final LocationEventPublisher locationEventPublisher;
        private final WebSocketNotificationService webSocketNotificationService;

        /**
         * Actualiza la ubicación del courier
         * 
         * @param courierId ID del courier
         * @param request   Datos de ubicación
         * @return Respuesta con la ubicación guardada
         */
        @Transactional
        public LocationResponse execute(UUID courierId, LocationUpdateRequest request) {
                log.debug("Updating location for courier: {}", courierId);

                // 1. Buscar courier
                Courier courier = courierRepository.findById(courierId)
                                .orElseThrow(() -> new CourierNotFoundException(courierId));

                // 2. Validar y crear punto PostGIS
                Point location = geolocationService.createPoint(
                                request.getLatitude(),
                                request.getLongitude());

                // 3. Crear entidad CourierLocation
                CourierLocation courierLocation = CourierLocation.builder()
                                .courier(courier)
                                .location(location)
                                .latitude(request.getLatitude())
                                .longitude(request.getLongitude())
                                .timestamp(LocalDateTime.now())
                                .accuracy(request.getAccuracy())
                                .speed(request.getSpeed())
                                .build();

                // 4. Guardar en base de datos
                CourierLocation saved = locationRepository.save(courierLocation);

                log.info("Location updated for courier {}: ({}, {})",
                                courierId, request.getLatitude(), request.getLongitude());

                // 5. Publicar evento a Kafka
                CourierLocationUpdatedEvent event = CourierLocationUpdatedEvent.builder()
                                .courierId(courier.getId())
                                .latitude(saved.getLatitude())
                                .longitude(saved.getLongitude())
                                .accuracy(saved.getAccuracy())
                                .speed(saved.getSpeed())
                                .timestamp(saved.getTimestamp())
                                .build();

                locationEventPublisher.publishLocationUpdate(event);

                // 6. Broadcast vía WebSocket si hay entrega activa
                LocationResponse response = LocationResponse.builder()
                                .id(saved.getId())
                                .courierId(courier.getId())
                                .latitude(saved.getLatitude())
                                .longitude(saved.getLongitude())
                                .timestamp(saved.getTimestamp())
                                .accuracy(saved.getAccuracy())
                                .speed(saved.getSpeed())
                                .build();

                // Buscar entregas activas para notificar al cliente correspondiente
                List<Delivery> activeDeliveries = deliveryRepository.findActiveByCourier(courier);
                for (Delivery delivery : activeDeliveries) {
                        webSocketNotificationService.convertAndSendOrderingTrackingUpdate(delivery.getOrderId(),
                                        response);
                }

                // 7. Retornar respuesta
                return response;
        }
}
