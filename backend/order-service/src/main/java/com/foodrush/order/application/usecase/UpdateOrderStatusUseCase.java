package com.foodrush.order.application.usecase;

import com.foodrush.order.application.dto.request.UpdateOrderStatusRequest;
import com.foodrush.order.application.dto.response.OrderResponse;
import com.foodrush.order.application.mapper.OrderMapper;
import com.foodrush.order.domain.exception.OrderNotFoundException;
import com.foodrush.order.domain.model.Order;
import com.foodrush.order.domain.model.OrderStateMachine;
import com.foodrush.order.domain.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

/**
 * Caso de uso para actualizar el estado de un pedido.
 * 
 * <p>
 * Este caso de uso valida que la transición de estado sea permitida
 * usando la máquina de estados antes de actualizar el pedido.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UpdateOrderStatusUseCase {

    private final OrderRepository orderRepository;
    private final OrderStateMachine stateMachine;
    private final OrderMapper mapper;

    @Transactional
    public OrderResponse execute(UUID orderId, UpdateOrderStatusRequest request) {
        log.info("Actualizando estado del pedido {} a {}", orderId, request.getNewStatus());

        // 1. Obtener pedido
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        // 2. Validar transición con máquina de estados
        stateMachine.validateTransition(order.getStatus(), request.getNewStatus());

        // 3. Actualizar estado
        order.setStatus(request.getNewStatus());
        order.setUpdatedAt(Instant.now());

        // 4. Guardar
        Order updatedOrder = orderRepository.save(order);

        log.info("Estado del pedido {} actualizado exitosamente de {} a {}",
                orderId, order.getStatus(), request.getNewStatus());

        return mapper.toOrderResponse(updatedOrder);
    }
}
