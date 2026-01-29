package com.foodrush.order.domain.model;

import com.foodrush.order.domain.exception.InvalidOrderStateTransitionException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static com.foodrush.order.domain.model.OrderStatus.*;
import static org.assertj.core.api.Assertions.*;

/**
 * Tests unitarios para OrderStateMachine.
 */
@DisplayName("OrderStateMachine - Validación de Transiciones")
class OrderStateMachineTest {

    private OrderStateMachine stateMachine;

    @BeforeEach
    void setUp() {
        stateMachine = new OrderStateMachine();
    }

    @Test
    @DisplayName("Debe permitir transición válida: CREATED → PAYMENT_PENDING")
    void shouldAllowValidTransition_CreatedToPaymentPending() {
        assertThatNoException()
                .isThrownBy(() -> stateMachine.validateTransition(CREATED, PAYMENT_PENDING));
    }

    @Test
    @DisplayName("Debe permitir transición válida: PAYMENT_PENDING → PAYMENT_CONFIRMED")
    void shouldAllowValidTransition_PaymentPendingToConfirmed() {
        assertThatNoException()
                .isThrownBy(() -> stateMachine.validateTransition(PAYMENT_PENDING, PAYMENT_CONFIRMED));
    }

    @Test
    @DisplayName("Debe permitir transición válida: PAYMENT_CONFIRMED → ACCEPTED_BY_RESTAURANT")
    void shouldAllowValidTransition_PaymentConfirmedToAccepted() {
        assertThatNoException()
                .isThrownBy(() -> stateMachine.validateTransition(PAYMENT_CONFIRMED, ACCEPTED_BY_RESTAURANT));
    }

    @Test
    @DisplayName("Debe rechazar transición inválida: CREATED → DELIVERED")
    void shouldRejectInvalidTransition_CreatedToDelivered() {
        assertThatThrownBy(() -> stateMachine.validateTransition(CREATED, DELIVERED))
                .isInstanceOf(InvalidOrderStateTransitionException.class)
                .hasMessageContaining("Transición inválida: CREATED → DELIVERED");
    }

    @Test
    @DisplayName("Debe rechazar transición inválida: PREPARING → DELIVERED")
    void shouldRejectInvalidTransition_PreparingToDelivered() {
        assertThatThrownBy(() -> stateMachine.validateTransition(PREPARING, DELIVERED))
                .isInstanceOf(InvalidOrderStateTransitionException.class)
                .hasMessageContaining("Transición inválida");
    }

    @Test
    @DisplayName("Debe permitir cancelación desde CREATED")
    void shouldAllowCancellationFromCreated() {
        assertThatNoException()
                .isThrownBy(() -> stateMachine.validateTransition(CREATED, CANCELLED));
    }

    @Test
    @DisplayName("Debe permitir cancelación desde ACCEPTED_BY_RESTAURANT")
    void shouldAllowCancellationFromAccepted() {
        assertThatNoException()
                .isThrownBy(() -> stateMachine.validateTransition(ACCEPTED_BY_RESTAURANT, CANCELLED));
    }

    @Test
    @DisplayName("Debe validar flujo completo exitoso")
    void shouldValidateCompleteSuccessfulFlow() {
        assertThatNoException().isThrownBy(() -> {
            stateMachine.validateTransition(CREATED, PAYMENT_PENDING);
            stateMachine.validateTransition(PAYMENT_PENDING, PAYMENT_CONFIRMED);
            stateMachine.validateTransition(PAYMENT_CONFIRMED, ACCEPTED_BY_RESTAURANT);
            stateMachine.validateTransition(ACCEPTED_BY_RESTAURANT, PREPARING);
            stateMachine.validateTransition(PREPARING, READY_FOR_PICKUP);
            stateMachine.validateTransition(READY_FOR_PICKUP, COURIER_ASSIGNED);
            stateMachine.validateTransition(COURIER_ASSIGNED, PICKED_UP);
            stateMachine.validateTransition(PICKED_UP, IN_TRANSIT);
            stateMachine.validateTransition(IN_TRANSIT, DELIVERED);
            stateMachine.validateTransition(DELIVERED, COMPLETED);
        });
    }

    @Test
    @DisplayName("Debe retornar true para transición válida con isValidTransition")
    void shouldReturnTrueForValidTransition() {
        boolean isValid = stateMachine.isValidTransition(CREATED, PAYMENT_PENDING);
        assertThat(isValid).isTrue();
    }

    @Test
    @DisplayName("Debe retornar false para transición inválida con isValidTransition")
    void shouldReturnFalseForInvalidTransition() {
        boolean isValid = stateMachine.isValidTransition(CREATED, DELIVERED);
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("Debe obtener transiciones permitidas desde CREATED")
    void shouldGetAllowedTransitionsFromCreated() {
        var allowedTransitions = stateMachine.getAllowedTransitions(CREATED);

        assertThat(allowedTransitions)
                .hasSize(2)
                .contains(PAYMENT_PENDING, CANCELLED);
    }

    @Test
    @DisplayName("Debe lanzar excepción con estados nulos")
    void shouldThrowExceptionWithNullStates() {
        assertThatThrownBy(() -> stateMachine.validateTransition(null, PAYMENT_PENDING))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Los estados no pueden ser nulos");

        assertThatThrownBy(() -> stateMachine.validateTransition(CREATED, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Los estados no pueden ser nulos");
    }
}
