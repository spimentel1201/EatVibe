package main.java.com.foodrush.restaurant.infrastructure.persistence.repository;

import main.java.com.foodrush.restaurant.domain.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RestaurantJpaRepository extends JpaRepository<Restaurant, UUID> {

    Optional<Restaurant> findByName(String name);

    boolean existsByName(String name);
}
