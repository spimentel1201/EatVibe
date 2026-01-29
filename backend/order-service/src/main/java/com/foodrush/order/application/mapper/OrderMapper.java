package com.foodrush.order.application.mapper;

import com.foodrush.order.application.dto.response.CartItemResponse;
import com.foodrush.order.application.dto.response.CartResponse;
import com.foodrush.order.application.dto.response.OrderItemResponse;
import com.foodrush.order.application.dto.response.OrderResponse;
import com.foodrush.order.domain.model.Order;
import com.foodrush.order.domain.model.OrderItem;
import com.foodrush.order.infrastructure.cache.model.Cart;
import com.foodrush.order.infrastructure.cache.model.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

/**
 * Mapper para convertir entre entidades de dominio y DTOs.
 * 
 * <p>
 * Utiliza MapStruct para generar automáticamente las implementaciones
 * de mapeo en tiempo de compilación.
 */
@Mapper(componentModel = "spring")
public interface OrderMapper {

    /**
     * Convierte una entidad Order a OrderResponse.
     */
    OrderResponse toOrderResponse(Order order);

    /**
     * Convierte una lista de Orders a lista de OrderResponses.
     */
    List<OrderResponse> toOrderResponseList(List<Order> orders);

    /**
     * Convierte un OrderItem a OrderItemResponse.
     */
    @Mapping(target = "subtotal", expression = "java(orderItem.calculateSubtotal())")
    OrderItemResponse toOrderItemResponse(OrderItem orderItem);

    /**
     * Convierte un Cart a CartResponse.
     */
    @Mapping(target = "empty", expression = "java(cart.isEmpty())")
    CartResponse toCartResponse(Cart cart);

    /**
     * Convierte un CartItem a CartItemResponse.
     */
    @Mapping(target = "subtotal", expression = "java(cartItem.calculateSubtotal())")
    CartItemResponse toCartItemResponse(CartItem cartItem);

    /**
     * Convierte una lista de CartItems a lista de CartItemResponses.
     */
    List<CartItemResponse> toCartItemResponseList(List<CartItem> cartItems);
}
