package com.foodrush.payment.infrastructure.messaging;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Consumidor de eventos del Order Service.
 * 
 * <p>
 * Escucha eventos de pedidos para procesamiento automático de pagos.
 * </p>
 */
@Component
@Slf4j
public class OrderEventConsumer {

    /**
     * Escucha eventos de pedidos creados.
     * 
     * <p>
     * En una implementación completa, este consumer podría:
     * - Iniciar procesamiento automático de pago
     * - Validar disponibilidad de métodos de pago
     * - Notificar al usuario sobre opciones de pago
     * </p>
     */
    @KafkaListener(topics = "${kafka.topics.order-events}", groupId = "${kafka.consumer.group-id}", containerFactory = "kafkaListenerContainerFactory")
    public void handleOrderCreatedEvent(String message) {
        log.info("Evento de pedido recibido: {}", message);

        // TODO: Implementar lógica de procesamiento
        // - Parsear OrderCreatedEvent
        // - Validar datos del pedido
        // - Preparar para procesamiento de pago

        log.debug("Procesamiento de OrderCreatedEvent completado");
    }
}
