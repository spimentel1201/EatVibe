package com.foodrush.payment.infrastructure.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración para Stripe Payment Gateway.
 * 
 * <p>
 * Inicializa el SDK de Stripe con la API key configurada.
 * </p>
 */
@Configuration
@Getter
public class StripeConfig {

    @Value("${payment.stripe.api-key}")
    private String apiKey;

    @Value("${payment.stripe.webhook-secret}")
    private String webhookSecret;

    /**
     * Inicializa Stripe SDK con la API key.
     */
    @PostConstruct
    public void init() {
        Stripe.apiKey = apiKey;
    }
}
