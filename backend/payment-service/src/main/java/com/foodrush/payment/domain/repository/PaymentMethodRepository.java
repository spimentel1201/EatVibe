package com.foodrush.payment.domain.repository;

import com.foodrush.payment.domain.model.PaymentMethod;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Puerto (interfaz) para el repositorio de métodos de pago.
 * 
 * <p>
 * Define las operaciones de persistencia necesarias para PaymentMethod
 * sin acoplarse a ninguna tecnología específica.
 * </p>
 */
public interface PaymentMethodRepository {

    /**
     * Guarda un método de pago.
     */
    PaymentMethod save(PaymentMethod paymentMethod);

    /**
     * Busca un método de pago por ID.
     */
    Optional<PaymentMethod> findById(UUID id);

    /**
     * Busca todos los métodos de pago de un usuario.
     */
    List<PaymentMethod> findByUserId(UUID userId);

    /**
     * Busca el método de pago por defecto de un usuario.
     */
    Optional<PaymentMethod> findDefaultByUserId(UUID userId);

    /**
     * Elimina un método de pago por ID.
     */
    void deleteById(UUID id);

    /**
     * Verifica si existe un método de pago.
     */
    boolean existsById(UUID id);

    /**
     * Desmarca todos los métodos de pago de un usuario como predeterminados.
     * Útil antes de marcar uno nuevo como predeterminado.
     */
    void unmarkAllAsDefaultForUser(UUID userId);
}
