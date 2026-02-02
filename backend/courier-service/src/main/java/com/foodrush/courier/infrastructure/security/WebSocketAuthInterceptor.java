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

    @org.springframework.beans.factory.annotation.Value("${jwt.secret}")
    private String secretKey;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                try {
                    // Validar Token
                    io.jsonwebtoken.Claims claims = io.jsonwebtoken.Jwts.parserBuilder()
                            .setSigningKey(getSignKey())
                            .build()
                            .parseClaimsJws(token)
                            .getBody();

                    String userId = claims.get("userId", String.class);
                    String role = claims.get("role", String.class);
                    String email = claims.getSubject();

                    log.info("WebSocket Authenticated: User={}, Role={}", email, role);

                    // Establecer usuario en la sesión WebSocket
                    // Usamos un Principal simple ya que no tenemos Spring Security full context
                    // aquí
                    accessor.setUser(new java.security.Principal() {
                        @Override
                        public String getName() {
                            return userId != null ? userId : email;
                        }
                    });

                } catch (Exception e) {
                    log.error("WebSocket Authentication Failed: {}", e.getMessage());
                    throw new IllegalArgumentException("Invalid JWT Token");
                }
            } else {
                log.warn("WebSocket connection attempt without valid Authorization header");
                throw new IllegalArgumentException("Missing or invalid Authorization header");
            }
        }
        return message;
    }

    private java.security.Key getSignKey() {
        byte[] keyBytes = io.jsonwebtoken.io.Decoders.BASE64.decode(secretKey);
        return io.jsonwebtoken.security.Keys.hmacShaKeyFor(keyBytes);
    }
}
