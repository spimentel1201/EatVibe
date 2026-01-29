package com.foodrush.restaurant.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Entidad de dominio que representa una categoría de menú dentro de un
 * restaurante.
 * 
 * <p>
 * Las categorías permiten organizar los items del menú en grupos lógicos
 * (ej. "Entradas", "Platos Principales", "Postres", "Bebidas").
 * 
 * @author FoodRush Team
 * @version 1.0.0
 * @since 2026-01-29
 */
@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    /**
     * Identificador único de la categoría.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * Restaurante al que pertenece esta categoría.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    /**
     * Nombre de la categoría.
     */
    @Column(nullable = false, length = 50)
    private String name;

    /**
     * Orden de visualización de la categoría.
     * Permite ordenar las categorías en la UI.
     */
    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;

    /**
     * Items del menú asociados a esta categoría.
     * Relación uno a muchos con cascade para facilitar operaciones.
     */
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MenuItem> menuItems = new ArrayList<>();

    // ========================================
    // Métodos de Dominio (Business Logic)
    // ========================================

    /**
     * Agrega un item al menú de esta categoría.
     * Mantiene la bidireccionalidad de la relación.
     * 
     * @param menuItem el item a agregar
     */
    public void addMenuItem(MenuItem menuItem) {
        menuItems.add(menuItem);
        menuItem.setCategory(this);
    }

    /**
     * Remueve un item del menú de esta categoría.
     * 
     * @param menuItem el item a remover
     */
    public void removeMenuItem(MenuItem menuItem) {
        menuItems.remove(menuItem);
        menuItem.setCategory(null);
    }

    /**
     * Cuenta la cantidad de items disponibles en esta categoría.
     * 
     * @return número de items con available = true
     */
    public long countAvailableItems() {
        return menuItems.stream()
                .filter(MenuItem::isAvailable)
                .count();
    }
}
