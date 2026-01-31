package com.foodrush.courier.infrastructure.messaging.publisher;

import com.foodrush.courier.infrastructure.messaging.event.CourierLocationUpdatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

/**
 * Publisher para eventos de ubicación de couriers
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class LocationEventPublisher {

    private final KafkaTemplate<String, CourierLocationUpdatedEvent> kafkaTemplate;

    @Value("${kafka.topics.location-updates}")
    private String locationUpdatesTopic;

    /**
     * Publica evento de actualización de ubicación
     * 
     * @param event Evento de ubicación
     */
    public void publishLocationUpdate(CourierLocationUpdatedEvent event) {
        try {
            String key = event.getCourierId().toString();

            kafkaTemplate.send(locationUpdatesTopic, key, event)
                    .whenComplete((result, ex) -> {
                        if (ex != null) {
                            log.error("Failed to publish location update for courier {}: {}",
                                    event.getCourierId(), ex.getMessage());
                        } else {
                            log.debug("Published location update for courier {} to topic {}",
                                    event.getCourierId(), locationUpdatesTopic);
                        }
                    });
        } catch (Exception e) {
            log.error("Error publishing location update event", e);
        }
    }
}
