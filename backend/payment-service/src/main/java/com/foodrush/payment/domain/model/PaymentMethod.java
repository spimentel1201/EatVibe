package com.foodrush.payment.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

/**
 * Entidad que representa un método de pago tokenizado.
 * 
 * <p>
 * IMPORTANTE: Nunca almacenar datos sensibles de tarjetas (PAN, CVV).
 * Solo guardar tokens proporcionados por el gateway de pago.
 * Cumplimiento PCI DSS.
 * </p>
 */
@Entity
@Table(name = "payment_methods", indexes = {
        @Index(name = "idx_payment_methods_user_id", columnList = "user_id"),
        @Index(name = "idx_payment_methods_is_default", columnList = "is_default")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * ID del usuario propietario (referencia lógica a User Service)
     */
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    /**
     * Tipo de método de pago
     */
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private PaymentMethodType type;

    /**
     * Número enmascarado para mostrar al usuario
     * Ejemplos: "****1234", "+51 9** *** 789"
     */
    @Column(name = "masked_number", length = 20)
    private String maskedNumber;

    /**
     * Token del proveedor de pago (Stripe, Yape, etc.)
     * NUNCA almacenar el PAN completo de la tarjeta
     */
    @Column(nullable = false, length = 255)
    private String token;

    /**
     * Proveedor del token
     */
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private PaymentProvider provider;

    /**
     * Indica si es el método de pago por defecto del usuario
     */
    @Column(name = "is_default", nullable = false)
    @Builder.Default
    private Boolean isDefault = false;

    /**
     * Fecha de creación
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
     * Marca este método como predeterminado.
     */
    public void markAsDefault() {
        this.isDefault = true;
        this.updatedAt = Instant.now();
    }

    /**
     * Desmarca este método como predeterminado.
     */
    public void unmarkAsDefault() {
        this.isDefault = false;
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
