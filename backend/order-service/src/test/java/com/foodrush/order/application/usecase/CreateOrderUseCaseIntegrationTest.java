package com.foodrush.order.application.usecase;

import com.foodrush.order.application.dto.request.CreateOrderRequest;
import com.foodrush.order.application.dto.response.OrderResponse;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Test de integración para CreateOrderUseCase.
 * 
 * <p>
 * Verifica el flujo completo de creación de pedido:
 * - Pedido guardado en base de datos
 * - Estado inicial CREATED
 * - Evento publicado a Kafka (mocked)
 * - Carrito limpiado de Redis
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("CreateOrderUseCase - Test de Integración")
class CreateOrderUseCaseIntegrationTest {

    @Autowired
    private CreateOrderUseCase createOrderUseCase;

    @Autowired
    private OrderRepository orderRepository;

    @MockBean
    private CartRepository<Cart> cartRepository;

    @MockBean
    private OrderEventProducer eventProducer;

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

        CartItem cartItem1 = CartItem.builder()
                .menuItemId(UUID.randomUUID())
                .productName("Hamburguesa Clásica")
                .price(BigDecimal.valueOf(25.00))
                .quantity(2)
                .specialInstructions("Sin cebolla")
                .build();

        CartItem cartItem2 = CartItem.builder()
                .menuItemId(UUID.randomUUID())
                .productName("Papas Fritas")
                .price(BigDecimal.valueOf(10.00))
                .quantity(1)
                .build();

        cart = Cart.builder()
                .customerId(customerId)
                .restaurantId(restaurantId)
                .items(new ArrayList<>(List.of(cartItem1, cartItem2)))
                .subtotal(BigDecimal.valueOf(60.00))
                .build();
    }

    @Test
    @DisplayName("Debe crear pedido y persistirlo en base de datos con estado CREATED")
    void shouldCreateOrderAndPersistInDatabase() {
        // Given
        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(cart));

        // When
        OrderResponse response = createOrderUseCase.execute(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isNotNull();
        assertThat(response.getStatus()).isEqualTo(OrderStatus.CREATED);
        assertThat(response.getCustomerId()).isEqualTo(customerId);
        assertThat(response.getRestaurantId()).isEqualTo(restaurantId);
        assertThat(response.getSubtotal()).isEqualByComparingTo(BigDecimal.valueOf(60.00));
        assertThat(response.getDeliveryFee()).isEqualByComparingTo(BigDecimal.valueOf(5.00));
        assertThat(response.getTotalAmount()).isEqualByComparingTo(BigDecimal.valueOf(65.00));
        assertThat(response.getItems()).hasSize(2);

        // Verificar que se guardó en la base de datos
        Optional<Order> savedOrder = orderRepository.findById(response.getId());
        assertThat(savedOrder).isPresent();
        assertThat(savedOrder.get().getStatus()).isEqualTo(OrderStatus.CREATED);
        assertThat(savedOrder.get().getItems()).hasSize(2);
    }

    @Test
    @DisplayName("Debe publicar evento OrderCreatedEvent a Kafka")
    void shouldPublishOrderCreatedEventToKafka() {
        // Given
        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(cart));

        // When
        createOrderUseCase.execute(request);

        // Then
        verify(eventProducer, times(1)).publishOrderCreated(any());
    }

    @Test
    @DisplayName("Debe limpiar el carrito de Redis después de crear el pedido")
    void shouldClearCartFromRedisAfterCreatingOrder() {
        // Given
        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(cart));

        // When
        createOrderUseCase.execute(request);

        // Then
        verify(cartRepository, times(1)).deleteByCustomerId(customerId);
    }

    @Test
    @DisplayName("Debe crear OrderItems con snapshot de precios y nombres")
    void shouldCreateOrderItemsWithPriceSnapshot() {
        // Given
        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(cart));

        // When
        OrderResponse response = createOrderUseCase.execute(request);

        // Then
        assertThat(response.getItems()).hasSize(2);

        // Verificar primer item
        var item1 = response.getItems().stream()
                .filter(i -> i.getProductSnapshotName().equals("Hamburguesa Clásica"))
                .findFirst()
                .orElseThrow();

        assertThat(item1.getUnitSnapshotPrice()).isEqualByComparingTo(BigDecimal.valueOf(25.00));
        assertThat(item1.getQuantity()).isEqualTo(2);
        assertThat(item1.getSpecialInstructions()).isEqualTo("Sin cebolla");

        // Verificar segundo item
        var item2 = response.getItems().stream()
                .filter(i -> i.getProductSnapshotName().equals("Papas Fritas"))
                .findFirst()
                .orElseThrow();

        assertThat(item2.getUnitSnapshotPrice()).isEqualByComparingTo(BigDecimal.valueOf(10.00));
        assertThat(item2.getQuantity()).isEqualTo(1);
    }

    @Test
    @DisplayName("Debe calcular correctamente el total del pedido")
    void shouldCalculateTotalCorrectly() {
        // Given
        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(cart));

        // When
        OrderResponse response = createOrderUseCase.execute(request);

        // Then
        // Subtotal: (25 * 2) + (10 * 1) = 60
        // Delivery Fee: 5
        // Total: 65
        assertThat(response.getSubtotal()).isEqualByComparingTo(BigDecimal.valueOf(60.00));
        assertThat(response.getDeliveryFee()).isEqualByComparingTo(BigDecimal.valueOf(5.00));
        assertThat(response.getTotalAmount()).isEqualByComparingTo(BigDecimal.valueOf(65.00));
    }
}
