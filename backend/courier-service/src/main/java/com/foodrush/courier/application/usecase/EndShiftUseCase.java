package com.foodrush.courier.application.usecase;

import com.foodrush.courier.application.dto.response.ShiftResponse;
import com.foodrush.courier.domain.exception.CourierNotFoundException;
import com.foodrush.courier.domain.model.Courier;
import com.foodrush.courier.domain.model.CourierShift;
import com.foodrush.courier.domain.model.CourierStatus;
import com.foodrush.courier.domain.repository.CourierRepository;
import com.foodrush.courier.domain.repository.CourierShiftRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Use Case: Finalizar turno (Clock Out)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EndShiftUseCase {

    private final CourierRepository courierRepository;
    private final CourierShiftRepository shiftRepository;

    @Transactional
    public ShiftResponse execute(UUID courierId) {
        log.info("Ending shift for courier {}", courierId);

        // 1. Verificar courier
        Courier courier = courierRepository.findById(courierId)
                .orElseThrow(() -> new CourierNotFoundException(courierId));

        // 2. Verificar que no tenga entregas activas
        if (courier.getStatus() == CourierStatus.ON_DELIVERY || courier.getStatus() == CourierStatus.BUSY) {
            throw new IllegalStateException("Cannot end shift while having active deliveries");
        }

        // 3. Buscar turno activo
        CourierShift shift = shiftRepository.findActiveShiftByCourier(courier)
                .orElseThrow(() -> new IllegalStateException("No active shift found for courier"));

        // 4. Cerrar turno
        shift.clockOut();

        // 5. Actualizar estado del courier a OFFLINE
        courier.goOffline();
        courierRepository.save(courier);

        // 6. Guardar turno
        CourierShift savedShift = shiftRepository.save(shift);

        log.info("Shift ended for courier {}: {}", courierId, savedShift.getId());

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
