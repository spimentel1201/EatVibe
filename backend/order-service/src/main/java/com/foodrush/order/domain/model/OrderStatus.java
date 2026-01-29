package com.foodrush.order.domain.model;

/**
 * Estados posibles de un pedido en el sistema FoodRush.
 * 
 * <p>
 * Esta enumeración define todos los estados por los que puede pasar un pedido
 * desde su creación hasta su finalización o cancelación. Las transiciones entre
 * estados están controladas por {@link OrderStateMachine}.
 * 
 * <p>
 * Flujo principal:
 * CREATED → PAYMENT_PENDING → PAYMENT_CONFIRMED → ACCEPTED_BY_RESTAURANT →
 * PREPARING → READY_FOR_PICKUP → COURIER_ASSIGNED → PICKED_UP →
 * IN_TRANSIT → DELIVERED → COMPLETED
 * 
 * @see OrderStateMachine
 */
public enum OrderStatus {

    /** Pedido creado, esperando inicio de pago */
    CREATED,

    /** Pago en proceso */
    PAYMENT_PENDING,

    /** Pago confirmado exitosamente */
    PAYMENT_CONFIRMED,

    /** Pago falló */
    PAYMENT_FAILED,

    /** Restaurante aceptó el pedido */
    ACCEPTED_BY_RESTAURANT,

    /** Restaurante rechazó el pedido */
    REJECTED_BY_RESTAURANT,

    /** Restaurante está preparando el pedido */
    PREPARING,

    /** Pedido listo para ser recogido */
    READY_FOR_PICKUP,

    /** Repartidor asignado al pedido */
    COURIER_ASSIGNED,

    /** Repartidor recogió el pedido */
    PICKED_UP,

    /** Pedido en camino al cliente */
    IN_TRANSIT,

    /** Pedido entregado al cliente */
    DELIVERED,

    /** Pedido completado (estado final) */
    COMPLETED,

    /** Pedido cancelado */
    CANCELLED,

    /** Pedido reembolsado */
    REFUNDED
}
