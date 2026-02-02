package com.foodrush.courier.domain.service;

import com.foodrush.courier.domain.model.VehicleType;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * Servicio de dominio para cálculo de ganancias
 */
@Service
public class EarningsService {

    private static final BigDecimal BASE_FEE = new BigDecimal("2.00");
    private static final BigDecimal RATE_PER_KM = new BigDecimal("0.50");

    /**
     * Calcula la ganancia por entrega
     * Fórmula: Base + (Distancia * Rate)
     * Adicional: Bonus por vehículo (ej: Bici +0.5, Moto +1.0)
     */
    public BigDecimal calculateDeliveryEarnings(double distanceKm, VehicleType vehicleType) {
        BigDecimal distanceFee = RATE_PER_KM.multiply(BigDecimal.valueOf(distanceKm));
        BigDecimal earnings = BASE_FEE.add(distanceFee);

        // Bonus por vehículo (opcional, para incentivar ciertos vehículos o cubrir
        // costos)
        if (vehicleType == VehicleType.MOTORCYCLE) {
            earnings = earnings.add(new BigDecimal("0.50")); // Gasolina
        } else if (vehicleType == VehicleType.CAR) {
            earnings = earnings.add(new BigDecimal("1.00")); // Gasolina + Mantenimiento
        }

        return earnings;
    }
}
