package com.foodrush.payment.application.usecase;

import com.foodrush.payment.application.dto.request.RefundRequest;
import com.foodrush.payment.domain.event.RefundProcessedEvent;
import com.foodrush.payment.domain.exception.PaymentFailedException;
import com.foodrush.payment.domain.exception.RefundFailedException;
import com.foodrush.payment.domain.model.Transaction;
import com.foodrush.payment.domain.model.TransactionStatus;
import com.foodrush.payment.domain.repository.PaymentGateway;
import com.foodrush.payment.domain.repository.TransactionRepository;
import com.foodrush.payment.infrastructure.gateway.PaymentGatewayFactory;
import com.foodrush.payment.infrastructure.messaging.PaymentEventProducer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

/**
 * Caso de uso para procesar un reembolso.
 * 
 * <p>
 * Flujo:
 * 1. Buscar transacción original
 * 2. Validar que esté en estado COMPLETED
 * 3. Procesar reembolso con el gateway
 * 4. Actualizar transacción a REFUNDED
 * 5. Publicar evento RefundProcessedEvent
 * </p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RefundPaymentUseCase {

    private final TransactionRepository transactionRepository;
    private final PaymentGatewayFactory gatewayFactory;
    private final PaymentEventProducer eventProducer;

    /**
     * Procesa un reembolso.
     * 
     * @param request Datos del reembolso
     * @throws PaymentFailedException si la transacción no existe o no es válida
     * @throws RefundFailedException  si el reembolso falla
     */
    @Transactional
    public void execute(RefundRequest request) {
        log.info("Iniciando reembolso - Transaction: {}, Amount: {}",
                request.transactionId(), request.amount());

        // 1. Buscar transacción
        Transaction transaction = transactionRepository.findById(request.transactionId())
                .orElseThrow(() -> new PaymentFailedException(
                        "Transacción no encontrada: " + request.transactionId()));

        // 2. Validar estado
        if (transaction.getStatus() != TransactionStatus.COMPLETED) {
            throw new PaymentFailedException(
                    String.format("La transacción no puede ser reembolsada. Estado actual: %s",
                            transaction.getStatus()));
        }

        if (transaction.getStatus() == TransactionStatus.REFUNDED) {
            throw new PaymentFailedException("La transacción ya fue reembolsada");
        }

        // Determinar monto a reembolsar
        BigDecimal refundAmount = request.amount() != null ? request.amount() : transaction.getAmount();

        if (refundAmount.compareTo(transaction.getAmount()) > 0) {
            throw new PaymentFailedException(
                    "El monto a reembolsar no puede ser mayor al monto de la transacción");
        }

        try {
            // 3. Procesar reembolso
            PaymentGateway gateway = gatewayFactory.getGateway(transaction.getProvider());

            PaymentGateway.RefundResult result = gateway.processRefund(
                    transaction.getExternalTransactionId(),
                    refundAmount);

            if (!result.successful()) {
                throw new RefundFailedException(
                        "Reembolso fallido: " + result.errorMessage(),
                        result.errorCode(),
                        transaction.getId());
            }

            // 4. Actualizar transacción
            transaction.markAsRefunded();
            transactionRepository.save(transaction);

            log.info("Reembolso procesado exitosamente - Transaction: {}, Refund ID: {}",
                    transaction.getId(), result.refundId());

            // 5. Publicar evento
            RefundProcessedEvent event = RefundProcessedEvent.create(
                    transaction.getId(),
                    transaction.getOrderId(),
                    transaction.getUserId(),
                    refundAmount,
                    transaction.getCurrency(),
                    result.refundId(),
                    request.reason());
            eventProducer.publishRefundProcessed(event);

        } catch (RefundFailedException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error al procesar reembolso: {}", e.getMessage(), e);
            throw new RefundFailedException(
                    "Error al procesar reembolso: " + e.getMessage(),
                    "system_error",
                    transaction.getId());
        }
    }
}
