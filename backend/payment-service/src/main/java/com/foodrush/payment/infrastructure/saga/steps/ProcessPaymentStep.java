package com.foodrush.payment.infrastructure.saga.steps;

import com.foodrush.payment.domain.model.PaymentProvider;
import com.foodrush.payment.domain.model.Transaction;
import com.foodrush.payment.domain.model.TransactionStatus;
import com.foodrush.payment.domain.repository.PaymentGateway;
import com.foodrush.payment.domain.repository.TransactionRepository;
import com.foodrush.payment.domain.saga.CreateOrderSagaContext;
import com.foodrush.payment.domain.saga.SagaStep;
import com.foodrush.payment.infrastructure.gateway.PaymentGatewayFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Paso 3 del SAGA: Procesar pago.
 * 
 * <p>
 * Este paso procesa el pago real utilizando el gateway seleccionado.
 * Si falla, se ejecuta la compensación (reembolso).
 * </p>
 */
@Component
@Order(3)
@RequiredArgsConstructor
@Slf4j
public class ProcessPaymentStep implements SagaStep<CreateOrderSagaContext> {

    private final PaymentGatewayFactory gatewayFactory;
    private final TransactionRepository transactionRepository;

    @Override
    public String getName() {
        return "ProcessPayment";
    }

    @Override
    public void execute(CreateOrderSagaContext context) throws Exception {
        log.info("Ejecutando ProcessPaymentStep - Order: {}, Amount: {}",
                context.getOrderId(), context.getTotalAmount());

        // Crear transacción
        Transaction transaction = Transaction.builder()
                .orderId(context.getOrderId())
                .userId(context.getUserId())
                .amount(context.getTotalAmount())
                .currency("PEN")
                .status(TransactionStatus.PENDING)
                .provider(PaymentProvider.valueOf(context.getPaymentProvider()))
                .build();

        transaction = transactionRepository.save(transaction);
        context.setTransactionId(transaction.getId());

        // Procesar pago
        PaymentGateway gateway = gatewayFactory.getGateway(transaction.getProvider());

        PaymentGateway.PaymentRequest request = new PaymentGateway.PaymentRequest(
                context.getOrderId(),
                context.getUserId(),
                context.getTotalAmount(),
                "PEN",
                context.getPaymentMethodToken(),
                "Pago de pedido " + context.getOrderId());

        PaymentGateway.PaymentResult result = gateway.processPayment(request);

        if (!result.successful()) {
            transaction.markAsFailed(result.errorCode(), result.errorMessage());
            transactionRepository.save(transaction);
            throw new Exception("Pago fallido: " + result.errorMessage());
        }

        transaction.markAsCompleted(result.externalTransactionId());
        transactionRepository.save(transaction);
        context.setExternalTransactionId(result.externalTransactionId());

        log.info("Pago procesado exitosamente - Transaction: {}, External ID: {}",
                transaction.getId(), result.externalTransactionId());
    }

    @Override
    public void compensate(CreateOrderSagaContext context) {
        log.warn("Compensando ProcessPaymentStep - Reembolsando pago: {}", context.getTransactionId());

        if (context.getTransactionId() == null) {
            log.info("No hay transacción para reembolsar");
            return;
        }

        try {
            // Buscar transacción
            Transaction transaction = transactionRepository.findById(context.getTransactionId())
                    .orElseThrow(() -> new Exception("Transacción no encontrada"));

            // Solo reembolsar si el pago fue exitoso
            if (transaction.getStatus() == TransactionStatus.COMPLETED) {
                PaymentGateway gateway = gatewayFactory.getGateway(transaction.getProvider());

                PaymentGateway.RefundResult refundResult = gateway.processRefund(
                        transaction.getExternalTransactionId(),
                        transaction.getAmount());

                if (refundResult.successful()) {
                    transaction.markAsRefunded();
                    transactionRepository.save(transaction);
                    log.info("Reembolso exitoso - Refund ID: {}", refundResult.refundId());
                } else {
                    log.error("Reembolso falló: {}", refundResult.errorMessage());
                }
            }
        } catch (Exception e) {
            log.error("Error al reembolsar pago: {}", e.getMessage(), e);
        }
    }
}
