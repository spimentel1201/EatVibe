package com.foodrush.restaurant.domain.repository;

import main.java.com.foodrush.restaurant.domain.model.Category;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository {

    Category save(Category category);

    Optional<Category> findById(UUID id);

    List<Category> findByRestaurantId(UUID restaurantId);

    void deleteById(UUID id);
}
