package com.foodrush.courier.infrastructure.config;

import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

/**
 * Configuración de Kafka Topics para Courier Service
 * 
 * Define los topics necesarios para comunicación asíncrona:
 * - courier-events: Eventos de estado de couriers
 * - delivery-events: Eventos de entregas
 * - location-updates: Actualizaciones de ubicación en tiempo real
 * - order-events: Consumo de eventos de pedidos
 */
@Configuration
@Slf4j
public class KafkaConfig {

    @Value("${kafka.topics.courier-events}")
    private String courierEventsTopic;

    @Value("${kafka.topics.delivery-events}")
    private String deliveryEventsTopic;

    @Value("${kafka.topics.location-updates}")
    private String locationUpdatesTopic;

    @Value("${kafka.topics.order-events}")
    private String orderEventsTopic;

    /**
     * Topic para eventos de couriers (status changes, availability)
     */
    @Bean
    public NewTopic courierEventsTopic() {
        return TopicBuilder.name(courierEventsTopic)
                .partitions(3)
                .replicas(1)
                .build();
    }

    /**
     * Topic para eventos de deliveries (assigned, picked up, delivered)
     */
    @Bean
    public NewTopic deliveryEventsTopic() {
        return TopicBuilder.name(deliveryEventsTopic)
                .partitions(3)
                .replicas(1)
                .build();
    }

    /**
     * Topic para actualizaciones de ubicación en tiempo real
     * Alta frecuencia de mensajes, más particiones para mejor throughput
     */
    @Bean
    public NewTopic locationUpdatesTopic() {
        return TopicBuilder.name(locationUpdatesTopic)
                .partitions(6)
                .replicas(1)
                .compact() // Compactación para mantener solo última ubicación
                .build();
    }

    /**
     * Topic de order-events ya existe, solo lo consumimos
     * No lo creamos aquí para evitar conflictos con Order Service
     */
}
