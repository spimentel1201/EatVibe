package com.foodrush.restaurant.domain.repository;

import com.foodrush.restaurant.domain.model.Restaurant;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RestaurantRepository {

    Restaurant save(Restaurant restaurant);

    Optional<Restaurant> findById(UUID id);

    Optional<Restaurant> findByName(String name);

    boolean existsByName(String name);

    List<Restaurant> findAll();

    void deleteById(UUID id);
}
