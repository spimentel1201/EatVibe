# Backend - FoodRush Microservices

Microservicios del sistema FoodRush construidos con Java 17 y Spring Boot 3.2.

## 🏗️ Arquitectura

Arquitectura de microservicios siguiendo patrones:
- **Hexagonal Architecture** (Ports & Adapters)
- **SOLID Principles**
- **Event-Driven Architecture** (Kafka)
- **SAGA Pattern** para transacciones distribuidas
- **CQRS** donde sea necesario

## 📦 Microservicios

### Infraestructura
- `eureka-server` - Service Discovery
- `config-server` - Configuración centralizada
- `api-gateway` - API Gateway con rate limiting

### Servicios de Negocio
- `auth-service` - Autenticación y autorización
- `user-service` - Gestión de usuarios
- `restaurant-service` - Catálogo de restaurantes
- `order-service` - Gestión de pedidos
- `payment-service` - Procesamiento de pagos
- `courier-service` - Logística y repartidores
- `notification-service` - Notificaciones multi-canal

## 🚀 Tecnologías

- Java 17 LTS
- Spring Boot 3.2
- Spring Cloud (Gateway, Config, Eureka)
- Spring Data JPA
- PostgreSQL 15 + PostGIS
- Redis 7.x
- Apache Kafka 3.6.x
- Flyway (Migraciones)
- Lombok
- MapStruct
- JUnit 5 + Mockito
- TestContainers
- Swagger/OpenAPI

## 🛠️ Desarrollo

### Compilar todos los servicios
```bash
./gradlew clean build
```

### Ejecutar un servicio específico
```bash
cd restaurant-service
./gradlew bootRun
```

### Ejecutar tests
```bash
./gradlew test
```

### Generar reporte de cobertura
```bash
./gradlew jacocoTestReport
```

## 📊 Puertos de Servicios

| Servicio | Puerto |
|----------|--------|
| api-gateway | 8080 |
| auth-service | 8081 |
| user-service | 8082 |
| restaurant-service | 8083 |
| order-service | 8084 |
| payment-service | 8085 |
| courier-service | 8086 |
| notification-service | 8087 |
| config-server | 8888 |
| eureka-server | 8761 |

## 📝 Convenciones

- Código en **INGLÉS**
- Comentarios y documentación en **ESPAÑOL**
- Tests obligatorios (mínimo 80% cobertura)
- Swagger/OpenAPI en todos los endpoints
- Inyección de dependencias por constructor
- No magic numbers/strings
