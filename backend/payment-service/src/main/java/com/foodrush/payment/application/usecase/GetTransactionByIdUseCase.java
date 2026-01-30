package com.foodrush.payment.application.usecase;

import com.foodrush.payment.application.dto.response.TransactionResponse;
import com.foodrush.payment.application.mapper.PaymentMapper;
import com.foodrush.payment.domain.model.Transaction;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

/**
 * Caso de uso para obtener una transacción por ID.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GetTransactionByIdUseCase {

    private final com.foodrush.payment.domain.repository.TransactionRepository transactionRepository;
    private final PaymentMapper mapper;

    /**
     * Obtiene una transacción por ID.
     * 
     * @param transactionId ID de la transacción
     * @return Transacción encontrada o Optional.empty()
     */
    @Transactional(readOnly = true)
    public Optional<TransactionResponse> execute(UUID transactionId) {
        log.debug("Buscando transacción con ID: {}", transactionId);

        Optional<Transaction> transaction = transactionRepository.findById(transactionId);

        return transaction.map(mapper::toTransactionResponse);
    }
}
