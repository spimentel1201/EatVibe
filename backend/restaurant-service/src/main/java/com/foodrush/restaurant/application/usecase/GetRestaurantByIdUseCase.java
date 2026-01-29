package com.foodrush.restaurant.application.usecase;

import com.foodrush.restaurant.application.dto.response.RestaurantResponse;
import com.foodrush.restaurant.application.mapper.RestaurantMapper;
import com.foodrush.restaurant.domain.exception.RestaurantNotFoundException;
import com.foodrush.restaurant.domain.model.Restaurant;
import com.foodrush.restaurant.domain.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class GetRestaurantByIdUseCase {

    private final RestaurantRepository restaurantRepository;
    private final RestaurantMapper restaurantMapper;

    @Transactional(readOnly = true)
    public RestaurantResponse execute(UUID restaurantId) {
        log.info("Fetching restaurant with ID: {}", restaurantId);

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RestaurantNotFoundException(restaurantId));

        return restaurantMapper.toResponse(restaurant);
    }
}
