package com.foodrush.restaurant.infrastructure.persistence.adapter;

import com.foodrush.restaurant.domain.model.MenuItem;
import com.foodrush.restaurant.domain.repository.MenuItemRepository;
import com.foodrush.restaurant.infrastructure.persistence.repository.MenuItemJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class MenuItemRepositoryAdapter implements MenuItemRepository {

    private final MenuItemJpaRepository jpaRepository;

    @Override
    public MenuItem save(MenuItem menuItem) {
        return jpaRepository.save(menuItem);
    }

    @Override
    public Optional<MenuItem> findById(UUID id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<MenuItem> findByCategoryId(UUID categoryId) {
        return jpaRepository.findByCategoryId(categoryId);
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }
}
