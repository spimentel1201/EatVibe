package com.foodrush.courier.infrastructure.persistence;

import com.foodrush.courier.domain.model.Courier;
import com.foodrush.courier.domain.model.CourierLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * JPA Repository para CourierLocation
 */
@Repository
public interface CourierLocationJpaRepository extends JpaRepository<CourierLocation, UUID> {

    /**
     * Encuentra la ubicación más reciente de un courier
     */
    @Query("SELECT cl FROM CourierLocation cl WHERE cl.courier = :courier ORDER BY cl.timestamp DESC LIMIT 1")
    Optional<CourierLocation> findLatestByCourier(@Param("courier") Courier courier);

    /**
     * Encuentra el historial de ubicaciones de un courier ordenado por timestamp
     * descendente
     */
    List<CourierLocation> findByCourierOrderByTimestampDesc(Courier courier);

    /**
     * Encuentra ubicaciones recientes (últimas X horas)
     */
    @Query("SELECT cl FROM CourierLocation cl WHERE cl.courier = :courier AND cl.timestamp >= :since ORDER BY cl.timestamp DESC")
    List<CourierLocation> findRecentByCourier(
            @Param("courier") Courier courier,
            @Param("since") LocalDateTime since);

    /**
     * Elimina ubicaciones antiguas (para limpieza de datos)
     */
    void deleteByTimestampBefore(LocalDateTime timestamp);
}
