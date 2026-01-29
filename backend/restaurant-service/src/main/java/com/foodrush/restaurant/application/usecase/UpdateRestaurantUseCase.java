package com.foodrush.restaurant.application.usecase;

import com.foodrush.restaurant.application.dto.request.UpdateRestaurantRequest;
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
public class UpdateRestaurantUseCase {

    private final RestaurantRepository restaurantRepository;
    private final RestaurantMapper restaurantMapper;

    @Transactional
    public RestaurantResponse execute(UUID restaurantId, UpdateRestaurantRequest request) {
        log.info("Updating restaurant with ID: {}", restaurantId);

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RestaurantNotFoundException(restaurantId));

        restaurantMapper.updateEntityFromRequest(request, restaurant);
        Restaurant updatedRestaurant = restaurantRepository.save(restaurant);

        log.info("Restaurant updated successfully: {}", restaurantId);
        return restaurantMapper.toResponse(updatedRestaurant);
    }
}
