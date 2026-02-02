package com.foodrush.courier.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entidad CourierShift - Turno de Trabajo
 * 
 * Representa una sesión de trabajo del courier (clock in/out)
 * con seguimiento de ganancias y entregas realizadas.
 */
@Entity
@Table(name = "courier_shifts", indexes = {
        @Index(name = "idx_shift_courier", columnList = "courier_id"),
        @Index(name = "idx_shift_clock_in", columnList = "clock_in_at")
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourierShift {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "courier_id", nullable = false)
    private Courier courier;

    @Column(name = "clock_in_at", nullable = false)
    @Builder.Default
    private LocalDateTime clockInAt = LocalDateTime.now();

    @Column(name = "clock_out_at")
    private LocalDateTime clockOutAt;

    @Column(name = "total_earnings", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalEarnings = BigDecimal.ZERO;

    @Column(name = "total_deliveries")
    @Builder.Default
    private Integer totalDeliveries = 0;

    @Column(name = "total_distance_km")
    @Builder.Default
    private Double totalDistanceKm = 0.0;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // ============================================
    // Business Methods
    // ============================================

    /**
     * Finaliza el turno (clock out)
     */
    public void clockOut() {
        if (this.clockOutAt == null) {
            this.clockOutAt = LocalDateTime.now();
        }
    }

    /**
     * Incrementa conteo de entregas
     */
    public void incrementDeliveries() {
        this.totalDeliveries++;
    }

    /**
     * Agrega distancia recorrida
     */
    public void addDistance(Double km) {
        if (km != null && km > 0) {
            this.totalDistanceKm += km;
        }
    }

    /**
     * Agrega ganancias de una entrega
     */
    public void addEarnings(BigDecimal earnings) {
        if (earnings != null && earnings.compareTo(BigDecimal.ZERO) > 0) {
            this.totalEarnings = this.totalEarnings.add(earnings);
        }
    }

    /**
     * Verifica si el turno está activo
     */
    public boolean isActive() {
        return this.clockOutAt == null;
    }

    /**
     * Calcula la duración del turno en horas
     */
    public Double getDurationHours() {
        LocalDateTime endTime = clockOutAt != null ? clockOutAt : LocalDateTime.now();
        Duration duration = Duration.between(clockInAt, endTime);
        return duration.toMinutes() / 60.0;
    }

    /**
     * Calcula las ganancias por hora
     */
    public BigDecimal getEarningsPerHour() {
        Double hours = getDurationHours();
        if (hours > 0) {
            return totalEarnings.divide(BigDecimal.valueOf(hours), 2, java.math.RoundingMode.HALF_UP);
        }
        return BigDecimal.ZERO;
    }

    /**
     * Calcula el promedio de entregas por hora
     */
    public Double getDeliveriesPerHour() {
        Double hours = getDurationHours();
        if (hours > 0) {
            return totalDeliveries / hours;
        }
        return 0.0;
    }
}
