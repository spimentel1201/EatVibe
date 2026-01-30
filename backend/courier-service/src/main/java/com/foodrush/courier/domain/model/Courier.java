package com.foodrush.courier.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entidad Courier - Repartidor
 * 
 * Representa un repartidor en el sistema con su perfil,
 * estado actual, y estadísticas de desempeño.
 */
@Entity
@Table(name = "couriers")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Courier {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true, length = 20)
    private String phone;

    @Column(nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false, length = 50)
    private VehicleType vehicleType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private CourierStatus status = CourierStatus.OFFLINE;

    @Column(nullable = false)
    @Builder.Default
    private Double rating = 5.0;

    @Column(name = "total_deliveries", nullable = false)
    @Builder.Default
    private Integer totalDeliveries = 0;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // ============================================
    // Business Methods
    // ============================================

    /**
     * Marca al courier como disponible para recibir entregas
     */
    public void goOnline() {
        if (this.status == CourierStatus.OFFLINE) {
            this.status = CourierStatus.AVAILABLE;
        }
    }

    /**
     * Marca al courier como desconectado
     */
    public void goOffline() {
        if (this.status == CourierStatus.AVAILABLE) {
            this.status = CourierStatus.OFFLINE;
        }
    }

    /**
     * Marca al courier como ocupado (delivery asignada)
     */
    public void markBusy() {
        if (this.status == CourierStatus.AVAILABLE) {
            this.status = CourierStatus.BUSY;
        }
    }

    /**
     * Marca al courier como en entrega activa
     */
    public void startDelivery() {
        if (this.status == CourierStatus.BUSY) {
            this.status = CourierStatus.ON_DELIVERY;
        }
    }

    /**
     * Completa una entrega y actualiza estadísticas
     * 
     * @param newRating Rating recibido por esta entrega (1-5)
     */
    public void completeDelivery(Double newRating) {
        if (this.status == CourierStatus.ON_DELIVERY) {
            // Actualizar rating promedio
            if (newRating != null && newRating >= 1.0 && newRating <= 5.0) {
                this.rating = ((this.rating * this.totalDeliveries) + newRating) / (this.totalDeliveries + 1);
            }

            // Incrementar contador de entregas
            this.totalDeliveries++;

            // Volver a estado disponible
            this.status = CourierStatus.AVAILABLE;
        }
    }

    /**
     * Verifica si el courier puede recibir nuevas asignaciones
     */
    public boolean canReceiveDeliveries() {
        return this.status.canReceiveDeliveries();
    }

    /**
     * Verifica si el courier está activo
     */
    public boolean isActive() {
        return this.status.isActive();
    }

    /**
     * Calcula el ETA para una distancia dada basado en el tipo de vehículo
     */
    public double calculateETA(double distanceKm) {
        return this.vehicleType.calculateETA(distanceKm);
    }

    /**
     * Verifica si el vehículo puede manejar la distancia
     */
    public boolean canHandleDistance(double distanceKm) {
        return this.vehicleType.canHandleDistance(distanceKm);
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
