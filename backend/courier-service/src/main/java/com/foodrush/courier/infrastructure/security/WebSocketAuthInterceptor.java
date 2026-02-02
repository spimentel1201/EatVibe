package com.foodrush.courier.infrastructure.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

/**
 * Interceptor para autenticación de conexiones WebSocket
 * Valida el token JWT en el header 'Authorization' durante la fase de CONNECT
 */
@Component
@Slf4j
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            // Extraer token del header Authorization
            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                log.debug("WebSocket connection attempt with token: {}...",
                        token.substring(0, Math.min(10, token.length())));

                // TODO: Validar token JWT y establecer autenticación en el contexto
                // UsernamePasswordAuthenticationToken user = ...
                // accessor.setUser(user);

            } else {
                log.warn("WebSocket connection attempt without valid Authorization header");
                // TODO: Descomentar para forzar autenticación
                // throw new IllegalArgumentException("Missing or invalid Authorization
                // header");
            }
        }

        return message;
    }
}
