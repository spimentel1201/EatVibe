package com.foodrush.gateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @RequestMapping("/payment")
    public ResponseEntity<Map<String, Object>> paymentServiceFallback() {
        Map<String, Object> response = new HashMap<>();
        response.put("code", "SERVICE_UNAVAILABLE");
        response.put("message", "Payment Service is currently unavailable. Please try again later.");
        response.put("timestamp", Instant.now());

        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
    }
}
