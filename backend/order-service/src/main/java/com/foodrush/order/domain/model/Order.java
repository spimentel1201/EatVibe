package com.foodrush.order.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Entidad de dominio que representa un pedido en el sistema.
 * 
 * <p>
 * Esta entidad es el núcleo del Order Service y contiene toda la información
 * relacionada con un pedido, incluyendo su estado, items, montos y referencias
 * a otros servicios (Customer, Restaurant, Courier).
 */
@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "customer_id", nullable = false)
    private UUID customerId;

    @Column(name = "restaurant_id", nullable = false)
    private UUID restaurantId;

    @Column(name = "courier_id")
    private UUID courierId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private OrderStatus status = OrderStatus.CREATED;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "delivery_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal deliveryFee;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "estimated_delivery_time")
    private Instant estimatedDeliveryTime;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    /**
     * Calcula el monto total del pedido sumando subtotal y tarifa de entrega.
     */
    public void calculateTotal() {
        this.totalAmount = this.subtotal.add(this.deliveryFee);
    }

    /**
     * Calcula el subtotal sumando todos los items del pedido.
     */
    public void calculateSubtotal() {
        this.subtotal = items.stream()
                .map(OrderItem::calculateSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Agrega un item al pedido.
     * 
     * @param item el item a agregar
     */
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    /**
     * Remueve un item del pedido.
     * 
     * @param item el item a remover
     */
    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }

    /**
     * Verifica si el pedido puede transicionar al estado dado.
     * 
     * @param newStatus el nuevo estado
     * @return true si la transición es válida
     */
    public boolean canTransitionTo(OrderStatus newStatus) {
        // La validación real se hace en OrderStateMachine
        return newStatus != null;
    }

    /**
     * Asigna un repartidor al pedido.
     * 
     * @param courierId ID del repartidor
     */
    public void assignCourier(UUID courierId) {
        this.courierId = courierId;
        this.updatedAt = Instant.now();
    }

    /**
     * Marca el pedido como actualizado.
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
