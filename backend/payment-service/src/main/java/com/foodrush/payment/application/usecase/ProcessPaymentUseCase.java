package com.foodrush.payment.application.usecase;

import com.foodrush.payment.application.dto.request.ProcessPaymentRequest;
import com.foodrush.payment.application.dto.response.PaymentResultResponse;
import com.foodrush.payment.domain.event.PaymentCompletedEvent;
import com.foodrush.payment.domain.event.PaymentFailedEvent;
import com.foodrush.payment.domain.exception.PaymentFailedException;
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

/**
 * Caso de uso para procesar un pago.
 * 
 * <p>
 * Flujo:
 * 1. Crear transacción en estado PENDING
 * 2. Seleccionar gateway según proveedor
 * 3. Procesar pago con el gateway
 * 4. Actualizar transacción según resultado
 * 5. Retornar resultado
 * </p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProcessPaymentUseCase {

        private final TransactionRepository transactionRepository;
        private final PaymentGatewayFactory gatewayFactory;
        private final PaymentEventProducer eventProducer;

        /**
         * Procesa un pago.
         * 
         * @param request Datos del pago
         * @return Resultado del procesamiento
         * @throws PaymentFailedException si el pago falla
         */
        @Transactional
        public PaymentResultResponse execute(ProcessPaymentRequest request) {
                log.info("Iniciando procesamiento de pago - Order: {}, Provider: {}, Amount: {} {}",
                                request.orderId(), request.provider(), request.amount(), request.currency());

                // 1. Crear transacción en estado PENDING
                Transaction transaction = Transaction.builder()
                                .orderId(request.orderId())
                                .userId(request.userId())
                                .amount(request.amount())
                                .currency(request.currency())
                                .status(TransactionStatus.PENDING)
                                .provider(request.provider())
                                .build();

                transaction = transactionRepository.save(transaction);
                log.debug("Transacción creada con ID: {}", transaction.getId());

                try {
                        // 2. Seleccionar gateway
                        PaymentGateway gateway = gatewayFactory.getGateway(request.provider());

                        // 3. Procesar pago
                        PaymentGateway.PaymentRequest gatewayRequest = new PaymentGateway.PaymentRequest(
                                        request.orderId(),
                                        request.userId(),
                                        request.amount(),
                                        request.currency(),
                                        request.paymentMethodToken(),
                                        request.description());

                        PaymentGateway.PaymentResult result = gateway.processPayment(gatewayRequest);

                        // 4. Actualizar transacción según resultado
                        if (result.successful()) {
                                transaction.markAsCompleted(result.externalTransactionId());
                                transactionRepository.save(transaction);

                                log.info("Pago procesado exitosamente - Transaction: {}, External ID: {}",
                                                transaction.getId(), result.externalTransactionId());

                                // Publicar evento de pago completado
                                PaymentCompletedEvent event = PaymentCompletedEvent.create(
                                                transaction.getId(),
                                                transaction.getOrderId(),
                                                transaction.getUserId(),
                                                transaction.getAmount(),
                                                transaction.getCurrency(),
                                                transaction.getProvider(),
                                                transaction.getExternalTransactionId());
                                eventProducer.publishPaymentCompleted(event);

                                return PaymentResultResponse.success(
                                                transaction.getId(),
                                                result.externalTransactionId());
                        } else {
                                transaction.markAsFailed(result.errorCode(), result.errorMessage());
                                transactionRepository.save(transaction);

                                log.warn("Pago falló - Transaction: {}, Error: {} - {}",
                                                transaction.getId(), result.errorCode(), result.errorMessage());

                                // Publicar evento de pago fallido
                                PaymentFailedEvent event = PaymentFailedEvent.create(
                                                transaction.getId(),
                                                transaction.getOrderId(),
                                                transaction.getUserId(),
                                                transaction.getAmount(),
                                                transaction.getCurrency(),
                                                transaction.getProvider(),
                                                result.errorCode(),
                                                result.errorMessage());
                                eventProducer.publishPaymentFailed(event);

                                return PaymentResultResponse.failure(
                                                transaction.getId(),
                                                result.errorCode(),
                                                result.errorMessage());
                        }

                } catch (Exception e) {
                        // Marcar transacción como fallida
                        transaction.markAsFailed("system_error", e.getMessage());
                        transactionRepository.save(transaction);

                        log.error("Error al procesar pago - Transaction: {}", transaction.getId(), e);
                        throw e;
                }
        }
}
