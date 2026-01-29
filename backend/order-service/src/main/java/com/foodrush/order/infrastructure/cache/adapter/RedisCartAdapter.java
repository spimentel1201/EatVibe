package com.foodrush.order.infrastructure.cache.adapter;

import com.foodrush.order.domain.repository.CartRepository;
import com.foodrush.order.infrastructure.cache.model.Cart;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

/**
 * Adaptador que implementa el puerto CartRepository usando Redis.
 * 
 * <p>
 * Este adaptador gestiona el carrito temporal de compras en Redis con un TTL de
 * 24 horas.
 * La clave en Redis tiene el formato: "cart:{customerId}"
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class RedisCartAdapter implements CartRepository<Cart> {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final String CART_KEY_PREFIX = "cart:";
    private static final Duration CART_TTL = Duration.ofHours(24);

    /**
     * Genera la clave de Redis para el carrito de un cliente.
     */
    private String getCartKey(UUID customerId) {
        return CART_KEY_PREFIX + customerId.toString();
    }

    @Override
    public void save(UUID customerId, Cart cart) {
        String key = getCartKey(customerId);
        redisTemplate.opsForValue().set(key, cart, CART_TTL);
        log.debug("Carrito guardado en Redis para cliente: {} con TTL de 24h", customerId);
    }

    @Override
    public Optional<Cart> findByCustomerId(UUID customerId) {
        String key = getCartKey(customerId);
        Object value = redisTemplate.opsForValue().get(key);

        if (value instanceof Cart cart) {
            log.debug("Carrito encontrado en Redis para cliente: {}", customerId);
            return Optional.of(cart);
        }

        log.debug("No se encontró carrito en Redis para cliente: {}", customerId);
        return Optional.empty();
    }

    @Override
    public void deleteByCustomerId(UUID customerId) {
        String key = getCartKey(customerId);
        Boolean deleted = redisTemplate.delete(key);
        log.debug("Carrito eliminado de Redis para cliente: {}. Resultado: {}", customerId, deleted);
    }

    @Override
    public boolean existsByCustomerId(UUID customerId) {
        String key = getCartKey(customerId);
        Boolean exists = redisTemplate.hasKey(key);
        return Boolean.TRUE.equals(exists);
    }
}
