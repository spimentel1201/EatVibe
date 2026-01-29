package com.foodrush.restaurant.application.mapper;

import com.foodrush.restaurant.application.dto.request.CreateRestaurantRequest;
import com.foodrush.restaurant.application.dto.request.UpdateRestaurantRequest;
import com.foodrush.restaurant.application.dto.response.CategoryResponse;
import com.foodrush.restaurant.application.dto.response.MenuItemResponse;
import com.foodrush.restaurant.application.dto.response.RestaurantResponse;
import com.foodrush.restaurant.domain.model.Category;
import com.foodrush.restaurant.domain.model.MenuItem;
import com.foodrush.restaurant.domain.model.Restaurant;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RestaurantMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", constant = "CLOSED")
    @Mapping(target = "rating", constant = "5.0")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "categories", ignore = true)
    Restaurant toEntity(CreateRestaurantRequest request);

    RestaurantResponse toResponse(Restaurant restaurant);

    List<RestaurantResponse> toResponseList(List<Restaurant> restaurants);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "ownerUserId", ignore = true)
    @Mapping(target = "rating", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "categories", ignore = true)
    void updateEntityFromRequest(UpdateRestaurantRequest request, @MappingTarget Restaurant restaurant);

    CategoryResponse toCategoryResponse(Category category);

    MenuItemResponse toMenuItemResponse(MenuItem menuItem);
}
