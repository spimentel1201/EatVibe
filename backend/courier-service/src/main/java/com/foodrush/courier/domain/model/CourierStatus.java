package com.foodrush.courier.domain.model;

/**
 * Status del repartidor
 * 
 * Estados posibles:
 * - OFFLINE: Desconectado, no recibe pedidos
 * - AVAILABLE: Conectado y disponible para recibir pedidos
 * - BUSY: Tiene un pedido asignado pero aún no lo ha aceptado
 * - ON_DELIVERY: Actualmente realizando una entrega
 */
public enum CourierStatus {
    /**
     * Courier está desconectado y no recibirá asignaciones
     */
    OFFLINE,

    /**
     * Courier está conectado y disponible para nuevas entregas
     */
    AVAILABLE,

    /**
     * Courier tiene una entrega asignada pendiente de aceptación
     */
    BUSY,

    /**
     * Courier está activamente realizando una entrega
     */
    ON_DELIVERY;

    /**
     * Verifica si el courier puede recibir nuevas asignaciones
     */
    public boolean canReceiveDeliveries() {
        return this == AVAILABLE;
    }

    /**
     * Verifica si el courier está activo (no offline)
     */
    public boolean isActive() {
        return this != OFFLINE;
    }
}
