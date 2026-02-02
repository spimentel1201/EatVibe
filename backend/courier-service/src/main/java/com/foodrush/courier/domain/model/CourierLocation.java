package com.foodrush.courier.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entidad CourierLocation - Ubicación del Repartidor
 * 
 * Almacena el historial de ubicaciones GPS del courier
 * usando PostGIS Point geometry para queries espaciales eficientes.
 */
@Entity
@Table(name = "courier_locations", indexes = {
        @Index(name = "idx_courier_location_courier", columnList = "courier_id"),
        @Index(name = "idx_courier_location_timestamp", columnList = "timestamp"),
        @Index(name = "idx_courier_location_courier_timestamp", columnList = "courier_id, timestamp")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourierLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "courier_id", nullable = false)
    private Courier courier;

    /**
     * PostGIS Point geometry (SRID 4326 - WGS84)
     * Usado para queries espaciales eficientes
     */
    @Column(columnDefinition = "geometry(Point,4326)", nullable = false)
    private Point location;

    /**
     * Latitud en formato decimal (-90 a 90)
     * Almacenado separadamente para fácil acceso
     */
    @Column(nullable = false)
    private Double latitude;

    /**
     * Longitud en formato decimal (-180 a 180)
     * Almacenado separadamente para fácil acceso
     */
    @Column(nullable = false)
    private Double longitude;

    /**
     * Timestamp de la ubicación
     */
    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    /**
     * Precisión del GPS en metros
     */
    @Column
    private Double accuracy;

    /**
     * Velocidad en km/h
     */
    @Column
    private Double speed;

    // ============================================
    // Business Methods
    // ============================================

    /**
     * Verifica si la ubicación es reciente (últimos 5 minutos)
     */
    public boolean isRecent() {
        return timestamp.isAfter(LocalDateTime.now().minusMinutes(5));
    }

    /**
     * Verifica si la precisión del GPS es aceptable (< 50 metros)
     */
    public boolean hasGoodAccuracy() {
        return accuracy != null && accuracy < 50.0;
    }

    /**
     * Obtiene las coordenadas como string
     */
    public String getCoordinatesString() {
        return String.format("%.6f, %.6f", latitude, longitude);
    }

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
        // Sincronizar lat/lon con Point geometry
        if (location != null) {
            this.latitude = location.getY();
            this.longitude = location.getX();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        // Sincronizar lat/lon con Point geometry
        if (location != null) {
            this.latitude = location.getY();
            this.longitude = location.getX();
        }
    }
}
