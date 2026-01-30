package com.foodrush.payment.application.usecase;

import com.foodrush.payment.application.dto.request.CreatePaymentMethodRequest;
import com.foodrush.payment.application.dto.response.PaymentMethodResponse;
import com.foodrush.payment.application.mapper.PaymentMapper;
import com.foodrush.payment.domain.model.PaymentMethod;
import com.foodrush.payment.domain.repository.PaymentMethodRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Caso de uso para crear un método de pago.
 * 
 * <p>
 * Si se marca como predeterminado, desmarca todos los demás
 * métodos del usuario.
 * </p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CreatePaymentMethodUseCase {

    private final PaymentMethodRepository paymentMethodRepository;
    private final PaymentMapper mapper;

    /**
     * Crea un nuevo método de pago.
     * 
     * @param request Datos del método de pago
     * @return Método de pago creado
     */
    @Transactional
    public PaymentMethodResponse execute(CreatePaymentMethodRequest request) {
        log.info("Creando método de pago para usuario: {}, Tipo: {}, Provider: {}",
                request.userId(), request.type(), request.provider());

        // Si se marca como predeterminado, desmarcar los demás
        if (Boolean.TRUE.equals(request.isDefault())) {
            log.debug("Desmarcando métodos de pago anteriores como predeterminados");
            paymentMethodRepository.unmarkAllAsDefaultForUser(request.userId());
        }

        // Crear método de pago
        PaymentMethod paymentMethod = mapper.toPaymentMethod(request);
        paymentMethod = paymentMethodRepository.save(paymentMethod);

        log.info("Método de pago creado con ID: {}", paymentMethod.getId());

        return mapper.toPaymentMethodResponse(paymentMethod);
    }
}
