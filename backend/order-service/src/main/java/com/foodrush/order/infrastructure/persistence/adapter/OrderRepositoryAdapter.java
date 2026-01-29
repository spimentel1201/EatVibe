package com.foodrush.order.infrastructure.persistence.adapter;

import com.foodrush.order.domain.model.Order;
import com.foodrush.order.domain.model.OrderStatus;
import com.foodrush.order.domain.repository.OrderRepository;
import com.foodrush.order.infrastructure.persistence.repository.OrderJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Adaptador que implementa el puerto OrderRepository usando JPA.
 * 
 * <p>
 * Este adaptador traduce las operaciones del dominio a operaciones de
 * persistencia
 * usando Spring Data JPA, siguiendo el patrón de Arquitectura Hexagonal.
 */
@Component
@RequiredArgsConstructor
public class OrderRepositoryAdapter implements OrderRepository {

    private final OrderJpaRepository jpaRepository;

    @Override
    public Order save(Order order) {
        return jpaRepository.save(order);
    }

    @Override
    public Optional<Order> findById(UUID id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<Order> findByCustomerId(UUID customerId) {
        return jpaRepository.findByCustomerId(customerId);
    }

    @Override
    public List<Order> findByRestaurantId(UUID restaurantId) {
        return jpaRepository.findByRestaurantId(restaurantId);
    }

    @Override
    public List<Order> findByStatus(OrderStatus status) {
        return jpaRepository.findByStatus(status);
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public boolean existsById(UUID id) {
        return jpaRepository.existsById(id);
    }
}
