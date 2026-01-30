package com.foodrush.payment.infrastructure.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

/**
 * Configuración de Kafka para el Payment Service.
 * 
 * <p>
 * Define los topics necesarios para la comunicación asíncrona.
 * </p>
 */
@Configuration
public class KafkaConfig {

    @Value("${kafka.topics.payment-events}")
    private String paymentEventsTopic;

    @Value("${kafka.topics.refund-events}")
    private String refundEventsTopic;

    /**
     * Topic para eventos de pago (PaymentCompleted, PaymentFailed).
     */
    @Bean
    public NewTopic paymentEventsTopic() {
        return TopicBuilder.name(paymentEventsTopic)
                .partitions(3)
                .replicas(1)
                .build();
    }

    /**
     * Topic para eventos de reembolso.
     */
    @Bean
    public NewTopic refundEventsTopic() {
        return TopicBuilder.name(refundEventsTopic)
                .partitions(3)
                .replicas(1)
                .build();
    }
}
