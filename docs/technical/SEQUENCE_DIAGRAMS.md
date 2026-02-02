# Diagramas de Secuencia - FoodRush

## 1. Flujo "Happy Path": Pedido Exitoso

Diagrama que muestra la interacción entre el Cliente, y los microservicios principales desde que se crea el pedido hasta que se confirma.

```mermaid
sequenceDiagram
    actor Customer
    participant GTW as API Gateway
    participant ORDER as Order Service
    participant PAY as Payment Service
    participant REST as Restaurant Service
    participant KAFKA as Kafka Broker

    Customer->>GTW: POST /api/v1/orders (Create Order)
    GTW->>ORDER: Create Order (Pending Payment)
    ORDER->>ORDER: Validate & Save (PENDING_PAYMENT)
    ORDER-->>Customer: Returns Order ID

    Customer->>GTW: POST /api/v1/payments (Pay Order)
    GTW->>PAY: Process Payment
    PAY->>PAY: Call Valid Payment Gateway
    PAY-->>GTW: Payment Success
    GTW-->>Customer: 200 OK

    par Async Events
        PAY->>KAFKA: PaymentSuccessEvent
        KAFKA->>ORDER: Consume PaymentSuccess
        ORDER->>ORDER: Update Status -> PAID
        ORDER->>KAFKA: OrderPaidEvent
        
        KAFKA->>REST: Consume OrderPaid
        REST->>REST: Create Restaurant Order ticket
    end
```

## 2. Flujo de Asignación de Repartidor

Como el sistema selecciona un courier automáticamente tras la aceptación del restaurante.

```mermaid
sequenceDiagram
    participant REST as Restaurant Service
    participant KAFKA as Kafka Broker
    participant COUR as Courier Service
    actor Courier

    REST->>KAFKA: OrderReadyForPickupEvent
    KAFKA->>COUR: Consume Event
    COUR->>COUR: Run Assignment Algorithm
    COUR->>COUR: Find Nearest Available Courier
    COUR->>Courier: Send Offer (WebSocket)
    
    Courier->>COUR: Accept Offer (POST /accept)
    COUR->>COUR: Update Delivery -> ASSIGNED
    COUR->>KAFKA: CourierAssignedEvent
    KAFKA->>REST: Notify Restaurant (Courier Coming)
    KAFKA->>ORDER: Update Order -> PREPARING
```
