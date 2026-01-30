package com.foodrush.payment.infrastructure.gateway;

import com.foodrush.payment.domain.model.PaymentProvider;
import com.foodrush.payment.domain.repository.PaymentGateway;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Implementación simulada del gateway de pago para Yape.
 * 
 * <p>
 * Simula el comportamiento de Yape para desarrollo y testing.
 * En producción, se reemplazaría con la integración real de Yape API.
 * </p>
 * 
 * <p>
 * Simulación:
 * - Pagos siempre exitosos (excepto montos específicos para testing)
 * - Genera IDs de transacción aleatorios
 * - Reembolsos siempre exitosos
 * </p>
 */
@Component
@ConditionalOnProperty(name = "payment.yape.simulation-mode", havingValue = "true", matchIfMissing = true)
@Slf4j
public class YapePaymentGateway implements PaymentGateway {

    private static final BigDecimal FAIL_AMOUNT = new BigDecimal("999.99");
    private static final BigDecimal TIMEOUT_AMOUNT = new BigDecimal("888.88");

    @Override
    public PaymentResult processPayment(PaymentRequest request) {
        log.info("Procesando pago con Yape (SIMULADO) - Order: {}, Amount: {} {}",
                request.orderId(), request.amount(), request.currency());

        // Simular delay de red
        simulateNetworkDelay();

        // Simular fallo para testing
        if (FAIL_AMOUNT.compareTo(request.amount()) == 0) {
            log.warn("Simulando fallo de pago - Monto: {}", request.amount());
            return PaymentResult.failure("insufficient_funds", "Fondos insuficientes en la cuenta Yape");
        }

        // Simular timeout para testing
        if (TIMEOUT_AMOUNT.compareTo(request.amount()) == 0) {
            log.warn("Simulando timeout de pago - Monto: {}", request.amount());
            return PaymentResult.failure("timeout", "Timeout al conectar con Yape");
        }

        // Generar ID de transacción simulado
        String yapeTransactionId = "YAPE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        log.info("Pago exitoso con Yape (SIMULADO) - Transaction ID: {}", yapeTransactionId);
        return PaymentResult.success(yapeTransactionId);
    }

    @Override
    public RefundResult processRefund(String transactionId, BigDecimal amount) {
        log.info("Procesando reembolso con Yape (SIMULADO) - Transaction: {}, Amount: {}",
                transactionId, amount);

        // Simular delay de red
        simulateNetworkDelay();

        // Generar ID de reembolso simulado
        String refundId = "YAPE-REFUND-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        log.info("Reembolso exitoso con Yape (SIMULADO) - Refund ID: {}", refundId);
        return RefundResult.success(refundId);
    }

    @Override
    public PaymentProvider getProvider() {
        return PaymentProvider.YAPE;
    }

    @Override
    public boolean isAvailable() {
        // En modo simulación, siempre disponible
        return true;
    }

    /**
     * Simula un delay de red realista (100-300ms).
     */
    private void simulateNetworkDelay() {
        try {
            Thread.sleep(100 + (long) (Math.random() * 200));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
