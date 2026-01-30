package com.foodrush.courier.infrastructure.adapter;

import com.foodrush.courier.domain.model.Courier;
import com.foodrush.courier.domain.model.CourierStatus;
import com.foodrush.courier.domain.repository.CourierRepository;
import com.foodrush.courier.infrastructure.persistence.CourierJpaRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Adapter que implementa CourierRepository usando JPA
 * Parte de la arquitectura hexagonal (Ports & Adapters)
 */
@Component
@RequiredArgsConstructor
public class CourierRepositoryAdapter implements CourierRepository {

    private final CourierJpaRepository jpaRepository;

    @Override
    public Courier save(Courier courier) {
        return jpaRepository.save(courier);
    }

    @Override
    public Optional<Courier> findById(UUID id) {
        return jpaRepository.findById(id);
    }

    @Override
    public Optional<Courier> findByEmail(String email) {
        return jpaRepository.findByEmail(email);
    }

    @Override
    public Optional<Courier> findByPhone(String phone) {
        return jpaRepository.findByPhone(phone);
    }

    @Override
    public List<Courier> findByStatus(CourierStatus status) {
        return jpaRepository.findByStatus(status);
    }

    @Override
    public List<Courier> findAvailableWithinRadius(Point location, double radiusKm) {
        double radiusMeters = radiusKm * 1000; // Convertir km a metros
        return jpaRepository.findAvailableWithinRadius(
                location.getY(), // latitude
                location.getX(), // longitude
                radiusMeters);
    }

    @Override
    public List<Courier> findAll() {
        return jpaRepository.findAll();
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByPhone(String phone) {
        return jpaRepository.existsByPhone(phone);
    }
}
