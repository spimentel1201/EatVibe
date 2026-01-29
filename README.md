# 🍔 FoodRush - Sistema de Delivery

Sistema de delivery tipo Uber Eats construido con arquitectura de microservicios.

## 📁 Estructura del Proyecto

Este es un **monorepo** que contiene:

```
EatVibe/
├── backend/              # Microservicios Java/Spring Boot
│   ├── api-gateway/
│   ├── auth-service/
│   ├── user-service/
│   ├── restaurant-service/
│   ├── order-service/
│   ├── payment-service/
│   ├── courier-service/
│   ├── notification-service/
│   ├── config-server/
│   └── eureka-server/
├── mobile/               # Aplicación móvil (React Native/Flutter)
├── web/                  # Aplicación web (React/Next.js)
├── docker/               # Configuraciones Docker
└── .docs/                # Documentación técnica (privada)
```

## 🚀 Stack Tecnológico

### Backend
- **Lenguaje:** Java 17 LTS
- **Framework:** Spring Boot 3.2
- **Base de Datos:** PostgreSQL 15 + PostGIS
- **Caché:** Redis 7.x
- **Message Broker:** Apache Kafka 3.6.x
- **Service Discovery:** Netflix Eureka
- **API Gateway:** Spring Cloud Gateway
- **Documentación:** Swagger/OpenAPI

### Frontend Web
- React/Next.js
- TypeScript
- TailwindCSS

### Mobile
- React Native / Flutter
- Expo (si se usa React Native)

## 🏗️ Arquitectura

El sistema sigue una arquitectura de microservicios con los siguientes servicios:

| Servicio | Puerto | Responsabilidad |
|----------|--------|-----------------|
| api-gateway | 8080 | Enrutamiento, Rate Limiting, Autenticación |
| auth-service | 8081 | JWT, OAuth2, Gestión de tokens |
| user-service | 8082 | Usuarios, Direcciones, Perfiles |
| restaurant-service | 8083 | Catálogo, Menús, Horarios, Stock |
| order-service | 8084 | Pedidos, Carrito, Máquina de Estados |
| payment-service | 8085 | Procesamiento de pagos, Reembolsos |
| courier-service | 8086 | Repartidores, Asignación, Geolocalización |
| notification-service | 8087 | Push, SMS, Email, WebSocket |
| config-server | 8888 | Configuración centralizada |
| eureka-server | 8761 | Service Discovery |

## 🛠️ Desarrollo

### Prerrequisitos

- Java 17+
- Docker & Docker Compose
- Node.js 18+ (para frontend/mobile)
- PostgreSQL 15
- Redis 7
- Apache Kafka 3.6

### Configuración Local

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd EatVibe
   ```

2. **Levantar infraestructura con Docker**
   ```bash
   cd docker
   docker-compose up -d
   ```

3. **Ejecutar microservicios**
   ```bash
   cd backend/restaurant-service
   ./gradlew bootRun
   ```

4. **Ejecutar frontend**
   ```bash
   cd web
   npm install
   npm run dev
   ```

## 📚 Documentación

La documentación técnica completa se encuentra en la carpeta `.docs/` (privada):
- `technic_specs.md` - Especificaciones técnicas
- `development_plan.md` - Plan de desarrollo
- `schema.sql` - Esquema de base de datos

### Swagger UI

Cada microservicio expone su documentación API en:
```
http://localhost:{puerto}/swagger-ui.html
```

Ejemplo: http://localhost:8083/swagger-ui.html (Restaurant Service)

## 🧪 Testing

```bash
# Backend - Tests unitarios
cd backend/restaurant-service
./gradlew test

# Backend - Reporte de cobertura
./gradlew jacocoTestReport

# Frontend
cd web
npm test
```

## 🌿 Estrategia de Ramas

- `main` - Rama principal (producción)
- `develop` - Rama de desarrollo
- `feature/*` - Nuevas funcionalidades
- `bugfix/*` - Corrección de bugs
- `hotfix/*` - Correcciones urgentes en producción

## 📝 Convenciones de Código

### Backend (Java)
- **Idioma:** Código en INGLÉS, comentarios y documentación en ESPAÑOL
- **Nomenclatura:**
  - Clases: `PascalCase`
  - Métodos/Variables: `camelCase`
  - Constantes: `UPPER_SNAKE_CASE`
- **Arquitectura:** Hexagonal (Ports & Adapters)
- **Principios:** SOLID, Clean Code

### Frontend
- TypeScript estricto
- Componentes funcionales con Hooks
- CSS Modules o TailwindCSS

## 📄 Licencia

[Especificar licencia]

## 👥 Equipo

[Información del equipo]

---

**Versión:** 1.0.0  
**Última actualización:** Enero 2026