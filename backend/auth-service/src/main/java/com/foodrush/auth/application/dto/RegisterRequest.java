package com.foodrush.auth.application.dto;

import com.foodrush.auth.domain.model.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String fullName;
    private Role role;
}
