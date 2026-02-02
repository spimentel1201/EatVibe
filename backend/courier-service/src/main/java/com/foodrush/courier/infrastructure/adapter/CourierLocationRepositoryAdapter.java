package com.foodrush.courier.infrastructure.adapter;

import com.foodrush.courier.domain.model.Courier;
import com.foodrush.courier.domain.model.CourierLocation;
import com.foodrush.courier.domain.repository.CourierLocationRepository;
import com.foodrush.courier.infrastructure.persistence.CourierLocationJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Adapter que implementa CourierLocationRepository usando JPA
 */
@Component
@RequiredArgsConstructor
public class CourierLocationRepositoryAdapter implements CourierLocationRepository {

    private final CourierLocationJpaRepository jpaRepository;

    @Override
    public CourierLocation save(CourierLocation location) {
        return jpaRepository.save(location);
    }

    @Override
    public Optional<CourierLocation> findById(UUID id) {
        return jpaRepository.findById(id);
    }

    @Override
    public Optional<CourierLocation> findLatestByCourier(Courier courier) {
        return jpaRepository.findLatestByCourier(courier);
    }

    @Override
    public List<CourierLocation> findByCourierOrderByTimestampDesc(Courier courier) {
        return jpaRepository.findByCourierOrderByTimestampDesc(courier);
    }

    @Override
    public List<CourierLocation> findRecentByCourier(Courier courier, int hours) {
        LocalDateTime since = LocalDateTime.now().minusHours(hours);
        return jpaRepository.findRecentByCourier(courier, since);
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }
}
