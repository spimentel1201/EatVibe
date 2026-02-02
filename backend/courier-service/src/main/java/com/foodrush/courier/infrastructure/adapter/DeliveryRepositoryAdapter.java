package com.foodrush.courier.infrastructure.adapter;

import com.foodrush.courier.domain.model.Courier;
import com.foodrush.courier.domain.model.Delivery;
import com.foodrush.courier.domain.model.DeliveryStatus;
import com.foodrush.courier.domain.repository.DeliveryRepository;
import com.foodrush.courier.infrastructure.persistence.DeliveryJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Adapter que implementa DeliveryRepository usando JPA
 */
@Component
@RequiredArgsConstructor
public class DeliveryRepositoryAdapter implements DeliveryRepository {

    private final DeliveryJpaRepository jpaRepository;

    @Override
    public Delivery save(Delivery delivery) {
        return jpaRepository.save(delivery);
    }

    @Override
    public Optional<Delivery> findById(UUID id) {
        return jpaRepository.findById(id);
    }

    @Override
    public Optional<Delivery> findByOrderId(UUID orderId) {
        return jpaRepository.findByOrderId(orderId);
    }

    @Override
    public List<Delivery> findByCourier(Courier courier) {
        return jpaRepository.findByCourier(courier);
    }

    @Override
    public List<Delivery> findByStatus(DeliveryStatus status) {
        return jpaRepository.findByStatus(status);
    }

    @Override
    public List<Delivery> findActiveByCourier(Courier courier) {
        return jpaRepository.findActiveByCourier(courier);
    }

    @Override
    public List<Delivery> findAll() {
        return jpaRepository.findAll();
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }
}
