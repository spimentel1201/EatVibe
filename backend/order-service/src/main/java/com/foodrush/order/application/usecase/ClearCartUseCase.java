package com.foodrush.order.application.usecase;

import com.foodrush.order.domain.repository.CartRepository;
import com.foodrush.order.infrastructure.cache.model.Cart;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Caso de uso para vaciar el carrito de un cliente.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ClearCartUseCase {

    private final CartRepository<Cart> cartRepository;

    public void execute(UUID customerId) {
        log.info("Vaciando carrito del cliente: {}", customerId);

        cartRepository.deleteByCustomerId(customerId);

        log.info("Carrito vaciado exitosamente para cliente: {}", customerId);
    }
}
