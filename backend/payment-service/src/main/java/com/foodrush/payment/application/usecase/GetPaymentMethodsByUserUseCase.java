package com.foodrush.payment.application.usecase;

import com.foodrush.payment.application.dto.response.PaymentMethodResponse;
import com.foodrush.payment.application.mapper.PaymentMapper;
import com.foodrush.payment.domain.model.PaymentMethod;
import com.foodrush.payment.domain.repository.PaymentMethodRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Caso de uso para obtener los métodos de pago de un usuario.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GetPaymentMethodsByUserUseCase {

    private final PaymentMethodRepository paymentMethodRepository;
    private final PaymentMapper mapper;

    /**
     * Obtiene todos los métodos de pago de un usuario.
     * 
     * @param userId ID del usuario
     * @return Lista de métodos de pago
     */
    @Transactional(readOnly = true)
    public List<PaymentMethodResponse> execute(UUID userId) {
        log.debug("Obteniendo métodos de pago para usuario: {}", userId);

        List<PaymentMethod> paymentMethods = paymentMethodRepository.findByUserId(userId);

        log.info("Encontrados {} métodos de pago para usuario: {}", paymentMethods.size(), userId);

        return mapper.toPaymentMethodResponseList(paymentMethods);
    }
}
