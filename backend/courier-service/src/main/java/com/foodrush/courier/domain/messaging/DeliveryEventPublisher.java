package com.foodrush.courier.domain.messaging;

import com.foodrush.courier.domain.model.Delivery;

public interface DeliveryEventPublisher {
    void publishDeliveryAssigned(Delivery delivery);

    void publishDeliveryPickedUp(Delivery delivery);

    void publishDeliveryCompleted(Delivery delivery);
}
