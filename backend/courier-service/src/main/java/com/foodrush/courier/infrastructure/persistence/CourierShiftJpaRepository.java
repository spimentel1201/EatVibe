package com.foodrush.courier.infrastructure.persistence;

import com.foodrush.courier.domain.model.Courier;
import com.foodrush.courier.domain.model.CourierShift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourierShiftJpaRepository extends JpaRepository<CourierShift, UUID> {

    @Query("SELECT s FROM CourierShift s WHERE s.courier = :courier AND s.clockOutAt IS NULL")
    Optional<CourierShift> findActiveShiftByCourier(@Param("courier") Courier courier);

    @Query("SELECT s FROM CourierShift s WHERE s.courier = :courier AND s.clockOutAt IS NOT NULL AND s.clockInAt BETWEEN :start AND :end")
    List<CourierShift> findCompletedShiftsByCourierAndDateRange(
            @Param("courier") Courier courier,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);
}
