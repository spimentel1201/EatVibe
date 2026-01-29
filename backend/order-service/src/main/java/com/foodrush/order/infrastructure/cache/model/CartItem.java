package com.foodrush.order.infrastructure.cache.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.UUID;

/**
 * Representa un item individual en el carrito de compras.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItem implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * ID del item del menú
     */
    private UUID menuItemId;

    /**
     * Nombre del producto
     */
    private String productName;

    /**
     * Precio unitario
     */
    private BigDecimal price;

    /**
     * Cantidad
     */
    private Integer quantity;

    /**
     * Instrucciones especiales (ej. "Sin cebolla")
     */
    private String specialInstructions;

    /**
     * Calcula el subtotal de este item.
     */
    public BigDecimal calculateSubtotal() {
        return price.multiply(BigDecimal.valueOf(quantity));
    }
}
