package com.foodrush.courier.infrastructure.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * Configuración de WebSocket con STOMP
 */
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final com.foodrush.courier.infrastructure.security.WebSocketAuthInterceptor authInterceptor;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Habilita un broker simple en memoria
        // /topic: para mensajes públicos (ej: tracking de orden)
        // /queue: para mensajes privados (ej: notificaciones al courier)
        config.enableSimpleBroker("/topic", "/queue");

        // Prefijo para mensajes destinados a métodos @MessageMapping en controllers
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint para conectar el cliente WebSocket
        // Permitimos cualquier origen por ahora (CORS) para facilitar desarrollo
        registry.addEndpoint("/ws-courier")
                .setAllowedOriginPatterns("*")
                .withSockJS(); // Fallback para clientes que no soportan WebSocket nativo
    }

    @Override
    public void configureClientInboundChannel(
            org.springframework.messaging.simp.config.ChannelRegistration registration) {
        registration.interceptors(authInterceptor);
    }
}
