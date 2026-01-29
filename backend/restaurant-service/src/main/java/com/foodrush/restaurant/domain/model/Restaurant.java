package com.foodrush.restaurant.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Entidad de dominio que representa un restaurante en el sistema.
 * 
 * <p>
 * Esta entidad sigue el patrón de Arquitectura Hexagonal, siendo parte del
 * núcleo
 * de dominio sin dependencias externas más allá de JPA.
 * 
 * <p>
 * Responsabilidades:
 * <ul>
 * <li>Mantener información básica del restaurante</li>
 * <li>Gestionar el estado operativo (OPEN, CLOSED, BUSY)</li>
 * <li>Mantener relación con categorías de menú</li>
 * </ul>
 * 
 * @author FoodRush Team
 * @version 1.0.0
 * @since 2026-01-29
 */
@Entity
@Table(name = "restaurants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restaurant {

    /**
     * Identificador único del restaurante.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * ID del usuario propietario del restaurante.
     * Referencia lógica al User Service (sin FK física por arquitectura de
     * microservicios).
     */
    @Column(name = "owner_user_id", nullable = false)
    private UUID ownerUserId;

    /**
     * Nombre del restaurante.
     */
    @Column(nullable = false, length = 100)
    private String name;

    /**
     * Descripción del restaurante.
     */
    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * Estado operativo actual del restaurante.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private RestaurantStatus status = RestaurantStatus.CLOSED;

    /**
     * Calificación promedio del restaurante (0.0 - 5.0).
     */
    @Column(precision = 2, scale = 1)
    @Builder.Default
    private BigDecimal rating = BigDecimal.valueOf(5.0);

    /**
     * URL de la imagen del restaurante.
     */
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    /**
     * Fecha y hora de creación del registro.
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    /**
     * Categorías de menú asociadas al restaurante.
     * Relación uno a muchos con cascade para facilitar operaciones.
     */
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Category> categories = new ArrayList<>();

    // ========================================
    // Métodos de Dominio (Business Logic)
    // ========================================

    /**
     * Cambia el estado del restaurante a OPEN.
     */
    public void open() {
        this.status = RestaurantStatus.OPEN;
    }

    /**
     * Cambia el estado del restaurante a CLOSED.
     */
    public void close() {
        this.status = RestaurantStatus.CLOSED;
    }

    /**
     * Cambia el estado del restaurante a BUSY.
     */
    public void markAsBusy() {
        this.status = RestaurantStatus.BUSY;
    }

    /**
     * Verifica si el restaurante está abierto (OPEN o BUSY).
     * 
     * @return true si el restaurante puede aceptar pedidos
     */
    public boolean isOpen() {
        return this.status == RestaurantStatus.OPEN || this.status == RestaurantStatus.BUSY;
    }

    /**
     * Agrega una categoría al restaurante.
     * Mantiene la bidireccionalidad de la relación.
     * 
     * @param category la categoría a agregar
     */
    public void addCategory(Category category) {
        categories.add(category);
        category.setRestaurant(this);
    }

    /**
     * Remueve una categoría del restaurante.
     * 
     * @param category la categoría a remover
     */
    public void removeCategory(Category category) {
        categories.remove(category);
        category.setRestaurant(null);
    }

    /**
     * Actualiza la calificación del restaurante.
     * 
     * @param newRating nueva calificación (debe estar entre 0.0 y 5.0)
     * @throws IllegalArgumentException si la calificación está fuera del rango
     */
    public void updateRating(BigDecimal newRating) {
        if (newRating.compareTo(BigDecimal.ZERO) < 0 || newRating.compareTo(BigDecimal.valueOf(5.0)) > 0) {
            throw new IllegalArgumentException("La calificación debe estar entre 0.0 y 5.0");
        }
        this.rating = newRating;
    }
}
