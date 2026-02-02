package com.foodrush.courier.application.usecase;

import com.foodrush.courier.application.dto.response.ShiftResponse;
import com.foodrush.courier.domain.exception.CourierNotFoundException;
import com.foodrush.courier.domain.model.Courier;
import com.foodrush.courier.domain.model.CourierShift;
import com.foodrush.courier.domain.repository.CourierRepository;
import com.foodrush.courier.domain.repository.CourierShiftRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Use Case: Iniciar turno (Clock In)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class StartShiftUseCase {

    private final CourierRepository courierRepository;
    private final CourierShiftRepository shiftRepository;

    @Transactional
    public ShiftResponse execute(UUID courierId) {
        log.info("Starting shift for courier {}", courierId);

        // 1. Verificar courier
        Courier courier = courierRepository.findById(courierId)
                .orElseThrow(() -> new CourierNotFoundException(courierId));

        // 2. Verificar si ya tiene turno activo
        if (shiftRepository.findActiveShiftByCourier(courier).isPresent()) {
            throw new IllegalStateException("Courier already has an active shift");
        }

        // 3. Crear nuevo turno
        CourierShift shift = CourierShift.builder()
                .courier(courier)
                .clockInAt(LocalDateTime.now())
                .totalDeliveries(0)
                .totalEarnings(BigDecimal.ZERO)
                .totalDistanceKm(0.0)
                .build();

        // 4. Actualizar estado del courier a AVAILABLE
        courier.goOnline();
        courierRepository.save(courier);

        // 5. Guardar turno
        CourierShift savedShift = shiftRepository.save(shift);

        log.info("Shift started for courier {}: {}", courierId, savedShift.getId());

        return mapToResponse(savedShift);
    }

    private ShiftResponse mapToResponse(CourierShift shift) {
        return ShiftResponse.builder()
                .id(shift.getId())
                .courierId(shift.getCourier().getId())
                .startTime(shift.getClockInAt())
                .endTime(shift.getClockOutAt())
                .totalDeliveries(shift.getTotalDeliveries())
                .totalEarnings(shift.getTotalEarnings())
                .totalDistanceKm(shift.getTotalDistanceKm())
                .active(shift.getClockOutAt() == null)
                .build();
    }
}
