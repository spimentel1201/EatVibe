package main.java.com.foodrush.restaurant.infrastructure.persistence.adapter;

import main.java.com.foodrush.restaurant.domain.model.Category;
import main.java.com.foodrush.restaurant.domain.repository.CategoryRepository;
import main.java.com.foodrush.restaurant.infrastructure.persistence.repository.CategoryJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CategoryRepositoryAdapter implements CategoryRepository {

    private final CategoryJpaRepository jpaRepository;

    @Override
    public Category save(Category category) {
        return jpaRepository.save(category);
    }

    @Override
    public Optional<Category> findById(UUID id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<Category> findByRestaurantId(UUID restaurantId) {
        return jpaRepository.findByRestaurantId(restaurantId);
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }
}
