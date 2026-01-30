package com.foodrush.payment.domain.repository;

import com.foodrush.payment.domain.model.Transaction;
import com.foodrush.payment.domain.model.TransactionStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Puerto (interfaz) para el repositorio de transacciones.
 * 
 * <p>
 * Define las operaciones de persistencia necesarias para Transaction
 * sin acoplarse a ninguna tecnología específica (JPA, MongoDB, etc.)
 * </p>
 */
public interface TransactionRepository {

    /**
     * Guarda una transacción.
     */
    Transaction save(Transaction transaction);

    /**
     * Busca una transacción por ID.
     */
    Optional<Transaction> findById(UUID id);

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

    /**
     * Elimina una transacción por ID.
     */
    void deleteById(UUID id);

    /**
     * Verifica si existe una transacción.
     */
    boolean existsById(UUID id);
}
