package com.foodrush.courier.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO de respuesta para ubicación del courier
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocationResponse {

    private UUID id;
    private UUID courierId;
    private Double latitude;
    private Double longitude;
    private LocalDateTime timestamp;
    private Double accuracy;
    private Double speed;
}
