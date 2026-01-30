package com.foodrush.courier.infrastructure.persistence;

import com.foodrush.courier.domain.model.Courier;
import com.foodrush.courier.domain.model.CourierStatus;
import org.locationtech.jts.geom.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * JPA Repository para Courier con queries espaciales PostGIS
 */
@Repository
public interface CourierJpaRepository extends JpaRepository<Courier, UUID> {

    Optional<Courier> findByEmail(String email);

    Optional<Courier> findByPhone(String phone);

    List<Courier> findByStatus(CourierStatus status);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    /**
     * Encuentra couriers disponibles dentro de un radio específico usando PostGIS
     * 
     * Query espacial que:
     * 1. Obtiene la última ubicación de cada courier
     * 2. Calcula la distancia usando ST_Distance con geography
     * 3. Filtra por status AVAILABLE
     * 4. Filtra por distancia dentro del radio
     * 5. Ordena por distancia ascendente
     * 
     * @param latitude     Latitud del punto central
     * @param longitude    Longitud del punto central
     * @param radiusMeters Radio de búsqueda en metros
     * @return Lista de couriers disponibles ordenados por distancia
     */
    @Query(value = """
            WITH latest_locations AS (
                SELECT DISTINCT ON (courier_id)
                    courier_id,
                    location,
                    timestamp
                FROM courier_locations
                ORDER BY courier_id, timestamp DESC
            )
            SELECT c.*
            FROM couriers c
            INNER JOIN latest_locations ll ON ll.courier_id = c.id
            WHERE c.status = 'AVAILABLE'
              AND ST_DWithin(
                  ll.location::geography,
                  ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
                  :radiusMeters
              )
            ORDER BY ST_Distance(
                ll.location::geography,
                ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
            ) ASC
            """, nativeQuery = true)
    List<Courier> findAvailableWithinRadius(
            @Param("latitude") double latitude,
            @Param("longitude") double longitude,
            @Param("radiusMeters") double radiusMeters);
}
