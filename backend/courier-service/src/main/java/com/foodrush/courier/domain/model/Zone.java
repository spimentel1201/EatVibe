package com.foodrush.courier.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Polygon;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entidad Zone - Zona de Cobertura
 * 
 * Representa una zona operativa con límites geográficos definidos
 * usando PostGIS Polygon para validar cobertura.
 */
@Entity
@Table(name = "zones", indexes = {
        @Index(name = "idx_zone_active", columnList = "is_active")
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Zone {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * PostGIS Polygon geometry (SRID 4326)
     * Define los límites de la zona de cobertura
     */
    @Column(columnDefinition = "geometry(Polygon,4326)", nullable = false)
    private Polygon boundary;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

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
     * Activa la zona
     */
    public void activate() {
        this.isActive = true;
    }

    /**
     * Desactiva la zona
     */
    public void deactivate() {
        this.isActive = false;
    }

    /**
     * Obtiene el área de la zona en km²
     */
    public Double getAreaKm2() {
        if (boundary != null) {
            // Área en grados cuadrados, convertir a km²
            // Aproximación: 1 grado² ≈ 12,100 km² en el ecuador
            return boundary.getArea() * 12100;
        }
        return 0.0;
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
