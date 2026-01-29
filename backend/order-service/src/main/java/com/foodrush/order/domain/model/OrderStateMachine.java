package com.foodrush.order.domain.model;

import com.foodrush.order.domain.exception.InvalidOrderStateTransitionException;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Map;
import java.util.Set;

import static com.foodrush.order.domain.model.OrderStatus.*;

/**
 * Máquina de estados para validar transiciones de pedidos.
 * 
 * <p>
 * Esta clase implementa el patrón State Machine para garantizar que los pedidos
 * solo puedan transicionar entre estados válidos según las reglas de negocio.
 * 
 * <p>
 * Ejemplo de uso:
 * 
 * <pre>
 * orderStateMachine.validateTransition(OrderStatus.CREATED, OrderStatus.PAYMENT_PENDING); // OK
 * orderStateMachine.validateTransition(OrderStatus.CREATED, OrderStatus.DELIVERED); // Lanza excepción
 * </pre>
 * 
 * @see OrderStatus
 */
@Component
public class OrderStateMachine {

    /**
     * Mapa de transiciones válidas.
     * Clave: Estado actual
     * Valor: Conjunto de estados a los que puede transicionar
     */
    private static final Map<OrderStatus, Set<OrderStatus>> VALID_TRANSITIONS = Map.ofEntries(
            Map.entry(CREATED, Set.of(PAYMENT_PENDING, CANCELLED)),
            Map.entry(PAYMENT_PENDING, Set.of(PAYMENT_CONFIRMED, PAYMENT_FAILED)),
            Map.entry(PAYMENT_CONFIRMED, Set.of(ACCEPTED_BY_RESTAURANT, REJECTED_BY_RESTAURANT)),
            Map.entry(ACCEPTED_BY_RESTAURANT, Set.of(PREPARING, CANCELLED)),
            Map.entry(PREPARING, Set.of(READY_FOR_PICKUP)),
            Map.entry(READY_FOR_PICKUP, Set.of(COURIER_ASSIGNED)),
            Map.entry(COURIER_ASSIGNED, Set.of(PICKED_UP)),
            Map.entry(PICKED_UP, Set.of(IN_TRANSIT)),
            Map.entry(IN_TRANSIT, Set.of(DELIVERED)),
            Map.entry(DELIVERED, Set.of(COMPLETED)),
            Map.entry(PAYMENT_FAILED, Set.of(PAYMENT_PENDING, CANCELLED)),
            Map.entry(REJECTED_BY_RESTAURANT, Set.of(REFUNDED)));

    /**
     * Valida si una transición de estado es permitida.
     * 
     * @param currentStatus el estado actual del pedido
     * @param newStatus     el nuevo estado deseado
     * @throws InvalidOrderStateTransitionException si la transición no es válida
     */
    public void validateTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        if (currentStatus == null || newStatus == null) {
            throw new IllegalArgumentException("Los estados no pueden ser nulos");
        }

        Set<OrderStatus> allowedTransitions = VALID_TRANSITIONS.getOrDefault(
                currentStatus,
                Collections.emptySet());

        if (!allowedTransitions.contains(newStatus)) {
            throw new InvalidOrderStateTransitionException(
                    String.format("Transición inválida: %s → %s. Transiciones permitidas desde %s: %s",
                            currentStatus, newStatus, currentStatus, allowedTransitions));
        }
    }

    /**
     * Verifica si una transición es válida sin lanzar excepción.
     * 
     * @param currentStatus el estado actual
     * @param newStatus     el nuevo estado
     * @return true si la transición es válida, false en caso contrario
     */
    public boolean isValidTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        if (currentStatus == null || newStatus == null) {
            return false;
        }

        Set<OrderStatus> allowedTransitions = VALID_TRANSITIONS.getOrDefault(
                currentStatus,
                Collections.emptySet());

        return allowedTransitions.contains(newStatus);
    }

    /**
     * Obtiene los estados a los que puede transicionar desde el estado actual.
     * 
     * @param currentStatus el estado actual
     * @return conjunto de estados permitidos
     */
    public Set<OrderStatus> getAllowedTransitions(OrderStatus currentStatus) {
        return VALID_TRANSITIONS.getOrDefault(currentStatus, Collections.emptySet());
    }
}
