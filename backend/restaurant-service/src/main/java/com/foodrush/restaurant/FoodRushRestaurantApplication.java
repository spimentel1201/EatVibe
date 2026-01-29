package com.foodrush.restaurant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Aplicación principal del microservicio Restaurant Service.
 * 
 * <p>
 * Este servicio es responsable de:
 * <ul>
 * <li>Gestión de restaurantes (CRUD)</li>
 * <li>Catálogo de menús y categorías</li>
 * <li>Control de disponibilidad de items</li>
 * <li>Gestión de horarios de operación</li>
 * </ul>
 * 
 * @author FoodRush Team
 * @version 1.0.0
 * @since 2026-01-29
 */
@SpringBootApplication
public class FoodRushRestaurantApplication {

    public static void main(String[] args) {
        SpringApplication.run(FoodRushRestaurantApplication.class, args);
    }
}
