package com.foodrush.payment.infrastructure.persistence.repository;

import com.foodrush.payment.domain.model.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repositorio JPA para PaymentMethod.
 */
@Repository
public interface PaymentMethodJpaRepository extends JpaRepository<PaymentMethod, UUID> {

    /**
     * Busca todos los métodos de pago de un usuario.
     */
    List<PaymentMethod> findByUserId(UUID userId);

    /**
     * Busca el método de pago por defecto de un usuario.
     */
    Optional<PaymentMethod> findByUserIdAndIsDefaultTrue(UUID userId);

    /**
     * Desmarca todos los métodos de pago de un usuario como predeterminados.
     */
    @Modifying
    @Query("UPDATE PaymentMethod pm SET pm.isDefault = false WHERE pm.userId = :userId")
    void unmarkAllAsDefaultForUser(@Param("userId") UUID userId);
}
