package com.foodrush.restaurant.domain.repository;

import main.java.com.foodrush.restaurant.domain.model.MenuItem;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MenuItemRepository {

    MenuItem save(MenuItem menuItem);

    Optional<MenuItem> findById(UUID id);

    List<MenuItem> findByCategoryId(UUID categoryId);

    void deleteById(UUID id);
}
