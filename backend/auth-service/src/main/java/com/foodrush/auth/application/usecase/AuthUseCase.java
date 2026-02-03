package com.foodrush.auth.application.usecase;

import com.foodrush.auth.application.dto.AuthResponse;
import com.foodrush.auth.application.dto.LoginRequest;
import com.foodrush.auth.application.dto.RegisterRequest;
import com.foodrush.auth.domain.model.User;
import com.foodrush.auth.infrastructure.persistence.UserRepository;
import com.foodrush.auth.infrastructure.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthUseCase {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already active");
        }

        var user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(request.getRole())
                .active(true)
                .build();

        userRepository.save(user);

        var jwtToken = jwtTokenProvider.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .type("Bearer")
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        var jwtToken = jwtTokenProvider.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .type("Bearer")
                .role(user.getRole().name())
                .build();
    }
}
