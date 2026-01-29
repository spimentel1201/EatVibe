package com.foodrush.order.application.usecase;

import com.foodrush.order.application.dto.request.CreateOrderRequest;
import com.foodrush.order.application.dto.response.OrderResponse;
import com.foodrush.order.application.mapper.OrderMapper;
import com.foodrush.order.domain.event.OrderCreatedEvent;
import com.foodrush.order.domain.exception.EmptyCartException;
import com.foodrush.order.domain.model.Order;
import com.foodrush.order.domain.model.OrderStatus;
import com.foodrush.order.domain.repository.CartRepository;
import com.foodrush.order.domain.repository.OrderRepository;
import com.foodrush.order.infrastructure.cache.model.Cart;
import com.foodrush.order.infrastructure.cache.model.CartItem;
import com.foodrush.order.infrastructure.messaging.producer.OrderEventProducer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * Tests unitarios para CreateOrderUseCase.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("CreateOrderUseCase - Tests Unitarios")
class CreateOrderUseCaseTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CartRepository<Cart> cartRepository;

    @Mock
    private OrderEventProducer eventProducer;

    @Mock
    private OrderMapper mapper;

    @InjectMocks
    private CreateOrderUseCase createOrderUseCase;

    private UUID customerId;
    private UUID restaurantId;
    private CreateOrderRequest request;
    private Cart cart;

    @BeforeEach
    void setUp() {
        customerId = UUID.randomUUID();
        restaurantId = UUID.randomUUID();

        request = CreateOrderRequest.builder()
                .customerId(customerId)
                .restaurantId(restaurantId)
                .deliveryAddressId(UUID.randomUUID())
                .deliveryFee(BigDecimal.valueOf(5.00))
                .build();

        CartItem cartItem = CartItem.builder()
                .menuItemId(UUID.randomUUID())
                .productName("Hamburguesa Clásica")
                .price(BigDecimal.valueOf(25.00))
                .quantity(2)
                .specialInstructions("Sin cebolla")
                .build();

        cart = Cart.builder()
                .customerId(customerId)
                .restaurantId(restaurantId)
                .items(new ArrayList<>(List.of(cartItem)))
                .subtotal(BigDecimal.valueOf(50.00))
                .build();
    }

    @Test
    @DisplayName("Debe crear pedido exitosamente desde el carrito")
    void shouldCreateOrderSuccessfully() {
        // Given
        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(cart));

        Order savedOrder = Order.builder()
                .id(UUID.randomUUID())
                .customerId(customerId)
                .restaurantId(restaurantId)
                .status(OrderStatus.CREATED)
                .subtotal(BigDecimal.valueOf(50.00))
                .deliveryFee(BigDecimal.valueOf(5.00))
                .totalAmount(BigDecimal.valueOf(55.00))
                .build();

        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

        OrderResponse expectedResponse = OrderResponse.builder()
                .id(savedOrder.getId())
                .status(OrderStatus.CREATED)
                .build();

        when(mapper.toOrderResponse(any(Order.class))).thenReturn(expectedResponse);

        // When
        OrderResponse response = createOrderUseCase.execute(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getStatus()).isEqualTo(OrderStatus.CREATED);

        // Verificar que se guardó el pedido
        verify(orderRepository).save(any(Order.class));

        // Verificar que se publicó el evento
        ArgumentCaptor<OrderCreatedEvent> eventCaptor = ArgumentCaptor.forClass(OrderCreatedEvent.class);
        verify(eventProducer).publishOrderCreated(eventCaptor.capture());

        OrderCreatedEvent publishedEvent = eventCaptor.getValue();
        assertThat(publishedEvent.getOrderId()).isEqualTo(savedOrder.getId());
        assertThat(publishedEvent.getCustomerId()).isEqualTo(customerId);
        assertThat(publishedEvent.getRestaurantId()).isEqualTo(restaurantId);

        // Verificar que se limpió el carrito
        verify(cartRepository).deleteByCustomerId(customerId);
    }

    @Test
    @DisplayName("Debe lanzar excepción si el carrito está vacío")
    void shouldThrowExceptionWhenCartIsEmpty() {
        // Given
        Cart emptyCart = Cart.builder()
                .customerId(customerId)
                .restaurantId(restaurantId)
                .items(new ArrayList<>())
                .build();

        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(emptyCart));

        // When & Then
        assertThatThrownBy(() -> createOrderUseCase.execute(request))
                .isInstanceOf(EmptyCartException.class)
                .hasMessageContaining(customerId.toString());

        // Verificar que NO se guardó el pedido
        verify(orderRepository, never()).save(any(Order.class));

        // Verificar que NO se publicó evento
        verify(eventProducer, never()).publishOrderCreated(any(OrderCreatedEvent.class));
    }

    @Test
    @DisplayName("Debe lanzar excepción si no existe el carrito")
    void shouldThrowExceptionWhenCartNotFound() {
        // Given
        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> createOrderUseCase.execute(request))
                .isInstanceOf(EmptyCartException.class);

        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    @DisplayName("Debe lanzar excepción si el restaurante no coincide")
    void shouldThrowExceptionWhenRestaurantMismatch() {
        // Given
        UUID differentRestaurantId = UUID.randomUUID();
        cart.setRestaurantId(differentRestaurantId);

        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(cart));

        // When & Then
        assertThatThrownBy(() -> createOrderUseCase.execute(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("El carrito pertenece al restaurante");

        verify(orderRepository, never()).save(any(Order.class));
    }
}
