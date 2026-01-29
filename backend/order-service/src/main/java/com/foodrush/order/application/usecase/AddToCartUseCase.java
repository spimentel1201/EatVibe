package com.foodrush.order.application.usecase;

import com.foodrush.order.application.dto.request.AddToCartRequest;
import com.foodrush.order.application.dto.response.CartResponse;
import com.foodrush.order.application.mapper.OrderMapper;
import com.foodrush.order.domain.repository.CartRepository;
import com.foodrush.order.infrastructure.cache.model.Cart;
import com.foodrush.order.infrastructure.cache.model.CartItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;

/**
 * Caso de uso para agregar un item al carrito.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AddToCartUseCase {

    private final CartRepository<Cart> cartRepository;
    private final OrderMapper mapper;

    public CartResponse execute(AddToCartRequest request) {
        log.info("Agregando item al carrito del cliente: {}", request.getCustomerId());

        // Obtener carrito existente o crear uno nuevo
        Cart cart = cartRepository.findByCustomerId(request.getCustomerId())
                .orElse(Cart.builder()
                        .customerId(request.getCustomerId())
                        .restaurantId(request.getRestaurantId())
                        .items(new ArrayList<>())
                        .subtotal(BigDecimal.ZERO)
                        .createdAt(Instant.now())
                        .build());

        // Validar que el item sea del mismo restaurante
        if (cart.getRestaurantId() != null && !cart.getRestaurantId().equals(request.getRestaurantId())) {
            throw new IllegalArgumentException(
                    "No puedes agregar items de diferentes restaurantes al mismo carrito. " +
                            "Vacía el carrito primero.");
        }

        // Crear item del carrito
        CartItem cartItem = CartItem.builder()
                .menuItemId(request.getMenuItemId())
                .productName(request.getProductName())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .specialInstructions(request.getSpecialInstructions())
                .build();

        // Agregar item al carrito
        cart.addItem(cartItem);

        // Guardar en Redis
        cartRepository.save(request.getCustomerId(), cart);

        log.info("Item agregado al carrito. Total de items: {}", cart.getItems().size());

        return mapper.toCartResponse(cart);
    }
}
