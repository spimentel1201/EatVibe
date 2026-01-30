package com.foodrush.payment.infrastructure.gateway;

import com.foodrush.payment.domain.model.PaymentProvider;
import com.foodrush.payment.domain.repository.PaymentGateway;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Factory para seleccionar el gateway de pago apropiado.
 * 
 * <p>
 * Implementa el patrón Strategy permitiendo cambiar dinámicamente
 * entre diferentes proveedores de pago sin modificar el código cliente.
 * </p>
 * 
 * <p>
 * Uso:
 * 
 * <pre>
 * PaymentGateway gateway = factory.getGateway(PaymentProvider.STRIPE);
 * PaymentResult result = gateway.processPayment(request);
 * </pre>
 * </p>
 */
@Component
@Slf4j
public class PaymentGatewayFactory {

    private final List<PaymentGateway> gateways;
    private final Map<PaymentProvider, PaymentGateway> gatewayMap;

    /**
     * Constructor que inicializa el mapa de gateways.
     * Spring inyecta automáticamente todas las implementaciones de PaymentGateway.
     */
    public PaymentGatewayFactory(List<PaymentGateway> gateways) {
        this.gateways = gateways;
        this.gatewayMap = gateways.stream()
                .collect(Collectors.toMap(
                        PaymentGateway::getProvider,
                        Function.identity()));

        log.info("PaymentGatewayFactory inicializado con {} gateways: {}",
                gatewayMap.size(),
                gatewayMap.keySet());
    }

    /**
     * Obtiene el gateway de pago para el proveedor especificado.
     * 
     * @param provider Proveedor de pago (STRIPE, YAPE, NIUBIZ)
     * @return Gateway de pago correspondiente
     * @throws IllegalArgumentException si el proveedor no está soportado
     */
    public PaymentGateway getGateway(PaymentProvider provider) {
        PaymentGateway gateway = gatewayMap.get(provider);

        if (gateway == null) {
            log.error("Gateway no encontrado para proveedor: {}", provider);
            throw new IllegalArgumentException(
                    String.format("Proveedor de pago no soportado: %s", provider));
        }

        if (!gateway.isAvailable()) {
            log.warn("Gateway {} no está disponible actualmente", provider);
            throw new IllegalStateException(
                    String.format("Gateway de pago %s no está disponible", provider));
        }

        log.debug("Gateway seleccionado: {}", provider);
        return gateway;
    }

    /**
     * Verifica si un proveedor está soportado.
     * 
     * @param provider Proveedor a verificar
     * @return true si el proveedor está soportado
     */
    public boolean isProviderSupported(PaymentProvider provider) {
        return gatewayMap.containsKey(provider);
    }

    /**
     * Obtiene todos los gateways disponibles.
     * 
     * @return Lista de gateways disponibles
     */
    public List<PaymentGateway> getAvailableGateways() {
        return gateways.stream()
                .filter(PaymentGateway::isAvailable)
                .toList();
    }
}
