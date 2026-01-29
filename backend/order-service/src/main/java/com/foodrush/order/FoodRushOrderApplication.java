package com.foodrush.order;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Aplicación principal del Order Service.
 * 
 * <p>
 * Este microservicio es el cerebro transaccional de FoodRush, responsable de:
 * <ul>
 * <li>Gestión del ciclo de vida de pedidos (Order Lifecycle)</li>
 * <li>Máquina de estados con validación de transiciones</li>
 * <li>Gestión del carrito temporal en Redis</li>
 * <li>Publicación de eventos a Kafka para comunicación asíncrona</li>
 * </ul>
 * 
 * @author FoodRush Team
 * @version 1.0.0
 * @since 2026-01-29
 */
@SpringBootApplication
public class FoodRushOrderApplication {

    public static void main(String[] args) {
        SpringApplication.run(FoodRushOrderApplication.class, args);
    }
}
