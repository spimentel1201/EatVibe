package com.foodrush.payment.infrastructure.messaging;

import com.foodrush.payment.domain.event.PaymentCompletedEvent;
import com.foodrush.payment.domain.event.PaymentFailedEvent;
import com.foodrush.payment.domain.event.RefundProcessedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

/**
 * Productor de eventos de pago para Kafka.
 * 
 * <p>
 * Publica eventos de dominio a los topics correspondientes.
 * </p>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${kafka.topics.payment-events}")
    private String paymentEventsTopic;

    @Value("${kafka.topics.refund-events}")
    private String refundEventsTopic;

    /**
     * Publica un evento de pago completado.
     */
    public void publishPaymentCompleted(PaymentCompletedEvent event) {
        log.info("Publicando PaymentCompletedEvent - Order: {}, Transaction: {}",
                event.getOrderId(), event.getTransactionId());

        CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(paymentEventsTopic,
                event.getOrderId().toString(), event);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                log.info("Evento PaymentCompleted publicado exitosamente - Partition: {}, Offset: {}",
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
            } else {
                log.error("Error al publicar PaymentCompletedEvent", ex);
            }
        });
    }

    /**
     * Publica un evento de pago fallido.
     */
    public void publishPaymentFailed(PaymentFailedEvent event) {
        log.info("Publicando PaymentFailedEvent - Order: {}, Transaction: {}, Error: {}",
                event.getOrderId(), event.getTransactionId(), event.getErrorCode());

        CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(paymentEventsTopic,
                event.getOrderId().toString(), event);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                log.info("Evento PaymentFailed publicado exitosamente - Partition: {}, Offset: {}",
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
            } else {
                log.error("Error al publicar PaymentFailedEvent", ex);
            }
        });
    }

    /**
     * Publica un evento de reembolso procesado.
     */
    public void publishRefundProcessed(RefundProcessedEvent event) {
        log.info("Publicando RefundProcessedEvent - Order: {}, Refund ID: {}",
                event.getOrderId(), event.getRefundId());

        CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(refundEventsTopic,
                event.getOrderId().toString(), event);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                log.info("Evento RefundProcessed publicado exitosamente - Partition: {}, Offset: {}",
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
            } else {
                log.error("Error al publicar RefundProcessedEvent", ex);
            }
        });
    }
}
