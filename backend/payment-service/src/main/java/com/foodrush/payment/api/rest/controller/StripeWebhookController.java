package com.foodrush.payment.api.rest.controller;

import com.foodrush.payment.domain.event.PaymentCompletedEvent;
import com.foodrush.payment.domain.model.Transaction;
import com.foodrush.payment.domain.repository.TransactionRepository;
import com.foodrush.payment.infrastructure.messaging.PaymentEventProducer;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments/webhook")
@RequiredArgsConstructor
@Slf4j
public class StripeWebhookController {

    @Value("${payment.stripe.webhook-secret}")
    private String endpointSecret;

    private final TransactionRepository transactionRepository;
    private final PaymentEventProducer eventProducer;

    @PostMapping
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        if (endpointSecret == null) {
            log.error("Stripe Webhook Secret is not configured");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (Exception e) {
            log.warn("Webhook signature verification failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Signature");
        }

        if ("payment_intent.succeeded".equals(event.getType())) {
            PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer().getObject().orElse(null);

            if (paymentIntent != null && paymentIntent.getMetadata().containsKey("orderId")) {
                handlePaymentSuccess(paymentIntent);
            }
        }

        return ResponseEntity.ok("Received");
    }

    private void handlePaymentSuccess(PaymentIntent paymentIntent) {
        String orderIdStr = paymentIntent.getMetadata().get("orderId");
        String transactionIdStr = paymentIntent.getMetadata().get("transactionId"); // Optional if we sent it

        log.info("Payment succeeded for Order: {}", orderIdStr);

        try {
            UUID orderId = UUID.fromString(orderIdStr);
            // Find transaction by Order ID logic (or Transaction ID if available)
            // Assuming 1 active transaction per order for simplicity, or find the PENDING
            // one
            transactionRepository.findByOrderId(orderId).stream()
                    .filter(t -> "PENDING".equals(t.getStatus().name()))
                    .findFirst()
                    .ifPresent(transaction -> {
                        transaction.markAsCompleted(paymentIntent.getId());
                        transactionRepository.save(transaction);

                        // Publish event
                        PaymentCompletedEvent event = PaymentCompletedEvent.create(
                                transaction.getId(),
                                transaction.getOrderId(),
                                transaction.getUserId(),
                                transaction.getAmount(),
                                transaction.getCurrency(),
                                transaction.getProvider(),
                                transaction.getExternalTransactionId());
                        eventProducer.publishPaymentCompleted(event);

                        log.info("Transaction {} completed via Webhook", transaction.getId());
                    });

        } catch (Exception e) {
            log.error("Error processing payment success webhook for order {}", orderIdStr, e);
        }
    }
}
