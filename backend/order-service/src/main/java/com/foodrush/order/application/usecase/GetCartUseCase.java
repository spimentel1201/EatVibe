package com.foodrush.order.application.usecase;

import com.foodrush.order.application.dto.response.CartResponse;
import com.foodrush.order.application.mapper.OrderMapper;
import com.foodrush.order.domain.repository.CartRepository;
import com.foodrush.order.infrastructure.cache.model.Cart;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.UUID;

/**
 * Caso de uso para obtener el carrito de un cliente.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GetCartUseCase {

    private final CartRepository<Cart> cartRepository;
    private final OrderMapper mapper;

    public CartResponse execute(UUID customerId) {
        log.debug("Obteniendo carrito del cliente: {}", customerId);

        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElse(Cart.builder()
                        .customerId(customerId)
                        .items(new ArrayList<>())
                        .subtotal(BigDecimal.ZERO)
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .build());

        return mapper.toCartResponse(cart);
    }
}
