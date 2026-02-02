package com.foodrush.courier.domain.repository;

import com.foodrush.courier.domain.model.Courier;
import com.foodrush.courier.domain.model.CourierLocation;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository port para CourierLocation (Hexagonal Architecture)
 */
public interface CourierLocationRepository {

    CourierLocation save(CourierLocation location);

    Optional<CourierLocation> findById(UUID id);

    /**
     * Encuentra la ubicación más reciente de un courier
     */
    Optional<CourierLocation> findLatestByCourier(Courier courier);

    /**
     * Encuentra el historial de ubicaciones de un courier
     */
    List<CourierLocation> findByCourierOrderByTimestampDesc(Courier courier);

    /**
     * Encuentra ubicaciones recientes (últimas X horas)
     */
    List<CourierLocation> findRecentByCourier(Courier courier, int hours);

    void deleteById(UUID id);
}
