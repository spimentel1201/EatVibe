package com.foodrush.order.domain.repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Puerto (interfaz) de repositorio para el carrito de compras.
 * 
 * <p>
 * Esta interfaz define las operaciones para gestionar el carrito temporal
 * de un cliente en Redis. El carrito se almacena con un TTL de 24 horas.
 * 
 * @param <T> el tipo de datos del carrito
 */
public interface CartRepository<T> {

    /**
     * Guarda el carrito de un cliente.
     * 
     * @param customerId el ID del cliente
     * @param cart       el carrito a guardar
     */
    void save(UUID customerId, T cart);

    /**
     * Busca el carrito de un cliente.
     * 
     * @param customerId el ID del cliente
     * @return Optional conteniendo el carrito si existe
     */
    Optional<T> findByCustomerId(UUID customerId);

    /**
     * Elimina el carrito de un cliente.
     * 
     * @param customerId el ID del cliente
     */
    void deleteByCustomerId(UUID customerId);

    /**
     * Verifica si existe un carrito para el cliente.
     * 
     * @param customerId el ID del cliente
     * @return true si existe, false en caso contrario
     */
    boolean existsByCustomerId(UUID customerId);
}
