package com.foodrush.order.infrastructure.cache.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Modelo del carrito de compras almacenado en Redis.
 * 
 * <p>
 * Este modelo representa el estado temporal del carrito de un cliente
 * antes de confirmar el pedido. Se almacena en Redis con un TTL de 24 horas.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cart implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * ID del cliente dueño del carrito
     */
    private UUID customerId;

    /**
     * ID del restaurante (un carrito solo puede tener items de un restaurante)
     */
    private UUID restaurantId;

    /**
     * Items en el carrito
     */
    @Builder.Default
    private List<CartItem> items = new ArrayList<>();

    /**
     * Subtotal del carrito
     */
    private BigDecimal subtotal;

    /**
     * Timestamp de creación del carrito
     */
    @Builder.Default
    private Instant createdAt = Instant.now();

    /**
     * Timestamp de última actualización
     */
    @Builder.Default
    private Instant updatedAt = Instant.now();

    /**
     * Agrega un item al carrito o actualiza la cantidad si ya existe.
     */
    public void addItem(CartItem item) {
        // Buscar si el item ya existe
        CartItem existingItem = items.stream()
                .filter(i -> i.getMenuItemId().equals(item.getMenuItemId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            // Actualizar cantidad
            existingItem.setQuantity(existingItem.getQuantity() + item.getQuantity());
        } else {
            // Agregar nuevo item
            items.add(item);
        }

        this.updatedAt = Instant.now();
        calculateSubtotal();
    }

    /**
     * Remueve un item del carrito.
     */
    public void removeItem(UUID menuItemId) {
        items.removeIf(item -> item.getMenuItemId().equals(menuItemId));
        this.updatedAt = Instant.now();
        calculateSubtotal();
    }

    /**
     * Calcula el subtotal sumando todos los items.
     */
    public void calculateSubtotal() {
        this.subtotal = items.stream()
                .map(CartItem::calculateSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Verifica si el carrito está vacío.
     */
    public boolean isEmpty() {
        return items == null || items.isEmpty();
    }

    /**
     * Limpia todos los items del carrito.
     */
    public void clear() {
        items.clear();
        this.subtotal = BigDecimal.ZERO;
        this.updatedAt = Instant.now();
    }
}
