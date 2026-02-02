package com.foodrush.courier.domain.repository;

import com.foodrush.courier.domain.model.Courier;
import com.foodrush.courier.domain.model.Delivery;
import com.foodrush.courier.domain.model.DeliveryStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository port para Delivery (Hexagonal Architecture)
 */
public interface DeliveryRepository {

    Delivery save(Delivery delivery);

    Optional<Delivery> findById(UUID id);

    Optional<Delivery> findByOrderId(UUID orderId);

    List<Delivery> findByCourier(Courier courier);

    List<Delivery> findByStatus(DeliveryStatus status);

    List<Delivery> findActiveByCourier(Courier courier);

    List<Delivery> findAll();

    void deleteById(UUID id);
}
