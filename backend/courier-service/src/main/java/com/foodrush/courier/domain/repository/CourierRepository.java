package com.foodrush.courier.domain.repository;

import com.foodrush.courier.domain.model.Courier;
import com.foodrush.courier.domain.model.CourierStatus;
import org.locationtech.jts.geom.Point;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository port para Courier (Hexagonal Architecture)
 * 
 * Define las operaciones de persistencia sin depender de la implementación
 */
public interface CourierRepository {

    Courier save(Courier courier);

    Optional<Courier> findById(UUID id);

    Optional<Courier> findByEmail(String email);

    Optional<Courier> findByPhone(String phone);

    List<Courier> findByStatus(CourierStatus status);

    /**
     * Encuentra couriers disponibles dentro de un radio específico
     * 
     * @param location Punto central de búsqueda
     * @param radiusKm Radio de búsqueda en kilómetros
     * @return Lista de couriers disponibles ordenados por distancia
     */
    List<Courier> findAvailableWithinRadius(Point location, double radiusKm);

    List<Courier> findAll();

    void deleteById(UUID id);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);
}
