package com.foodrush.payment.infrastructure.persistence.adapter;

import com.foodrush.payment.domain.model.Transaction;
import com.foodrush.payment.domain.model.TransactionStatus;
import com.foodrush.payment.domain.repository.TransactionRepository;
import com.foodrush.payment.infrastructure.persistence.repository.TransactionJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Adaptador que implementa el puerto TransactionRepository usando JPA.
 * 
 * <p>
 * Traduce las llamadas del dominio a operaciones JPA.
 * Sigue el patrón Hexagonal Architecture.
 * </p>
 */
@Component
@RequiredArgsConstructor
public class TransactionRepositoryAdapter implements TransactionRepository {

    private final TransactionJpaRepository jpaRepository;

    @Override
    public Transaction save(Transaction transaction) {
        return jpaRepository.save(transaction);
    }

    @Override
    public Optional<Transaction> findById(UUID id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<Transaction> findByOrderId(UUID orderId) {
        return jpaRepository.findByOrderId(orderId);
    }

    @Override
    public List<Transaction> findByUserId(UUID userId) {
        return jpaRepository.findByUserId(userId);
    }

    @Override
    public List<Transaction> findByStatus(TransactionStatus status) {
        return jpaRepository.findByStatus(status);
    }

    @Override
    public Optional<Transaction> findByExternalTransactionId(String externalTransactionId) {
        return jpaRepository.findByExternalTransactionId(externalTransactionId);
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public boolean existsById(UUID id) {
        return jpaRepository.existsById(id);
    }
}
