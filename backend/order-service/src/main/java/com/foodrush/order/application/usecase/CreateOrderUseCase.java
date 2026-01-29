package com.foodrush.order.application.usecase;

import com.foodrush.order.application.dto.request.CreateOrderRequest;
import com.foodrush.order.application.dto.response.OrderResponse;
import com.foodrush.order.application.mapper.OrderMapper;
import com.foodrush.order.domain.event.OrderCreatedEvent;
import com.foodrush.order.domain.exception.EmptyCartException;
import com.foodrush.order.domain.model.Order;
import com.foodrush.order.domain.model.OrderItem;
import com.foodrush.order.domain.model.OrderStatus;
import com.foodrush.order.domain.repository.CartRepository;
import com.foodrush.order.domain.repository.OrderRepository;
import com.foodrush.order.infrastructure.cache.model.Cart;
import com.foodrush.order.infrastructure.messaging.producer.OrderEventProducer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

/**
 * Caso de uso para crear un pedido desde el carrito.
 * 
 * <p>
 * Este caso de uso implementa el flujo completo de creación de pedido:
 * 1. Obtener carrito de Redis
 * 2. Validar que no esté vacío
 * 3. Crear entidad Order con items (snapshot de precios)
 * 4. Guardar en base de datos
 * 5. Publicar evento a Kafka
 * 6. Limpiar carrito de Redis
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CreateOrderUseCase {

    private final OrderRepository orderRepository;
    private final CartRepository<Cart> cartRepository;
    private final OrderEventProducer eventProducer;
    private final OrderMapper mapper;

    @Transactional
    public OrderResponse execute(CreateOrderRequest request) {
        log.info("Creando pedido para cliente: {}", request.getCustomerId());

        // 1. Obtener carrito de Redis
        Cart cart = cartRepository.findByCustomerId(request.getCustomerId())
                .orElseThrow(() -> new EmptyCartException(request.getCustomerId()));

        // 2. Validar que no esté vacío
        if (cart.isEmpty()) {
            throw new EmptyCartException(request.getCustomerId());
        }

        // 3. Validar que el restaurante coincida
        if (!cart.getRestaurantId().equals(request.getRestaurantId())) {
            throw new IllegalArgumentException(
                    String.format("El carrito pertenece al restaurante %s, pero se intentó crear pedido para %s",
                            cart.getRestaurantId(), request.getRestaurantId()));
        }

        // 4. Crear entidad Order
        Order order = Order.builder()
                .id(UUID.randomUUID())
                .customerId(request.getCustomerId())
                .restaurantId(request.getRestaurantId())
                .status(OrderStatus.CREATED)
                .deliveryFee(request.getDeliveryFee())
                .createdAt(Instant.now())
                .build();

        // 5. Copiar items del carrito a OrderItems (snapshot)
        cart.getItems().forEach(cartItem -> {
            OrderItem orderItem = OrderItem.builder()
                    .id(UUID.randomUUID())
                    .menuItemId(cartItem.getMenuItemId())
                    .productSnapshotName(cartItem.getProductName())
                    .unitSnapshotPrice(cartItem.getPrice())
                    .quantity(cartItem.getQuantity())
                    .specialInstructions(cartItem.getSpecialInstructions())
                    .build();
            order.addItem(orderItem);
        });

        // 6. Calcular totales
        order.calculateSubtotal();
        order.calculateTotal();

        // 7. Guardar en base de datos
        Order savedOrder = orderRepository.save(order);
        log.info("Pedido creado exitosamente con ID: {}", savedOrder.getId());

        // 8. Publicar evento a Kafka
        OrderCreatedEvent event = OrderCreatedEvent.builder()
                .orderId(savedOrder.getId())
                .customerId(savedOrder.getCustomerId())
                .restaurantId(savedOrder.getRestaurantId())
                .totalAmount(savedOrder.getTotalAmount())
                .timestamp(Instant.now())
                .build();

        eventProducer.publishOrderCreated(event);

        // 9. Limpiar carrito de Redis
        cartRepository.deleteByCustomerId(request.getCustomerId());
        log.info("Carrito limpiado para cliente: {}", request.getCustomerId());

        return mapper.toOrderResponse(savedOrder);
    }
}
