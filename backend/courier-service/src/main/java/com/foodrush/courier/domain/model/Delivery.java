package com.foodrush.courier.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entidad Delivery - Entrega
 * 
 * Representa una entrega asignada a un courier con ubicaciones
 * de pickup (restaurante) y delivery (cliente) usando PostGIS.
 */
@Entity
@Table(name = "deliveries", indexes = {
        @Index(name = "idx_delivery_order", columnList = "order_id"),
        @Index(name = "idx_delivery_courier", columnList = "courier_id"),
        @Index(name = "idx_delivery_status", columnList = "status"),
        @Index(name = "idx_delivery_created", columnList = "created_at")
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "order_id", nullable = false)
    private UUID orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "courier_id")
    private Courier courier;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private DeliveryStatus status = DeliveryStatus.PENDING;

    /**
     * Ubicación del restaurante (pickup)
     * PostGIS Point geometry (SRID 4326)
     */
    @Column(name = "pickup_location", columnDefinition = "geometry(Point,4326)")
    private Point pickupLocation;

    /**
     * Ubicación del cliente (delivery)
     * PostGIS Point geometry (SRID 4326)
     */
    @Column(name = "delivery_location", columnDefinition = "geometry(Point,4326)")
    private Point deliveryLocation;

    /**
     * PIN de 6 dígitos para verificación de entrega
     */
    @Column(name = "delivery_pin", length = 6)
    private String deliveryPin;

    /**
     * Ganancia del courier por esta entrega
     */
    @Column(precision = 10, scale = 2)
    private BigDecimal earnings;

    /**
     * Distancia total en kilómetros
     */
    @Column(precision = 10, scale = 2)
    private BigDecimal distance;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Column(name = "picked_up_at")
    private LocalDateTime pickedUpAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // ============================================
    // Business Methods - State Machine
    // ============================================

    /**
     * Asigna la entrega a un courier
     */
    public void assign(Courier courier) {
        if (this.status == DeliveryStatus.PENDING) {
            this.courier = courier;
            this.status = DeliveryStatus.ASSIGNED;
            this.assignedAt = LocalDateTime.now();
            courier.markBusy();
        }
    }

    /**
     * Marca como recogida del restaurante
     */
    public void markAsPickedUp() {
        if (this.status == DeliveryStatus.ASSIGNED) {
            this.status = DeliveryStatus.PICKED_UP;
            this.pickedUpAt = LocalDateTime.now();
            if (this.courier != null) {
                this.courier.startDelivery();
            }
        }
    }

    /**
     * Marca como en tránsito hacia el cliente
     */
    public void markInTransit() {
        if (this.status == DeliveryStatus.PICKED_UP) {
            this.status = DeliveryStatus.IN_TRANSIT;
        }
    }

    /**
     * Marca como entregada con validación de PIN
     * 
     * @param pin PIN proporcionado por el cliente
     * @return true si el PIN es correcto y la entrega se marcó como completada
     */
    public boolean markAsDelivered(String pin) {
        if (this.status == DeliveryStatus.IN_TRANSIT && validatePin(pin)) {
            this.status = DeliveryStatus.DELIVERED;
            this.deliveredAt = LocalDateTime.now();
            return true;
        }
        return false;
    }

    /**
     * Cancela la entrega
     */
    public void cancel() {
        if (this.status.isCancellable()) {
            this.status = DeliveryStatus.CANCELLED;
            this.cancelledAt = LocalDateTime.now();

            // Liberar al courier
            if (this.courier != null && this.courier.getStatus() != CourierStatus.OFFLINE) {
                this.courier.setStatus(CourierStatus.AVAILABLE);
            }
        }
    }

    /**
     * Valida el PIN de entrega
     */
    private boolean validatePin(String pin) {
        return this.deliveryPin != null && this.deliveryPin.equals(pin);
    }

    /**
     * Calcula el tiempo total de entrega en minutos
     */
    public Long getTotalDeliveryTimeMinutes() {
        if (assignedAt != null && deliveredAt != null) {
            return java.time.Duration.between(assignedAt, deliveredAt).toMinutes();
        }
        return null;
    }

    /**
     * Verifica si la entrega está en progreso
     */
    public boolean isInProgress() {
        return status.isInProgress();
    }

    /**
     * Verifica si la entrega está completada
     */
    public boolean isCompleted() {
        return status.isCompleted();
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
