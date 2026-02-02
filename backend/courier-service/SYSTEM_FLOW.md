# Courier Service - System Flow & Database Architecture

## 🎯 Overview

Este documento describe el flujo completo del sistema de repartidores (Courier Service), incluyendo las interacciones entre servicios, el uso de bases de datos, y los flujos de datos en tiempo real.

---

## 🗄️ Database Architecture

### Database: `courier_db`

El Courier Service utiliza PostgreSQL con la extensión **PostGIS** para capacidades geoespaciales.

#### Tablas Principales

```mermaid
erDiagram
    COURIERS ||--o{ COURIER_LOCATIONS : has
    COURIERS ||--o{ DELIVERIES : performs
    COURIERS ||--o{ COURIER_SHIFTS : works
    DELIVERIES ||--|| ORDERS : references
    
    COURIERS {
        uuid id PK
        varchar name
        varchar phone UK
        varchar email UK
        varchar vehicle_type
        varchar status
        decimal rating
        int total_deliveries
        timestamp created_at
        timestamp updated_at
    }
    
    COURIER_LOCATIONS {
        uuid id PK
        uuid courier_id FK
        geometry location "PostGIS Point"
        decimal latitude
        decimal longitude
        timestamp timestamp
        decimal accuracy
        decimal speed
    }
    
    DELIVERIES {
        uuid id PK
        uuid order_id FK
        uuid courier_id FK
        varchar status
        geometry pickup_location "PostGIS Point"
        geometry delivery_location "PostGIS Point"
        varchar delivery_pin
        decimal earnings
        decimal distance
        timestamp assigned_at
        timestamp picked_up_at
        timestamp delivered_at
    }
    
    COURIER_SHIFTS {
        uuid id PK
        uuid courier_id FK
        timestamp clock_in_at
        timestamp clock_out_at
        decimal total_earnings
        int total_deliveries
    }
```

---

### PostGIS Spatial Indexes

```sql
-- Índice espacial para búsquedas geográficas rápidas
CREATE INDEX idx_courier_location_spatial 
ON courier_locations USING GIST(location);

-- Índice para búsquedas temporales
CREATE INDEX idx_courier_location_timestamp 
ON courier_locations(timestamp DESC);
```

**Beneficios:**
- Búsquedas de "couriers en radio de 5km" en < 50ms
- Soporte para queries espaciales complejas
- Cálculos de distancia optimizados

---

## 🔄 Complete System Flow

### End-to-End Delivery Flow

```mermaid
sequenceDiagram
    participant Customer
    participant OrderService
    participant PaymentService
    participant CourierService
    participant Courier
    participant Kafka
    participant WebSocket
    
    Note over Customer,WebSocket: 1. ORDER CREATION
    Customer->>OrderService: Create Order
    OrderService->>PaymentService: Process Payment
    PaymentService-->>Kafka: PaymentCompletedEvent
    
    Note over Customer,WebSocket: 2. COURIER ASSIGNMENT
    Kafka->>CourierService: OrderCreatedEvent
    CourierService->>CourierService: Find Available Couriers (PostGIS)
    CourierService->>CourierService: Run Assignment Algorithm
    CourierService->>Courier: Assign Delivery (Push Notification)
    Courier->>CourierService: Accept Delivery
    CourierService-->>Kafka: DeliveryAssignedEvent
    
    Note over Customer,WebSocket: 3. PICKUP PHASE
    Courier->>CourierService: Update Location (every 5s)
    CourierService-->>WebSocket: Broadcast Location
    WebSocket-->>Customer: Real-time Location Update
    
    Courier->>CourierService: Arrive at Restaurant
    CourierService->>CourierService: Validate Geofence (100m)
    Courier->>CourierService: Mark as PICKED_UP
    CourierService-->>Kafka: DeliveryPickedUpEvent
    
    Note over Customer,WebSocket: 4. DELIVERY PHASE
    Courier->>CourierService: Update Location (continuous)
    CourierService-->>WebSocket: Broadcast Location
    
    Courier->>CourierService: Arrive at Customer
    CourierService->>CourierService: Validate Geofence (100m)
    Customer->>Courier: Provide PIN
    Courier->>CourierService: Mark as DELIVERED (with PIN)
    CourierService->>CourierService: Validate PIN
    CourierService-->>Kafka: DeliveryCompletedEvent
    
    Note over Customer,WebSocket: 5. SETTLEMENT
    CourierService->>CourierService: Calculate Earnings
    CourierService->>CourierService: Update Courier Stats
```

---

## 🗺️ Geolocation Flow

### 1. Location Update Flow

```mermaid
flowchart TD
    A[Courier App] -->|POST /api/v1/couriers/123/location| B[CourierService API]
    B --> C{Throttle Check}
    C -->|< 5s since last update| D[Reject: Too Frequent]
    C -->|> 5s| E[Validate Coordinates]
    E -->|Invalid| F[Reject: Invalid Coords]
    E -->|Valid| G[Create PostGIS Point]
    G --> H[Save to courier_locations]
    H --> I[Publish to Kafka]
    I --> J[Broadcast via WebSocket]
    J --> K[Customer App Receives Update]
    
    style H fill:#90EE90
    style J fill:#87CEEB
```

**Database Operation:**
```sql
INSERT INTO courier_locations (courier_id, location, latitude, longitude, timestamp)
VALUES (
    '123e4567-...',
    ST_SetSRID(ST_MakePoint(-77.0428, -12.0464), 4326),  -- PostGIS Point
    -12.0464,
    -77.0428,
    NOW()
);
```

---

### 2. Courier Assignment Flow

```mermaid
flowchart TD
    A[OrderCreatedEvent] --> B[CourierService Receives Event]
    B --> C[Extract Pickup Location]
    C --> D[Query: Find Available Couriers]
    
    D --> E{PostGIS Query}
    E -->|ST_DWithin| F[Get Couriers within 10km]
    
    F --> G[For Each Courier]
    G --> H[Get Latest Location]
    H --> I[Calculate Distance]
    I --> J[Calculate Score]
    J --> K{Score = Distance*0.7 + Rating*0.3}
    
    K --> L[Sort by Score DESC]
    L --> M[Select Best Courier]
    M --> N[Create Delivery Record]
    N --> O[Update Courier Status to BUSY]
    O --> P[Send Push Notification]
    P --> Q[Publish DeliveryAssignedEvent]
    
    style E fill:#FFD700
    style M fill:#90EE90
```

**PostGIS Query:**
```sql
SELECT c.*, cl.location, cl.latitude, cl.longitude,
       ST_Distance(
           cl.location::geography,
           ST_SetSRID(ST_MakePoint(-77.0428, -12.0464), 4326)::geography
       ) / 1000 as distance_km
FROM couriers c
INNER JOIN LATERAL (
    SELECT * FROM courier_locations
    WHERE courier_id = c.id
    ORDER BY timestamp DESC
    LIMIT 1
) cl ON true
WHERE c.status = 'AVAILABLE'
  AND ST_DWithin(
      cl.location::geography,
      ST_SetSRID(ST_MakePoint(-77.0428, -12.0464), 4326)::geography,
      10000  -- 10km radius
  )
ORDER BY distance_km ASC;
```

---

### 3. Geofencing Validation Flow

```mermaid
flowchart TD
    A[Courier: Mark as PICKED_UP] --> B[Get Courier Current Location]
    B --> C[Get Restaurant Location]
    C --> D{Calculate Distance}
    
    D -->|PostGIS ST_Distance| E{Distance < 100m?}
    E -->|No| F[Reject: Not at Location]
    E -->|Yes| G[Update Delivery Status]
    G --> H[Update picked_up_at timestamp]
    H --> I[Publish Event]
    
    style E fill:#FFD700
    style G fill:#90EE90
    style F fill:#FF6B6B
```

**Geofencing Query:**
```sql
SELECT ST_Distance(
    (SELECT location FROM courier_locations 
     WHERE courier_id = :courierId 
     ORDER BY timestamp DESC LIMIT 1)::geography,
    (SELECT pickup_location FROM deliveries 
     WHERE id = :deliveryId)::geography
) < 100 as is_at_location;
```

---

## 📡 Real-Time Tracking Architecture

### WebSocket Communication Flow

```mermaid
sequenceDiagram
    participant CA as Customer App
    participant WS as WebSocket Server
    participant CS as CourierService
    participant Courier as Courier App
    participant DB as courier_db
    
    Note over CA,DB: CONNECTION PHASE
    CA->>WS: Connect to ws://localhost:8086/ws/courier
    CA->>WS: Subscribe to /topic/delivery/123/location
    WS-->>CA: Subscription Confirmed
    
    Note over CA,DB: LOCATION UPDATE PHASE
    Courier->>CS: POST /api/v1/couriers/456/location
    CS->>DB: INSERT INTO courier_locations
    CS->>WS: Send Location Update
    WS-->>CA: Broadcast Location {lat, lon, timestamp}
    
    Note over CA,DB: CONTINUOUS UPDATES
    loop Every 5 seconds
        Courier->>CS: Update Location
        CS->>DB: Save Location
        CS->>WS: Broadcast
        WS-->>CA: Real-time Update
    end
    
    Note over CA,DB: FALLBACK POLLING
    CA->>CS: GET /api/v1/deliveries/123/location
    CS->>DB: Query Latest Location
    CS-->>CA: Return Location
```

---

## 🔄 Service Interactions

### Microservices Communication

```mermaid
graph TB
    subgraph "Order Service"
        OS[Order Service]
    end
    
    subgraph "Payment Service"
        PS[Payment Service]
    end
    
    subgraph "Courier Service"
        CS[Courier Service]
        CDB[(courier_db<br/>PostGIS)]
    end
    
    subgraph "Notification Service"
        NS[Notification Service]
    end
    
    subgraph "Kafka"
        K1[order-events]
        K2[payment-events]
        K3[courier-events]
        K4[delivery-events]
    end
    
    OS -->|OrderCreatedEvent| K1
    PS -->|PaymentCompletedEvent| K2
    K1 -->|Consume| CS
    K2 -->|Consume| CS
    CS -->|DeliveryAssignedEvent| K3
    CS -->|DeliveryCompletedEvent| K4
    K3 -->|Consume| NS
    K4 -->|Consume| OS
    CS <-->|Read/Write| CDB
    
    style CDB fill:#FFD700
    style CS fill:#90EE90
```

---

## 📊 Data Flow Examples

### Example 1: Complete Delivery Lifecycle

**Initial State:**
```sql
-- Courier is AVAILABLE
SELECT * FROM couriers WHERE id = 'courier-123';
-- status = 'AVAILABLE', total_deliveries = 45, rating = 4.8

-- Latest location
SELECT * FROM courier_locations 
WHERE courier_id = 'courier-123' 
ORDER BY timestamp DESC LIMIT 1;
-- lat = -12.0464, lon = -77.0428, timestamp = 2026-01-30 10:00:00
```

**Step 1: Order Created → Courier Assigned**
```sql
-- New delivery created
INSERT INTO deliveries (id, order_id, status, pickup_location, delivery_location, delivery_pin)
VALUES (
    'delivery-456',
    'order-789',
    'ASSIGNED',
    ST_SetSRID(ST_MakePoint(-77.0428, -12.0464), 4326),  -- Restaurant
    ST_SetSRID(ST_MakePoint(-77.0500, -12.0500), 4326),  -- Customer
    '123456'
);

-- Update courier status
UPDATE couriers 
SET status = 'BUSY' 
WHERE id = 'courier-123';

-- Assign courier to delivery
UPDATE deliveries 
SET courier_id = 'courier-123', assigned_at = NOW() 
WHERE id = 'delivery-456';
```

**Step 2: Courier Updates Location (continuous)**
```sql
-- Every 5 seconds
INSERT INTO courier_locations (courier_id, location, latitude, longitude, timestamp)
VALUES (
    'courier-123',
    ST_SetSRID(ST_MakePoint(-77.0430, -12.0465), 4326),
    -12.0465,
    -77.0430,
    NOW()
);
```

**Step 3: Courier Arrives at Restaurant**
```sql
-- Validate geofence
SELECT ST_Distance(
    ST_SetSRID(ST_MakePoint(-77.0428, -12.0464), 4326)::geography,  -- Restaurant
    (SELECT location FROM courier_locations 
     WHERE courier_id = 'courier-123' 
     ORDER BY timestamp DESC LIMIT 1)::geography
) < 100 as can_pickup;
-- Returns: true

-- Update delivery status
UPDATE deliveries 
SET status = 'PICKED_UP', picked_up_at = NOW() 
WHERE id = 'delivery-456';
```

**Step 4: Courier Delivers Order**
```sql
-- Validate geofence at customer location
SELECT ST_Distance(
    ST_SetSRID(ST_MakePoint(-77.0500, -12.0500), 4326)::geography,  -- Customer
    (SELECT location FROM courier_locations 
     WHERE courier_id = 'courier-123' 
     ORDER BY timestamp DESC LIMIT 1)::geography
) < 100 as can_deliver;
-- Returns: true

-- Validate PIN
SELECT delivery_pin = '123456' as pin_valid 
FROM deliveries 
WHERE id = 'delivery-456';
-- Returns: true

-- Calculate distance
UPDATE deliveries 
SET 
    status = 'DELIVERED',
    delivered_at = NOW(),
    distance = ST_Distance(pickup_location::geography, delivery_location::geography) / 1000,
    earnings = 15.00  -- Base fare + distance
WHERE id = 'delivery-456';

-- Update courier stats
UPDATE couriers 
SET 
    status = 'AVAILABLE',
    total_deliveries = total_deliveries + 1,
    rating = (rating * total_deliveries + 5.0) / (total_deliveries + 1)
WHERE id = 'courier-123';
```

---

## 🎯 Key Database Queries

### 1. Find Nearest Available Couriers

```sql
WITH latest_locations AS (
    SELECT DISTINCT ON (courier_id) 
        courier_id, location, timestamp
    FROM courier_locations
    ORDER BY courier_id, timestamp DESC
)
SELECT 
    c.id,
    c.name,
    c.rating,
    c.vehicle_type,
    ll.location,
    ST_Distance(
        ll.location::geography,
        ST_SetSRID(ST_MakePoint(:pickup_lon, :pickup_lat), 4326)::geography
    ) / 1000 as distance_km
FROM couriers c
INNER JOIN latest_locations ll ON ll.courier_id = c.id
WHERE c.status = 'AVAILABLE'
  AND ST_DWithin(
      ll.location::geography,
      ST_SetSRID(ST_MakePoint(:pickup_lon, :pickup_lat), 4326)::geography,
      10000  -- 10km
  )
ORDER BY distance_km ASC
LIMIT 10;
```

---

### 2. Get Courier Location History

```sql
SELECT 
    latitude,
    longitude,
    timestamp,
    speed,
    ST_AsGeoJSON(location) as geojson
FROM courier_locations
WHERE courier_id = :courier_id
  AND timestamp >= NOW() - INTERVAL '1 hour'
ORDER BY timestamp ASC;
```

---

### 3. Calculate Delivery Statistics

```sql
SELECT 
    c.id,
    c.name,
    COUNT(d.id) as total_deliveries,
    AVG(d.distance) as avg_distance_km,
    SUM(d.earnings) as total_earnings,
    AVG(EXTRACT(EPOCH FROM (d.delivered_at - d.assigned_at)) / 60) as avg_delivery_time_minutes
FROM couriers c
LEFT JOIN deliveries d ON d.courier_id = c.id
WHERE d.status = 'DELIVERED'
  AND d.delivered_at >= CURRENT_DATE
GROUP BY c.id, c.name
ORDER BY total_earnings DESC;
```

---

## 🔐 Security & Performance

### Rate Limiting

**Location Updates:**
- Maximum 1 update per 5 seconds per courier
- Implemented via Redis cache with TTL

```java
@RateLimiter(name = "location-updates", fallbackMethod = "locationUpdateFallback")
public void updateLocation(UUID courierId, LocationUpdateRequest request) {
    // Implementation
}
```

---

### Database Optimization

**Indexes:**
```sql
-- Spatial index (GIST)
CREATE INDEX idx_courier_location_spatial ON courier_locations USING GIST(location);

-- Composite index for courier status queries
CREATE INDEX idx_courier_status_rating ON couriers(status, rating DESC);

-- Temporal index for recent locations
CREATE INDEX idx_location_recent ON courier_locations(courier_id, timestamp DESC);
```

**Partitioning:**
```sql
-- Partition courier_locations by month (for historical data)
CREATE TABLE courier_locations_2026_01 PARTITION OF courier_locations
FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
```

---

## 📈 Monitoring & Observability

### Key Metrics

1. **Geospatial Queries:**
   - Average query time for "find nearby couriers"
   - 95th percentile < 100ms

2. **WebSocket Connections:**
   - Active connections count
   - Message throughput (messages/sec)

3. **Assignment Algorithm:**
   - Time to assign courier
   - Assignment success rate

4. **Database:**
   - PostGIS query performance
   - Index usage statistics
   - Table sizes and growth

---

## 🎯 Summary

### Database Usage

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `couriers` | Courier profiles | Status, rating, vehicle type |
| `courier_locations` | GPS tracking | PostGIS Point, spatial index |
| `deliveries` | Delivery records | Status, earnings, PIN |
| `courier_shifts` | Work sessions | Clock in/out, earnings |

### Service Interactions

1. **Order Service** → Courier Service: Order created
2. **Courier Service** → Notification Service: Delivery assigned
3. **Courier Service** → WebSocket: Real-time location
4. **Courier App** → Courier Service: Location updates

### Data Flow

1. Location updates saved to `courier_locations`
2. PostGIS queries find nearest couriers
3. Assignment algorithm selects best match
4. Delivery lifecycle tracked in `deliveries`
5. Real-time updates via WebSocket
6. Events published to Kafka

---

**Estado:** Listo para implementación 🚀
