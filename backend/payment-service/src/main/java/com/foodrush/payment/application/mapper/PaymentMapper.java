package com.foodrush.payment.application.mapper;

import com.foodrush.payment.application.dto.request.CreatePaymentMethodRequest;
import com.foodrush.payment.application.dto.response.PaymentMethodResponse;
import com.foodrush.payment.application.dto.response.TransactionResponse;
import com.foodrush.payment.domain.model.PaymentMethod;
import com.foodrush.payment.domain.model.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

/**
 * Mapper para convertir entre entidades de dominio y DTOs.
 * 
 * <p>
 * MapStruct genera automáticamente la implementación en tiempo de compilación.
 * </p>
 */
@Mapper(componentModel = "spring")
public interface PaymentMapper {

    /**
     * Convierte Transaction a TransactionResponse.
     */
    TransactionResponse toTransactionResponse(Transaction transaction);

    /**
     * Convierte lista de Transaction a lista de TransactionResponse.
     */
    List<TransactionResponse> toTransactionResponseList(List<Transaction> transactions);

    /**
     * Convierte CreatePaymentMethodRequest a PaymentMethod.
     * El token NO se expone en el response por seguridad.
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    PaymentMethod toPaymentMethod(CreatePaymentMethodRequest request);

    /**
     * Convierte PaymentMethod a PaymentMethodResponse.
     * IMPORTANTE: El token NO se incluye en el response por seguridad PCI DSS.
     */
    @Mapping(target = "id", source = "id")
    @Mapping(target = "userId", source = "userId")
    @Mapping(target = "type", source = "type")
    @Mapping(target = "maskedNumber", source = "maskedNumber")
    @Mapping(target = "provider", source = "provider")
    @Mapping(target = "isDefault", source = "isDefault")
    @Mapping(target = "createdAt", source = "createdAt")
    PaymentMethodResponse toPaymentMethodResponse(PaymentMethod paymentMethod);

    /**
     * Convierte lista de PaymentMethod a lista de PaymentMethodResponse.
     */
    List<PaymentMethodResponse> toPaymentMethodResponseList(List<PaymentMethod> paymentMethods);
}
