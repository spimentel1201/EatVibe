package com.foodrush.payment.infrastructure.saga;

import com.foodrush.payment.domain.saga.CreateOrderSagaContext;
import com.foodrush.payment.domain.saga.SagaStep;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Orquestador del SAGA para creación de pedidos.
 * 
 * <p>
 * Coordina la ejecución de múltiples pasos transaccionales
 * con compensación automática en caso de error.
 * </p>
 * 
 * <p>
 * Flujo:
 * 1. CreateOrderStep - Crea el pedido
 * 2. ReserveStockStep - Reserva inventario
 * 3. ProcessPaymentStep - Procesa el pago
 * 4. NotifyCustomerStep - Notifica al cliente
 * 
 * Si algún paso falla, se ejecutan las compensaciones en orden inverso.
 * </p>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CreateOrderSagaOrchestrator {

    private final List<SagaStep<CreateOrderSagaContext>> steps;

    /**
     * Log de inicialización después de la construcción.
     */
    @PostConstruct
    public void init() {
        log.info("CreateOrderSagaOrchestrator inicializado con {} pasos: {}",
                steps.size(),
                steps.stream().map(SagaStep::getName).toList());
    }

    /**
     * Ejecuta el SAGA completo.
     * 
     * @param context Contexto del SAGA
     * @return true si el SAGA se completó exitosamente
     */
    public boolean execute(CreateOrderSagaContext context) {
        log.info("Iniciando SAGA CreateOrder - User: {}, Amount: {}",
                context.getUserId(), context.getTotalAmount());

        List<SagaStep<CreateOrderSagaContext>> executedSteps = new ArrayList<>();

        try {
            // Ejecutar pasos en orden
            for (SagaStep<CreateOrderSagaContext> step : steps) {
                log.info("SAGA Execute: {}", step.getName());

                try {
                    step.execute(context);
                    executedSteps.add(step);
                    context.markStepCompleted(step.getName());

                    log.info("SAGA Step completado: {}", step.getName());
                } catch (Exception e) {
                    log.error("SAGA Step falló: {} - Error: {}", step.getName(), e.getMessage(), e);
                    context.registerError(step.getName(), e.getMessage());

                    // Compensar pasos ejecutados en orden inverso
                    compensate(executedSteps, context);

                    return false;
                }
            }

            log.info("SAGA CreateOrder completado exitosamente - Order: {}", context.getOrderId());
            return true;

        } catch (Exception e) {
            log.error("Error inesperado en SAGA: {}", e.getMessage(), e);
            context.registerError("SAGA", e.getMessage());
            compensate(executedSteps, context);
            return false;
        }
    }

    /**
     * Compensa los pasos ejecutados en orden inverso.
     */
    private void compensate(List<SagaStep<CreateOrderSagaContext>> executedSteps, CreateOrderSagaContext context) {
        log.warn("Iniciando compensación de SAGA - Pasos ejecutados: {}", executedSteps.size());

        // Compensar en orden inverso
        for (int i = executedSteps.size() - 1; i >= 0; i--) {
            SagaStep<CreateOrderSagaContext> step = executedSteps.get(i);

            try {
                log.info("SAGA Compensate: {}", step.getName());
                step.compensate(context);
                log.info("SAGA Compensación completada: {}", step.getName());
            } catch (Exception e) {
                log.error("Error en compensación de {}: {}", step.getName(), e.getMessage(), e);
                // Continuar con las demás compensaciones
            }
        }

        log.warn("Compensación de SAGA completada");
    }
}
