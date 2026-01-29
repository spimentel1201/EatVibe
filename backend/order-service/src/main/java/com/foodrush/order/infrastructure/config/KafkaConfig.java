package com.foodrush.order.infrastructure.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

/**
 * Configuración de Kafka para el Order Service.
 * 
 * <p>
 * Define los topics de Kafka y configuraciones del producer.
 */
@Configuration
public class KafkaConfig {

    public static final String ORDERS_TOPIC = "orders-topic";

    /**
     * Crea el topic de pedidos si no existe.
     */
    @Bean
    public NewTopic ordersTopic() {
        return TopicBuilder.name(ORDERS_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
}
