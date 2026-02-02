package com.foodrush.courier.api.websocket;

import com.foodrush.courier.application.dto.request.LocationUpdateRequest;
import com.foodrush.courier.application.usecase.UpdateCourierLocationUseCase;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.util.UUID;

/**
 * Controller para manejar mensajes WebSocket entrantes
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class CourierWebSocketController {

    private final UpdateCourierLocationUseCase updateCourierLocationUseCase;

    /**
     * Recibe actualizaciones de ubicación directamente por WebSocket.
     * Esto es más eficiente que REST para alta frecuencia.
     * 
     * Cliente envía a: /app/courier/{courierId}/location
     */
    @MessageMapping("/courier/{courierId}/location")
    public void updateLocation(
            @DestinationVariable UUID courierId,
            @Payload LocationUpdateRequest request) {

        log.debug("WS: Received location update for courier {}", courierId);

        // La actualización de ubicación ya dispara el evento que hace broadcast
        // a través del LocationEventPublisher -> Kafka -> (Quizás otro consumidor WS)
        // PERO para feedback inmediato en el mismo servicio, podríamos hacer broadcast
        // aquí.
        // Por ahora, reutilizamos el caso de uso que persiste y notifica.
        updateCourierLocationUseCase.execute(courierId, request);
    }
}
