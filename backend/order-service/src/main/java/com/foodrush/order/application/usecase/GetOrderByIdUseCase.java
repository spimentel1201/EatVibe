package com.foodrush.order.application.usecase;

import com.foodrush.order.application.dto.response.OrderResponse;
import com.foodrush.order.application.mapper.OrderMapper;
import com.foodrush.order.domain.exception.OrderNotFoundException;
import com.foodrush.order.domain.model.Order;
import com.foodrush.order.domain.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Caso de uso para obtener un pedido por su ID.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GetOrderByIdUseCase {

    private final OrderRepository orderRepository;
    private final OrderMapper mapper;

    @Transactional(readOnly = true)
    public OrderResponse execute(UUID orderId) {
        log.debug("Buscando pedido con ID: {}", orderId);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        return mapper.toOrderResponse(order);
    }
}
