package com.foodrush.courier.domain.repository;

import com.foodrush.courier.domain.model.Courier;
import com.foodrush.courier.domain.model.CourierShift;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository Port para CourierShift
 */
public interface CourierShiftRepository {

    CourierShift save(CourierShift shift);

    Optional<CourierShift> findById(UUID id);

    /**
     * Encuentra el turno activo actual de un courier
     */
    Optional<CourierShift> findActiveShiftByCourier(Courier courier);

    /**
     * Encuentra turnos completados en un rango de fechas
     */
    List<CourierShift> findCompletedShiftsByCourierAndDateRange(
            Courier courier,
            LocalDateTime start,
            LocalDateTime end);
}
