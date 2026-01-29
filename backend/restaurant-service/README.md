# Restaurant Service

Microservicio de gestión de restaurantes, catálogo y menús.

## Responsabilidades

- Gestión de restaurantes (CRUD)
- Catálogo de menús y categorías
- Control de disponibilidad de items
- Gestión de horarios de operación
- Búsqueda y filtrado de restaurantes

## Puerto

8083

## Base de Datos

`restaurant_db` (PostgreSQL + PostGIS)

## Arquitectura

Sigue arquitectura hexagonal con las siguientes capas:
- **Domain**: Entidades, repositorios (interfaces), excepciones
- **Application**: Casos de uso, DTOs, mappers
- **Infrastructure**: Adaptadores JPA, configuración
- **API**: Controladores REST, exception handlers

## Endpoints Principales

- `POST /api/v1/restaurants` - Crear restaurante
- `GET /api/v1/restaurants/{id}` - Obtener restaurante
- `PUT /api/v1/restaurants/{id}` - Actualizar restaurante
- `DELETE /api/v1/restaurants/{id}` - Eliminar restaurante
- `POST /api/v1/restaurants/{id}/menu-items` - Agregar item al menú
- `PATCH /api/v1/restaurants/{id}/menu-items/{itemId}` - Actualizar disponibilidad

## Ejecutar

```bash
./gradlew :restaurant-service:bootRun
```

## Tests

```bash
./gradlew :restaurant-service:test
```

## Swagger UI

http://localhost:8083/swagger-ui.html
