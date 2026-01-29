package com.foodrush.restaurant.domain.model;

/**
 * Enum que representa los posibles estados de un restaurante.
 * 
 * <p>
 * Estados disponibles:
 * <ul>
 * <li>{@code OPEN} - Restaurante abierto y aceptando pedidos</li>
 * <li>{@code CLOSED} - Restaurante cerrado</li>
 * <li>{@code BUSY} - Restaurante abierto pero con alta demanda (tiempos de
 * espera mayores)</li>
 * </ul>
 * 
 * @author FoodRush Team
 * @version 1.0.0
 * @since 2026-01-29
 */
public enum RestaurantStatus {

    /**
     * Restaurante abierto y aceptando pedidos normalmente.
     */
    OPEN,

    /**
     * Restaurante cerrado, no acepta pedidos.
     */
    CLOSED,

    /**
     * Restaurante abierto pero con alta demanda.
     * Los tiempos de preparación pueden ser mayores.
     */
    BUSY
}
