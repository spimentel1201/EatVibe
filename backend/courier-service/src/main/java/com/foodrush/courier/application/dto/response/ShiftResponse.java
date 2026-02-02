package com.foodrush.courier.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShiftResponse {

    private UUID id;
    private UUID courierId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer totalDeliveries;
    private BigDecimal totalEarnings;
    private Double totalDistanceKm;
    private boolean active;
}
