package com.foodrush.payment.domain.saga;

import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Contexto compartido para el SAGA de creación de pedido.
 * 
 * <p>
 * Contiene toda la información necesaria para ejecutar y compensar
 * los pasos del SAGA.
 * </p>
 */
@Data
public class CreateOrderSagaContext {

    // Datos de entrada
    private UUID userId;
    private UUID restaurantId;
    private List<OrderItem> items;
    private BigDecimal totalAmount;
    private String paymentMethodToken;
    private String paymentProvider;

    // Datos generados durante el SAGA
    private UUID orderId;
    private UUID transactionId;
    private String externalTransactionId;
    private List<UUID> reservedStockIds = new ArrayList<>();

    // Control del SAGA
    private boolean orderCreated = false;
    private boolean stockReserved = false;
    private boolean paymentProcessed = false;
    private boolean customerNotified = false;

    // Manejo de errores
    private String errorMessage;
    private String errorStep;

    /**
     * Item del pedido (simplificado para el SAGA).
     */
    @Data
    public static class OrderItem {
        private UUID productId;
        private String productName;
        private Integer quantity;
        private BigDecimal price;
    }

    /**
     * Marca un paso como completado.
     */
    public void markStepCompleted(String stepName) {
        switch (stepName) {
            case "CreateOrder" -> orderCreated = true;
            case "ReserveStock" -> stockReserved = true;
            case "ProcessPayment" -> paymentProcessed = true;
            case "NotifyCustomer" -> customerNotified = true;
        }
    }

    /**
     * Registra un error en el SAGA.
     */
    public void registerError(String step, String message) {
        this.errorStep = step;
        this.errorMessage = message;
    }

    /**
     * Verifica si el SAGA está completo.
     */
    public boolean isComplete() {
        return orderCreated && stockReserved && paymentProcessed && customerNotified;
    }

    /**
     * Verifica si hubo un error.
     */
    public boolean hasError() {
        return errorMessage != null;
    }
}
