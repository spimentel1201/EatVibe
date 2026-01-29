package com.foodrush.restaurant.application.usecase;

import com.foodrush.restaurant.application.dto.response.RestaurantResponse;
import com.foodrush.restaurant.application.mapper.RestaurantMapper;
import com.foodrush.restaurant.domain.model.Restaurant;
import com.foodrush.restaurant.domain.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class GetAllRestaurantsUseCase {

    private final RestaurantRepository restaurantRepository;
    private final RestaurantMapper restaurantMapper;

    @Transactional(readOnly = true)
    public List<RestaurantResponse> execute() {
        log.info("Fetching all restaurants");

        List<Restaurant> restaurants = restaurantRepository.findAll();

        log.info("Found {} restaurants", restaurants.size());
        return restaurantMapper.toResponseList(restaurants);
    }
}
