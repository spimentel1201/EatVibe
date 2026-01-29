package com.foodrush.order.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Entidad que representa un item individual dentro de un pedido.
 * 
 * <p>
 * Cada OrderItem almacena un snapshot del producto al momento de la compra,
 * incluyendo nombre y precio, para mantener consistencia histórica incluso
 * si el menú del restaurante cambia posteriormente.
 */
@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "menu_item_id", nullable = false)
    private UUID menuItemId;

    @Column(name = "product_snapshot_name", nullable = false, length = 100)
    private String productSnapshotName;

    @Column(name = "unit_snapshot_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitSnapshotPrice;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;

    /**
     * Calcula el subtotal de este item (precio unitario × cantidad).
     * 
     * @return el subtotal del item
     */
    public BigDecimal calculateSubtotal() {
        return unitSnapshotPrice.multiply(BigDecimal.valueOf(quantity));
    }

    /**
     * Actualiza la cantidad del item.
     * 
     * @param newQuantity la nueva cantidad
     * @throws IllegalArgumentException si la cantidad es menor o igual a cero
     */
    public void updateQuantity(Integer newQuantity) {
        if (newQuantity <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor a cero");
        }
        this.quantity = newQuantity;
    }
}
