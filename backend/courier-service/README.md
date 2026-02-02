# Courier Service - FoodRush

Microservicio encargado de la gestión de repartidores, asignación de pedidos, seguimiento en tiempo real y cálculo de ganancias.

## 🚀 Tecnologías

*   **Java 17** + **Spring Boot 3**
*   **PostgreSQL** con extensión **PostGIS** (Geolocalización)
*   **Apache Kafka** (Eventos asíncronos)
*   **Spring WebSocket (STOMP)** (Tracking en tiempo real)
*   **Flyway** (Migraciones de base de datos)
*   **Hibernate Spatial**

## 🛠️ Configuración

Este servicio requiere las siguientes variables de entorno o configuración en `application.yml`:

| Variable | Descripción | Valor por Defecto |
| :--- | :--- | :--- |
| `SERVER_PORT` | Puerto del servidor | `8086` |
| `DB_HOST` | Host de base de datos | `localhost` |
| `DB_PORT` | Puerto de base de datos | `5432` |
| `DB_NAME` | Nombre de base de datos | `courier_db` |
| `DB_USERNAME` | Usuario de BD | `postgres` |
| `DB_PASSWORD` | Contraseña de BD | `postgres` |
| `KAFKA_BOOTSTRAP_SERVERS` | Kafka Brokers | `localhost:9092` |

## 🏃‍♂️ Ejecución

### Prerrequisitos
Tener corriendo PostgreSQL (con PostGIS habilitado) y Kafka.

### Comando
```bash
./gradlew :courier-service:bootRun
```

### Tests
```bash
./gradlew :courier-service:test
```

## 📚 Documentación API

La documentación interactiva (Swagger UI) está disponible cuando el servicio está corriendo:

- **Swagger UI:** [http://localhost:8086/swagger-ui.html](http://localhost:8086/swagger-ui.html)
- **OpenAPI JSON:** [http://localhost:8086/v3/api-docs](http://localhost:8086/v3/api-docs)

## 📡 Endpoints Principales

### Courier Management
- `POST /api/v1/couriers` - Registro de courier
- `PATCH /api/v1/couriers/{id}/status` - Actualizar disponibilidad (AVAILABLE, OFFLINE)
- `POST /api/v1/couriers/{id}/location` - Actualizar ubicación

### Shifts & Earnings
- `POST /api/v1/couriers/{id}/shifts/start` - Iniciar turno (Clock In)
- `POST /api/v1/couriers/{id}/shifts/end` - Finalizar turno (Clock Out)

### Tracking (WebSocket)
- Endpoint: `/ws-courier`
- Topic Sustitución: `/topic/orders/{orderId}/track`
