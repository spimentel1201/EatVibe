package com.foodrush.order.domain.repository;

import com.foodrush.order.domain.model.Order;
import com.foodrush.order.domain.model.OrderStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Puerto (interfaz) de repositorio para la entidad Order.
 * 
 * <p>
 * Esta interfaz define las operaciones de persistencia necesarias para
 * gestionar
 * pedidos, siguiendo el principio de Inversión de Dependencias (DIP). La
 * implementación
 * real se encuentra en la capa de infraestructura.
 */
public interface OrderRepository {

    /**
     * Guarda un pedido en el repositorio.
     * 
     * @param order el pedido a guardar
     * @return el pedido guardado
     */
    Order save(Order order);

    /**
     * Busca un pedido por su ID.
     * 
     * @param id el ID del pedido
     * @return Optional conteniendo el pedido si existe
     */
    Optional<Order> findById(UUID id);

    /**
     * Busca todos los pedidos de un cliente.
     * 
     * @param customerId el ID del cliente
     * @return lista de pedidos del cliente
     */
    List<Order> findByCustomerId(UUID customerId);

    /**
     * Busca todos los pedidos de un restaurante.
     * 
     * @param restaurantId el ID del restaurante
     * @return lista de pedidos del restaurante
     */
    List<Order> findByRestaurantId(UUID restaurantId);

    /**
     * Busca todos los pedidos con un estado específico.
     * 
     * @param status el estado del pedido
     * @return lista de pedidos con ese estado
     */
    List<Order> findByStatus(OrderStatus status);

    /**
     * Elimina un pedido por su ID.
     * 
     * @param id el ID del pedido a eliminar
     */
    void deleteById(UUID id);

    /**
     * Verifica si existe un pedido con el ID dado.
     * 
     * @param id el ID del pedido
     * @return true si existe, false en caso contrario
     */
    boolean existsById(UUID id);
}
