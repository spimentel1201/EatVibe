package main.java.com.foodrush.restaurant.application.usecase;

import com.foodrush.restaurant.domain.exception.RestaurantNotFoundException;
import com.foodrush.restaurant.domain.model.Restaurant;
import com.foodrush.restaurant.domain.model.RestaurantStatus;
import com.foodrush.restaurant.domain.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UpdateRestaurantStatusUseCase {

    private final RestaurantRepository restaurantRepository;

    @Transactional
    public void execute(UUID restaurantId, RestaurantStatus newStatus) {
        log.info("Updating restaurant {} status to: {}", restaurantId, newStatus);

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RestaurantNotFoundException(restaurantId));

        switch (newStatus) {
            case OPEN -> restaurant.open();
            case CLOSED -> restaurant.close();
            case BUSY -> restaurant.markAsBusy();
        }

        restaurantRepository.save(restaurant);
        log.info("Restaurant status updated successfully");
    }
}
