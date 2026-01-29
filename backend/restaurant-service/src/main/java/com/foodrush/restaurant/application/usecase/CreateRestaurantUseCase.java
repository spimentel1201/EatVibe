package main.java.com.foodrush.restaurant.application.usecase;

import com.foodrush.restaurant.application.dto.request.CreateRestaurantRequest;
import com.foodrush.restaurant.application.dto.response.RestaurantResponse;
import com.foodrush.restaurant.application.mapper.RestaurantMapper;
import com.foodrush.restaurant.domain.exception.DuplicateRestaurantNameException;
import com.foodrush.restaurant.domain.model.Restaurant;
import com.foodrush.restaurant.domain.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CreateRestaurantUseCase {

    private final RestaurantRepository restaurantRepository;
    private final RestaurantMapper restaurantMapper;

    @Transactional
    public RestaurantResponse execute(CreateRestaurantRequest request) {
        log.info("Creating restaurant with name: {}", request.getName());

        if (restaurantRepository.existsByName(request.getName())) {
            throw new DuplicateRestaurantNameException(request.getName(), true);
        }

        Restaurant restaurant = restaurantMapper.toEntity(request);
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);

        log.info("Restaurant created successfully with ID: {}", savedRestaurant.getId());
        return restaurantMapper.toResponse(savedRestaurant);
    }
}
