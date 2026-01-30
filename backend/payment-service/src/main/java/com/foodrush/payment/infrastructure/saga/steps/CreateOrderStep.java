package com.foodrush.payment.infrastructure.saga.steps;

import com.foodrush.payment.domain.saga.CreateOrderSagaContext;
import com.foodrush.payment.domain.saga.SagaStep;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Paso 1 del SAGA: Crear pedido.
 * 
 * <p>
 * En un sistema real, este paso llamaría al Order Service vía HTTP o eventos.
 * Para demostración, simulamos la creación del pedido.
 * </p>
 */
@Component
@Order(1)
@Slf4j
public class CreateOrderStep implements SagaStep<CreateOrderSagaContext> {

    @Override
    public String getName() {
        return "CreateOrder";
    }

    @Override
    public void execute(CreateOrderSagaContext context) throws Exception {
        log.info("Ejecutando CreateOrderStep - User: {}, Items: {}",
                context.getUserId(), context.getItems().size());

        // Simular creación de pedido
        // En producción: llamada HTTP al Order Service o publicar OrderCreateCommand
        UUID orderId = UUID.randomUUID();
        context.setOrderId(orderId);

        log.info("Pedido creado con ID: {}", orderId);
    }

    @Override
    public void compensate(CreateOrderSagaContext context) {
        log.warn("Compensando CreateOrderStep - Cancelando pedido: {}", context.getOrderId());

        // Simular cancelación de pedido
        // En producción: llamada HTTP DELETE /orders/{id} o publicar OrderCancelCommand

        log.info("Pedido {} marcado como CANCELLED", context.getOrderId());
    }
}
