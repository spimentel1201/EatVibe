package com.foodrush.order.infrastructure.messaging.producer;

import com.foodrush.order.domain.event.OrderCreatedEvent;
import com.foodrush.order.infrastructure.config.KafkaConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

/**
 * Productor de eventos de pedidos a Kafka.
 * 
 * <p>
 * Este componente es responsable de publicar eventos de dominio relacionados
 * con pedidos al topic de Kafka para comunicación asíncrona con otros
 * servicios.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventProducer {

    private final KafkaTemplate<String, OrderCreatedEvent> kafkaTemplate;

    /**
     * Publica un evento de pedido creado al topic de Kafka.
     * 
     * @param event el evento a publicar
     */
    public void publishOrderCreated(OrderCreatedEvent event) {
        String key = event.getOrderId().toString();

        log.info("Publicando evento OrderCreated para pedido: {}", event.getOrderId());

        CompletableFuture<SendResult<String, OrderCreatedEvent>> future = kafkaTemplate.send(KafkaConfig.ORDERS_TOPIC,
                key, event);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                log.info("Evento OrderCreated publicado exitosamente. Topic: {}, Partition: {}, Offset: {}",
                        result.getRecordMetadata().topic(),
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
            } else {
                log.error("Error al publicar evento OrderCreated para pedido: {}", event.getOrderId(), ex);
            }
        });
    }
}
