package com.foodrush.payment.infrastructure.saga.steps;

import com.foodrush.payment.domain.saga.CreateOrderSagaContext;
import com.foodrush.payment.domain.saga.SagaStep;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Paso 2 del SAGA: Reservar inventario.
 * 
 * <p>
 * En un sistema real, este paso llamaría al Restaurant Service
 * para reservar el stock de los productos del pedido.
 * </p>
 */
@Component
@Order(2)
@Slf4j
public class ReserveStockStep implements SagaStep<CreateOrderSagaContext> {

    @Override
    public String getName() {
        return "ReserveStock";
    }

    @Override
    public void execute(CreateOrderSagaContext context) throws Exception {
        log.info("Ejecutando ReserveStockStep - Order: {}, Items: {}",
                context.getOrderId(), context.getItems().size());

        // Simular reserva de stock
        // En producción: llamada HTTP POST /restaurants/{id}/reserve-stock
        for (var item : context.getItems()) {
            UUID reservationId = UUID.randomUUID();
            context.getReservedStockIds().add(reservationId);

            log.debug("Stock reservado - Product: {}, Quantity: {}, Reservation: {}",
                    item.getProductId(), item.getQuantity(), reservationId);
        }

        log.info("Stock reservado exitosamente - {} items", context.getItems().size());
    }

    @Override
    public void compensate(CreateOrderSagaContext context) {
        log.warn("Compensando ReserveStockStep - Liberando stock reservado");

        // Simular liberación de stock
        // En producción: llamada HTTP DELETE /stock-reservations/{id}
        for (UUID reservationId : context.getReservedStockIds()) {
            log.debug("Liberando reserva de stock: {}", reservationId);
        }

        context.getReservedStockIds().clear();
        log.info("Stock liberado - {} reservas canceladas", context.getReservedStockIds().size());
    }
}
