package com.foodrush.courier.infrastructure.messaging.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Evento publicado cuando un courier actualiza su ubicación
 * 
 * Este evento es consumido por:
 * - WebSocket service para broadcast en tiempo real
 * - Analytics service para tracking de rutas
 * - Notification service para ETAs
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourierLocationUpdatedEvent {

    private UUID courierId;
    private UUID deliveryId; // Si está en una entrega activa
    private Double latitude;
    private Double longitude;
    private Double accuracy;
    private Double speed;
    private LocalDateTime timestamp;

    @Builder.Default
    private String eventType = "COURIER_LOCATION_UPDATED";
}
