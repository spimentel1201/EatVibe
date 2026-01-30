package com.foodrush.payment.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Entidad que representa una transacción de pago.
 * 
 * <p>
 * Almacena el historial completo de transacciones incluyendo:
 * - Pagos exitosos
 * - Intentos fallidos
 * - Reembolsos
 * </p>
 */
@Entity
@Table(name = "transactions", indexes = {
        @Index(name = "idx_transactions_order_id", columnList = "order_id"),
        @Index(name = "idx_transactions_user_id", columnList = "user_id"),
        @Index(name = "idx_transactions_status", columnList = "status"),
        @Index(name = "idx_transactions_created_at", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * ID del pedido asociado (referencia lógica a Order Service)
     */
    @Column(name = "order_id", nullable = false)
    private UUID orderId;

    /**
     * ID del usuario que realizó el pago (referencia lógica a User Service)
     */
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    /**
     * Monto de la transacción
     */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    /**
     * Moneda de la transacción (ISO 4217)
     */
    @Column(length = 3, nullable = false)
    @Builder.Default
    private String currency = "PEN";

    /**
     * Estado actual de la transacción
     */
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private TransactionStatus status;

    /**
     * Proveedor de pago utilizado
     */
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private PaymentProvider provider;

    /**
     * ID de la transacción en el sistema externo (Stripe, Yape, etc.)
     */
    @Column(name = "external_transaction_id", length = 255)
    private String externalTransactionId;

    /**
     * Mensaje de error en caso de fallo
     */
    @Column(name = "error_message", length = 500)
    private String errorMessage;

    /**
     * Código de error del proveedor
     */
    @Column(name = "error_code", length = 50)
    private String errorCode;

    /**
     * Fecha de creación de la transacción
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    /**
     * Fecha de última actualización
     */
    @Column(name = "updated_at")
    private Instant updatedAt;

    /**
     * Marca la transacción como completada.
     */
    public void markAsCompleted(String externalTransactionId) {
        this.status = TransactionStatus.COMPLETED;
        this.externalTransactionId = externalTransactionId;
        this.updatedAt = Instant.now();
    }

    /**
     * Marca la transacción como fallida.
     */
    public void markAsFailed(String errorCode, String errorMessage) {
        this.status = TransactionStatus.FAILED;
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
        this.updatedAt = Instant.now();
    }

    /**
     * Marca la transacción como reembolsada.
     */
    public void markAsRefunded() {
        this.status = TransactionStatus.REFUNDED;
        this.updatedAt = Instant.now();
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
