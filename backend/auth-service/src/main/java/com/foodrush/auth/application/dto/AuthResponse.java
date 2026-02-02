package com.foodrush.auth.application.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String type; // Bearer
    private String role;
}
