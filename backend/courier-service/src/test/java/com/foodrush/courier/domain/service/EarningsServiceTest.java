package com.foodrush.courier.domain.service;

import com.foodrush.courier.domain.model.VehicleType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class EarningsServiceTest {

    private final EarningsService earningsService = new EarningsService();

    @Test
    @DisplayName("Should calculate base earnings correctly")
    void shouldCalculateBaseEarnings() {
        // Given
        double distance = 10.0; // 10 km
        VehicleType vehicle = VehicleType.BICYCLE;

        // Base $2.00 + (10km * $0.50) + Bonus BICI ($0.00) = $2.00 + $5.00 = $7.00
        // Wait, logic in service:
        // BICYCLE has no bonus in code? Let's check.
        // Step 1630 code:
        // if (MOTORCYCLE) +0.50
        // if (CAR) +1.00
        // BICYCLE is not handled explicitly, so +0.00.

        // When
        BigDecimal earnings = earningsService.calculateDeliveryEarnings(distance, vehicle);

        // Then
        BigDecimal expected = new BigDecimal("7.00");
        assertTrue(expected.compareTo(earnings) == 0,
                "Expected " + expected + " but got " + earnings);
    }

    @ParameterizedTest
    @DisplayName("Should calculate earnings with vehicle bonus")
    @CsvSource({
            "10.0, MOTORCYCLE, 7.50", // 2.0 (base) + 5.0 (dist) + 0.5 (bonus)
            "10.0, CAR, 8.00", // 2.0 (base) + 5.0 (dist) + 1.0 (bonus)
            "5.0,  BICYCLE, 4.50" // 2.0 (base) + 2.5 (dist) + 0.0 (bonus)
    })
    void shouldCalculateEarningsWithBonuses(double distance, VehicleType vehicleType, String expectedAmount) {
        BigDecimal earnings = earningsService.calculateDeliveryEarnings(distance, vehicleType);
        BigDecimal expected = new BigDecimal(expectedAmount);
        assertTrue(expected.compareTo(earnings) == 0,
                "Expected " + expected + " but got " + earnings);
    }
}
