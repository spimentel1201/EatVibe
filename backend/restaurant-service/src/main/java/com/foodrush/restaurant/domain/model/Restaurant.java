package main.java.com.foodrush.restaurant.domain.model;

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

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Referencia lógica al User Service (sin FK física por arquitectura de
    // microservicios).
    @Column(name = "owner_user_id", nullable = false)
    private UUID ownerUserId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private RestaurantStatus status = RestaurantStatus.CLOSED;

    @Column(precision = 2, scale = 1)
    @Builder.Default
    private BigDecimal rating = BigDecimal.valueOf(5.0);

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Category> categories = new ArrayList<>();

    public void open() {
        this.status = RestaurantStatus.OPEN;
    }

    public void close() {
        this.status = RestaurantStatus.CLOSED;
    }

    public void markAsBusy() {
        this.status = RestaurantStatus.BUSY;
    }

    public boolean isOpen() {
        return this.status == RestaurantStatus.OPEN || this.status == RestaurantStatus.BUSY;
    }

    public void addCategory(Category category) {
        categories.add(category);
        category.setRestaurant(this);
    }

    public void removeCategory(Category category) {
        categories.remove(category);
        category.setRestaurant(null);
    }

    public void updateRating(BigDecimal newRating) {
        if (newRating.compareTo(BigDecimal.ZERO) < 0 || newRating.compareTo(BigDecimal.valueOf(5.0)) > 0) {
            throw new IllegalArgumentException("La calificación debe estar entre 0.0 y 5.0");
        }
        this.rating = newRating;
    }
}
