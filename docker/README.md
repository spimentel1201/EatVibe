# Docker - FoodRush Infrastructure

Configuraciones Docker para infraestructura local y despliegue.

## 🐳 Servicios

- PostgreSQL 15 + PostGIS
- Redis 7.x
- Apache Kafka 3.6.x + Zookeeper
- pgAdmin (opcional)
- RedisInsight (opcional)

## 🚀 Uso

### Levantar toda la infraestructura
```bash
docker-compose up -d
```

### Detener servicios
```bash
docker-compose down
```

### Ver logs
```bash
docker-compose logs -f [servicio]
```

### Limpiar volúmenes
```bash
docker-compose down -v
```

## 📊 Puertos

| Servicio | Puerto |
|----------|--------|
| PostgreSQL | 5432 |
| pgAdmin | 5050 |
| Redis | 6379 |
| RedisInsight | 8001 |
| Kafka | 9092 |
| Zookeeper | 2181 |

## 📝 Configuración

Las configuraciones específicas se encuentran en:
- `docker-compose.yml` - Desarrollo local
- `docker-compose.prod.yml` - Producción
