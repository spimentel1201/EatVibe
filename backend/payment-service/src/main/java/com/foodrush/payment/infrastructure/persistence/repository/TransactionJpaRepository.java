package com.foodrush.payment.infrastructure.persistence.repository;

import com.foodrush.payment.domain.model.Transaction;
import com.foodrush.payment.domain.model.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repositorio JPA para Transaction.
 * 
 * <p>
 * Spring Data JPA genera automáticamente la implementación.
 * </p>
 */
@Repository
public interface TransactionJpaRepository extends JpaRepository<Transaction, UUID> {

    /**
     * Busca todas las transacciones de un pedido.
     */
    List<Transaction> findByOrderId(UUID orderId);

    /**
     * Busca todas las transacciones de un usuario.
     */
    List<Transaction> findByUserId(UUID userId);

    /**
     * Busca transacciones por estado.
     */
    List<Transaction> findByStatus(TransactionStatus status);

    /**
     * Busca una transacción por ID externo del proveedor.
     */
    Optional<Transaction> findByExternalTransactionId(String externalTransactionId);
}
