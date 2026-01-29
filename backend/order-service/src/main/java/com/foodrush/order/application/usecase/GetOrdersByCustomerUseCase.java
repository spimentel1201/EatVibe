package com.foodrush.order.application.usecase;

import com.foodrush.order.application.dto.response.OrderResponse;
import com.foodrush.order.application.mapper.OrderMapper;
import com.foodrush.order.domain.model.Order;
import com.foodrush.order.domain.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Caso de uso para obtener todos los pedidos de un cliente.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GetOrdersByCustomerUseCase {

    private final OrderRepository orderRepository;
    private final OrderMapper mapper;

    @Transactional(readOnly = true)
    public List<OrderResponse> execute(UUID customerId) {
        log.debug("Buscando pedidos del cliente: {}", customerId);

        List<Order> orders = orderRepository.findByCustomerId(customerId);

        log.debug("Se encontraron {} pedidos para el cliente: {}", orders.size(), customerId);

        return mapper.toOrderResponseList(orders);
    }
}
