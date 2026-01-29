package com.foodrush.restaurant.infrastructure.persistence.adapter;

import main.java.com.foodrush.restaurant.domain.model.Restaurant;
import main.java.com.foodrush.restaurant.domain.repository.RestaurantRepository;
import main.java.com.foodrush.restaurant.infrastructure.persistence.repository.RestaurantJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class RestaurantRepositoryAdapter implements RestaurantRepository {

    private final RestaurantJpaRepository jpaRepository;

    @Override
    public Restaurant save(Restaurant restaurant) {
        return jpaRepository.save(restaurant);
    }

    @Override
    public Optional<Restaurant> findById(UUID id) {
        return jpaRepository.findById(id);
    }

    @Override
    public Optional<Restaurant> findByName(String name) {
        return jpaRepository.findByName(name);
    }

    @Override
    public boolean existsByName(String name) {
        return jpaRepository.existsByName(name);
    }

    @Override
    public List<Restaurant> findAll() {
        return jpaRepository.findAll();
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }
}
