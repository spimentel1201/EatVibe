package com.foodrush.courier.infrastructure.messaging.websocket;

import com.foodrush.courier.application.dto.response.LocationResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Servicio para enviar notificaciones vía WebSocket
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Envía actualización de ubicación al topic de tracking de una orden
     * Topic: /topic/orders/{orderId}/track
     */
    public void convertAndSendOrderingTrackingUpdate(UUID orderId, LocationResponse location) {
        String destination = "/topic/orders/" + orderId + "/track";
        try {
            messagingTemplate.convertAndSend(destination, location);
            log.trace("WS sent to {}: {}", destination, location);
        } catch (Exception e) {
            log.error("Failed to send WS message to {}", destination, e);
        }
    }
}
