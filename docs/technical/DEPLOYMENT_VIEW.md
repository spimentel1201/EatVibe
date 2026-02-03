# Vista de Despliegue - FoodRush

## Infraestructura Local con Docker Compose

El entorno de ejecución local utiliza contenedores Docker orquestados. Todos los servicios comparten una red interna `foodrush-network` para comunicación DNS.

```mermaid
graph TD
    subgraph "Docker Host (Developer Machine)"
        
        subgraph "Data Layer"
            PG[PostgreSQL 15<br/>Port: 5432]
            Redis[Redis<br/>Cache]
        end
        
        subgraph "Messaging Layer"
            ZK[Zookeeper]
            Kafka[Kafka Broker<br/>Port: 9092]
            ZK --- Kafka
        end
        
        subgraph "Microservices Layer"
            Auth[Auth Service<br/>Port: 8088]
            Order[Order Service<br/>Port: 8081]
            Rest[Restaurant Service<br/>Port: 8082]
            Cour[Courier Service<br/>Port: 8086]
            Pay[Payment Service<br/>Port: 8085]
        end
        
        subgraph "Entry Point"
            Gate[API Gateway<br/>Port: 8080]
        end
    end
    
    Internet((Internet)) --> Gate
    Gate --> Auth
    Gate --> Order
    Gate --> Rest
    Gate --> Cour
    Gate --> Pay
    
    Auth -.-> PG
    Order -.-> PG
    Rest -.-> PG
    Cour -.-> PG
    Pay -.-> PG
    
    Order -.-> Kafka
    Cour -.-> Kafka
    Pay -.-> Kafka
```

## Requisitos de Hardware
*   **CPU:** Mínimo 4 Núcleos (para levantar todos los microservicios JVM).
*   **RAM:** Mínimo 8GB, recomendado 16GB.
*   **Espacio e Disco:** ~2GB (Imágenes Docker + Volúmenes DB).

## Variables de Entorno Clave
Cada servicio se configura mediante `spring.profiles.active=docker` cuando corre en contenedor.

| Servicio | Variable | Propósito |
| :--- | :--- | :--- |
| Gateway | `AUTH_SERVICE_URI` | URL del servicio de autenticación para validación |
| Todos | `DB_HOST` | Host de la base de datos (nombre de servicio docker) |
| Todos | `KAFKA_BOOTSTRAP_SERVERS` | `kafka:9092` |
