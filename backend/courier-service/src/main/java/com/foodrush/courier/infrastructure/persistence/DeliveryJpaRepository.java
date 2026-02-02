package com.foodrush.courier.infrastructure.persistence;

import com.foodrush.courier.domain.model.Courier;
import com.foodrush.courier.domain.model.Delivery;
import com.foodrush.courier.domain.model.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * JPA Repository para Delivery
 */
@Repository
public interface DeliveryJpaRepository extends JpaRepository<Delivery, UUID> {

    Optional<Delivery> findByOrderId(UUID orderId);

    List<Delivery> findByCourier(Courier courier);

    List<Delivery> findByStatus(DeliveryStatus status);

    /**
     * Encuentra entregas activas (en progreso) de un courier
     */
    @Query("SELECT d FROM Delivery d WHERE d.courier = :courier AND d.status IN ('ASSIGNED', 'PICKED_UP', 'IN_TRANSIT')")
    List<Delivery> findActiveByCourier(@Param("courier") Courier courier);

    /**
     * Encuentra entregas pendientes (sin asignar)
     */
    @Query("SELECT d FROM Delivery d WHERE d.status = 'PENDING' ORDER BY d.createdAt ASC")
    List<Delivery> findPendingDeliveries();

    /**
     * Cuenta entregas activas de un courier
     */
    @Query("SELECT COUNT(d) FROM Delivery d WHERE d.courier = :courier AND d.status IN ('ASSIGNED', 'PICKED_UP', 'IN_TRANSIT')")
    long countActiveByCourier(@Param("courier") Courier courier);
}
