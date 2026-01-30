package com.foodrush.courier.domain.model;

/**
 * Status de la entrega
 * 
 * Flujo normal:
 * PENDING → ASSIGNED → PICKED_UP → IN_TRANSIT → DELIVERED
 * 
 * Puede ser CANCELLED en cualquier momento antes de DELIVERED
 */
public enum DeliveryStatus {
    /**
     * Entrega creada, esperando asignación de courier
     */
    PENDING,

    /**
     * Courier asignado, esperando aceptación
     */
    ASSIGNED,

    /**
     * Courier aceptó y recogió el pedido del restaurante
     */
    PICKED_UP,

    /**
     * Courier en camino hacia el cliente
     */
    IN_TRANSIT,

    /**
     * Entrega completada exitosamente
     */
    DELIVERED,

    /**
     * Entrega cancelada
     */
    CANCELLED;

    /**
     * Verifica si la entrega está en progreso
     */
    public boolean isInProgress() {
        return this == ASSIGNED || this == PICKED_UP || this == IN_TRANSIT;
    }

    /**
     * Verifica si la entrega está completada (exitosa o cancelada)
     */
    public boolean isCompleted() {
        return this == DELIVERED || this == CANCELLED;
    }

    /**
     * Verifica si se puede cancelar
     */
    public boolean isCancellable() {
        return !isCompleted();
    }

    /**
     * Obtiene el siguiente estado válido
     */
    public DeliveryStatus nextStatus() {
        return switch (this) {
            case PENDING -> ASSIGNED;
            case ASSIGNED -> PICKED_UP;
            case PICKED_UP -> IN_TRANSIT;
            case IN_TRANSIT -> DELIVERED;
            default -> this;
        };
    }
}
