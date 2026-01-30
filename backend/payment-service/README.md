# Payment Service

Microservicio de pagos para FoodRush con soporte para múltiples pasarelas de pago, patrón SAGA y comunicación asíncrona vía Kafka.

## 🚀 Quick Start

### 1. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales
# Mínimo requerido para desarrollo:
# - STRIPE_API_KEY (obtener en https://dashboard.stripe.com/apikeys)
```

### 2. Levantar Infraestructura

```bash
# Desde la raíz del proyecto
cd docker
docker-compose up -d postgres kafka
```

### 3. Ejecutar el Servicio

```bash
# Desde backend/
./gradlew :payment-service:bootRun
```

### 4. Verificar

- **Swagger UI**: http://localhost:8085/swagger-ui.html
- **Health Check**: http://localhost:8085/actuator/health

---

## 📋 Variables de Entorno

### Requeridas para Producción

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `STRIPE_API_KEY` | Clave API de Stripe | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Secret para webhooks | `whsec_...` |
| `DB_URL` | URL de PostgreSQL | `jdbc:postgresql://...` |
| `DB_USERNAME` | Usuario de BD | `foodrush` |
| `DB_PASSWORD` | Contraseña de BD | `***` |
| `KAFKA_BOOTSTRAP_SERVERS` | Servidores Kafka | `localhost:9092` |

### Opcionales (con defaults)

| Variable | Default | Descripción |
|----------|---------|-------------|
| `SERVER_PORT` | `8085` | Puerto del servicio |
| `YAPE_ENABLED` | `true` | Habilitar Yape |
| `YAPE_SIMULATION_MODE` | `true` | Modo simulación Yape |
| `LOG_LEVEL` | `INFO` | Nivel de logs |

---

## 🏗️ Arquitectura

### Hexagonal Architecture (Ports & Adapters)

```
src/main/java/com/foodrush/payment/
├── domain/              # Lógica de negocio pura
├── application/         # Casos de uso
├── infrastructure/      # Adaptadores externos
└── api/                # Controllers REST
```

### Patrones Implementados

- ✅ **Hexagonal Architecture** - Separación de concerns
- ✅ **Strategy Pattern** - Múltiples gateways de pago
- ✅ **SAGA Pattern** - Transacciones distribuidas
- ✅ **Factory Pattern** - Creación de gateways
- ✅ **Event-Driven** - Comunicación asíncrona

---

## 🌐 API Endpoints

### Pagos

```http
POST   /api/v1/payments/process
POST   /api/v1/payments/refund
GET    /api/v1/payments/transactions/{id}
GET    /api/v1/payments/orders/{orderId}/transactions
GET    /api/v1/payments/users/{userId}/transactions
```

### Métodos de Pago

```http
POST   /api/v1/payment-methods
GET    /api/v1/payment-methods/user/{userId}
DELETE /api/v1/payment-methods/{id}
```

Ver documentación completa en Swagger UI.

---

## 🧪 Testing

### Procesar un Pago (Stripe)

```bash
curl -X POST http://localhost:8085/api/v1/payments/process \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "123e4567-e89b-12d3-a456-426614174001",
    "amount": 150.50,
    "currency": "PEN",
    "provider": "STRIPE",
    "paymentMethodToken": "pm_card_visa"
  }'
```

### Procesar un Pago (Yape - Simulado)

```bash
curl -X POST http://localhost:8085/api/v1/payments/process \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "123e4567-e89b-12d3-a456-426614174001",
    "amount": 50.00,
    "currency": "PEN",
    "provider": "YAPE",
    "paymentMethodToken": "yape_token_123"
  }'
```

---

## 🔒 Seguridad

### PCI DSS Compliance

- ✅ Tokens nunca almacenados en texto plano
- ✅ Tokens nunca expuestos en responses
- ✅ Datos sensibles solo en gateways certificados
- ✅ Tokenización vía Stripe/Yape

### Best Practices

- Usa claves **TEST** (`sk_test_...`) en desarrollo
- Usa claves **LIVE** (`sk_live_...`) solo en producción
- Rota credenciales periódicamente
- Nunca commitees el archivo `.env`

---

## 📊 Kafka Events

### Eventos Publicados

| Evento | Topic | Descripción |
|--------|-------|-------------|
| `PaymentCompletedEvent` | `payment-events` | Pago exitoso |
| `PaymentFailedEvent` | `payment-events` | Pago fallido |
| `RefundProcessedEvent` | `refund-events` | Reembolso procesado |

### Eventos Consumidos

| Evento | Topic | Descripción |
|--------|-------|-------------|
| `OrderCreatedEvent` | `order-events` | Pedido creado |

---

## 🎭 SAGA Pattern

### Flujo de Transacción Distribuida

```
1. CreateOrderStep
   ├─ Execute: Crear pedido
   └─ Compensate: Cancelar pedido

2. ReserveStockStep
   ├─ Execute: Reservar inventario
   └─ Compensate: Liberar stock

3. ProcessPaymentStep
   ├─ Execute: Procesar pago
   └─ Compensate: Reembolso automático

4. NotifyCustomerStep
   ├─ Execute: Enviar confirmación
   └─ Compensate: Enviar cancelación
```

Si cualquier paso falla, se ejecutan las compensaciones en orden inverso.

---

## 🛠️ Troubleshooting

### Error: "Could not resolve placeholder 'STRIPE_API_KEY'"

**Solución:** Crear archivo `.env` con las variables requeridas:
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### Error: "Connection refused: localhost:9092"

**Solución:** Levantar Kafka:
```bash
cd docker
docker-compose up -d kafka
```

### Error: "Connection refused: localhost:5432"

**Solución:** Levantar PostgreSQL:
```bash
cd docker
docker-compose up -d postgres
```

---

## 📚 Documentación Adicional

- [Swagger UI](http://localhost:8085/swagger-ui.html) - API Documentation
- [Actuator](http://localhost:8085/actuator) - Monitoring endpoints
- [Stripe Docs](https://stripe.com/docs/api) - Stripe API Reference

---

## 🤝 Contribuir

1. Crear feature branch desde `main`
2. Implementar cambios siguiendo arquitectura hexagonal
3. Agregar tests
4. Crear PR con descripción detallada

---

## 📝 License

Copyright © 2026 FoodRush
