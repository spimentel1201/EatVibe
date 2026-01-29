package main.java.com.foodrush.restaurant.application.usecase;

import com.foodrush.restaurant.domain.exception.RestaurantNotFoundException;
import com.foodrush.restaurant.domain.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeleteRestaurantUseCase {

    private final RestaurantRepository restaurantRepository;

    @Transactional
    public void execute(UUID restaurantId) {
        log.info("Deleting restaurant with ID: {}", restaurantId);

        if (!restaurantRepository.findById(restaurantId).isPresent()) {
            throw new RestaurantNotFoundException(restaurantId);
        }

        restaurantRepository.deleteById(restaurantId);
        log.info("Restaurant deleted successfully: {}", restaurantId);
    }
}
