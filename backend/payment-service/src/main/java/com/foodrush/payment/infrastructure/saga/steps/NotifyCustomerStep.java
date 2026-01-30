package com.foodrush.payment.infrastructure.saga.steps;

import com.foodrush.payment.domain.saga.CreateOrderSagaContext;
import com.foodrush.payment.domain.saga.SagaStep;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Paso 4 del SAGA: Notificar al cliente.
 * 
 * <p>
 * En un sistema real, este paso llamaría al Notification Service
 * para enviar confirmación al cliente.
 * </p>
 */
@Component
@Order(4)
@Slf4j
public class NotifyCustomerStep implements SagaStep<CreateOrderSagaContext> {

    @Override
    public String getName() {
        return "NotifyCustomer";
    }

    @Override
    public void execute(CreateOrderSagaContext context) throws Exception {
        log.info("Ejecutando NotifyCustomerStep - User: {}, Order: {}",
                context.getUserId(), context.getOrderId());

        // Simular envío de notificación
        // En producción: publicar NotificationCommand a Kafka o llamada HTTP

        log.info("Notificación enviada - Order: {}, User: {}",
                context.getOrderId(), context.getUserId());
    }

    @Override
    public void compensate(CreateOrderSagaContext context) {
        log.warn("Compensando NotifyCustomerStep - Enviando notificación de cancelación");

        // Simular envío de notificación de cancelación
        // En producción: publicar OrderCancelledNotification

        log.info("Notificación de cancelación enviada - Order: {}", context.getOrderId());
    }
}
