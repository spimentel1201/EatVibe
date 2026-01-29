package com.foodrush.restaurant.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Entidad de dominio que representa un item del menú de un restaurante.
 * 
 * <p>
 * Cada item pertenece a una categoría y contiene información sobre
 * precio, disponibilidad y descripción.
 * 
 * @author FoodRush Team
 * @version 1.0.0
 * @since 2026-01-29
 */
@Entity
@Table(name = "menu_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItem {

    /**
     * Identificador único del item.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * Categoría a la que pertenece este item.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    /**
     * Nombre del item del menú.
     */
    @Column(nullable = false, length = 100)
    private String name;

    /**
     * Descripción detallada del item.
     */
    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * Precio del item.
     */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    /**
     * Indica si el item está disponible para pedidos.
     * Permite al restaurante marcar items como "agotados" sin eliminarlos.
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean available = true;

    /**
     * URL de la imagen del item.
     */
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    // ========================================
    // Métodos de Dominio (Business Logic)
    // ========================================

    /**
     * Marca el item como no disponible (agotado).
     * Útil para control de stock en tiempo real.
     */
    public void markAsUnavailable() {
        this.available = false;
    }

    /**
     * Marca el item como disponible nuevamente.
     */
    public void markAsAvailable() {
        this.available = true;
    }

    /**
     * Verifica si el item está disponible para pedidos.
     * 
     * @return true si el item está disponible
     */
    public boolean isAvailable() {
        return this.available != null && this.available;
    }

    /**
     * Actualiza el precio del item.
     * 
     * @param newPrice nuevo precio (debe ser mayor a cero)
     * @throws IllegalArgumentException si el precio es menor o igual a cero
     */
    public void updatePrice(BigDecimal newPrice) {
        if (newPrice.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a cero");
        }
        this.price = newPrice;
    }

    /**
     * Verifica si el item tiene una imagen asociada.
     * 
     * @return true si imageUrl no es null ni vacío
     */
    public boolean hasImage() {
        return this.imageUrl != null && !this.imageUrl.isBlank();
    }
}
