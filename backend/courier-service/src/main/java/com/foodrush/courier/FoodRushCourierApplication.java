package com.foodrush.courier;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * FoodRush Courier Service Application
 * 
 * Microservicio de gestión de repartidores con capacidades geoespaciales usando
 * PostGIS.
 * 
 * Características principales:
 * - Tracking en tiempo real vía WebSocket
 * - Algoritmo de asignación de repartidores
 * - Geofencing para validaciones de ubicación
 * - Queries espaciales con PostGIS
 * - Comunicación asíncrona vía Kafka
 * 
 * @author FoodRush Team
 * @version 1.0
 * @since 2026-01-30
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableKafka
@EnableAsync
public class FoodRushCourierApplication {

    public static void main(String[] args) {
        SpringApplication.run(FoodRushCourierApplication.class, args);
    }
}
