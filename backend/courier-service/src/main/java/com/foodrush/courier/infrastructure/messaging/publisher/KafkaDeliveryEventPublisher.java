package com.foodrush.courier.infrastructure.messaging.publisher;

import com.foodrush.courier.domain.messaging.DeliveryEventPublisher;
import com.foodrush.courier.domain.model.Delivery;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class KafkaDeliveryEventPublisher implements DeliveryEventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${kafka.topics.delivery-events}")
    private String deliveryEventsTopic;

    @Override
    public void publishDeliveryAssigned(Delivery delivery) {
        Map<String, Object> event = new HashMap<>();
        event.put("eventType", "DELIVERY_ASSIGNED");
        event.put("deliveryId", delivery.getId());
        event.put("orderId", delivery.getOrderId());
        event.put("courierId", delivery.getCourier().getId());
        event.put("status", delivery.getStatus());
        event.put("timestamp", delivery.getUpdatedAt().format(DateTimeFormatter.ISO_DATE_TIME));

        log.info("Publishing DELIVERY_ASSIGNED event for delivery: {}", delivery.getId());
        kafkaTemplate.send(deliveryEventsTopic, delivery.getId().toString(), event);
    }

    @Override
    public void publishDeliveryPickedUp(Delivery delivery) {
        Map<String, Object> event = new HashMap<>();
        event.put("eventType", "DELIVERY_PICKED_UP");
        event.put("deliveryId", delivery.getId());
        event.put("orderId", delivery.getOrderId());
        event.put("courierId", delivery.getCourier().getId());
        event.put("status", delivery.getStatus());
        event.put("timestamp", delivery.getUpdatedAt().format(DateTimeFormatter.ISO_DATE_TIME));

        log.info("Publishing DELIVERY_PICKED_UP event for delivery: {}", delivery.getId());
        kafkaTemplate.send(deliveryEventsTopic, delivery.getId().toString(), event);
    }

    @Override
    public void publishDeliveryCompleted(Delivery delivery) {
        Map<String, Object> event = new HashMap<>();
        event.put("eventType", "DELIVERY_COMPLETED");
        event.put("deliveryId", delivery.getId());
        event.put("orderId", delivery.getOrderId());
        event.put("courierId", delivery.getCourier().getId());
        event.put("status", delivery.getStatus());
        event.put("earnings", delivery.getEarnings());
        event.put("distanceKm", delivery.getDistance());
        event.put("timestamp", delivery.getUpdatedAt().format(DateTimeFormatter.ISO_DATE_TIME));

        log.info("Publishing DELIVERY_COMPLETED event for delivery: {}", delivery.getId());
        kafkaTemplate.send(deliveryEventsTopic, delivery.getId().toString(), event);
    }
}
