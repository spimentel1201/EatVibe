package com.foodrush.courier.infrastructure.adapter;

import com.foodrush.courier.domain.model.Courier;
import com.foodrush.courier.domain.model.CourierShift;
import com.foodrush.courier.domain.repository.CourierShiftRepository;
import com.foodrush.courier.infrastructure.persistence.CourierShiftJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CourierShiftRepositoryAdapter implements CourierShiftRepository {

    private final CourierShiftJpaRepository jpaRepository;

    @Override
    public CourierShift save(CourierShift shift) {
        return jpaRepository.save(shift);
    }

    @Override
    public Optional<CourierShift> findById(UUID id) {
        return jpaRepository.findById(id);
    }

    @Override
    public Optional<CourierShift> findActiveShiftByCourier(Courier courier) {
        return jpaRepository.findActiveShiftByCourier(courier);
    }

    @Override
    public List<CourierShift> findCompletedShiftsByCourierAndDateRange(Courier courier, LocalDateTime start,
            LocalDateTime end) {
        return jpaRepository.findCompletedShiftsByCourierAndDateRange(courier, start, end);
    }
}
