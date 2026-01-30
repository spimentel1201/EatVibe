package com.foodrush.payment.infrastructure.persistence.adapter;

import com.foodrush.payment.domain.model.PaymentMethod;
import com.foodrush.payment.domain.repository.PaymentMethodRepository;
import com.foodrush.payment.infrastructure.persistence.repository.PaymentMethodJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Adaptador que implementa el puerto PaymentMethodRepository usando JPA.
 */
@Component
@RequiredArgsConstructor
public class PaymentMethodRepositoryAdapter implements PaymentMethodRepository {

    private final PaymentMethodJpaRepository jpaRepository;

    @Override
    public PaymentMethod save(PaymentMethod paymentMethod) {
        return jpaRepository.save(paymentMethod);
    }

    @Override
    public Optional<PaymentMethod> findById(UUID id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<PaymentMethod> findByUserId(UUID userId) {
        return jpaRepository.findByUserId(userId);
    }

    @Override
    public Optional<PaymentMethod> findDefaultByUserId(UUID userId) {
        return jpaRepository.findByUserIdAndIsDefaultTrue(userId);
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public boolean existsById(UUID id) {
        return jpaRepository.existsById(id);
    }

    @Override
    @Transactional
    public void unmarkAllAsDefaultForUser(UUID userId) {
        jpaRepository.unmarkAllAsDefaultForUser(userId);
    }
}
