package com.foodrush.payment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Aplicación principal del Payment Service.
 * 
 * <p>
 * Este microservicio gestiona:
 * - Procesamiento de pagos con múltiples gateways (Strategy Pattern)
 * - Gestión de métodos de pago tokenizados
 * - Transacciones y reembolsos
 * - SAGA Pattern para transacciones distribuidas
 * - Eventos de pago vía Kafka
 * </p>
 * 
 * @author FoodRush Team
 * @version 1.0
 * @since Sprint 3
 */
@SpringBootApplication
public class FoodRushPaymentApplication {

    public static void main(String[] args) {
        SpringApplication.run(FoodRushPaymentApplication.class, args);
    }
}
