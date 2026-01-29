package com.foodrush.order.infrastructure.persistence.repository;

import com.foodrush.order.domain.model.Order;
import com.foodrush.order.domain.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repositorio Spring Data JPA para la entidad Order.
 */
@Repository
public interface OrderJpaRepository extends JpaRepository<Order, UUID> {

    /**
     * Busca todos los pedidos de un cliente.
     */
    List<Order> findByCustomerId(UUID customerId);

    /**
     * Busca todos los pedidos de un restaurante.
     */
    List<Order> findByRestaurantId(UUID restaurantId);

    /**
     * Busca todos los pedidos con un estado específico.
     */
    List<Order> findByStatus(OrderStatus status);
}
