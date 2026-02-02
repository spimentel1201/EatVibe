# Diseño de Base de Datos - FoodRush

Este documento detalla los esquemas de base de datos de los microservicios principales.

## 1. Restaurant Service (`restaurant_db`)
Gestiona la información estática y operativa de los restaurantes.

```mermaid
erDiagram
    RESTAURANT {
        UUID id PK
        string name
        string address
        boolean active
        jsonb preparation_time
    }
    MENU_CATEGORY {
        UUID id PK
        UUID restaurant_id FK
        string name
        int display_order
    }
    PRODUCT {
        UUID id PK
        UUID category_id FK
        string name
        decimal price
        boolean available
    }
    
    RESTAURANT ||--|{ MENU_CATEGORY : contains
    MENU_CATEGORY ||--|{ PRODUCT : contains
```

## 2. Order Service (`order_db`)
Núcleo transaccional. Máquina de estados del pedido.

```mermaid
erDiagram
    ORDER_TABLE {
        UUID id PK
        UUID customer_id
        UUID restaurant_id
        decimal total_amount
        string status
        timestamp created_at
    }
    ORDER_ITEM {
        UUID id PK
        UUID order_id FK
        UUID product_id
        int quantity
        decimal unit_price
        string notes
    }
    
    ORDER_TABLE ||--|{ ORDER_ITEM : contains
```
* **Estados de Pedido:** `PENDING_PAYMENT` -> `PAID` -> `CONFIRMED` -> `PREPARING` -> `READY_FOR_PICKUP` -> `PICKED_UP` -> `DELIVERED` (o `CANCELLED`).

## 3. Courier Service (`courier_db`)
Logística y posicionamiento geoespacial.

```mermaid
erDiagram
    COURIER {
        UUID id PK
        string first_name
        string last_name
        string vehicle_type
        string status
        decimal rating
    }
    COURIER_LOCATION {
        UUID id PK
        UUID courier_id FK
        geometry point
        timestamp timestamp
    }
    COURIER_SHIFT {
        UUID id PK
        UUID courier_id FK
        timestamp clock_in
        timestamp clock_out
        decimal total_earnings
    }
    DELIVERY {
        UUID id PK
        UUID courier_id FK
        UUID order_id
        string status
        decimal earnings
        decimal distance_km
    }

    COURIER ||--o{ COURIER_LOCATION : tracks
    COURIER ||--o{ COURIER_SHIFT : works
    COURIER ||--|{ DELIVERY : performs
```

## 4. Auth Service (`auth_db`) - *Planificado*
Gestión de identidad.

```mermaid
erDiagram
    USERS {
        UUID id PK
        string email UK
        string password_hash
        string role
        string public_id
        boolean active
        timestamp created_at
    }
```
