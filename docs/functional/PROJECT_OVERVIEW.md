# Documentación Funcional - FoodRush

## 1. Introducción y Alcance
**FoodRush** es una plataforma integral de delivery de comida diseñada para conectar a usuarios hambrientos con restaurantes locales a través de una red eficiente de repartidores. El sistema gestiona todo el ciclo de vida del pedido, desde la selección del plato hasta la entrega en la puerta del cliente.

### Alcance del Proyecto
El sistema abarca tres aplicaciones principales interconectadas:
1.  **App de Cliente:** Búsqueda, pedido, pago y tracking.
2.  **App de Repartidor (Courier):** Gestión de turnos, recepción de pedidos y navegación.
3.  **App de Restaurante & Backoffice:** Gestión de menú, pedidos y monitoreo operativo.

## 2. Tipos de Usuario y Roles

### 👤 Cliente (Customer)
*   **Función:** Usuario final que realiza pedidos.
*   **Permisos:**
    *   Buscar restaurantes y platos.
    *   Crear y personalizar pedidos.
    *   Realizar pagos (integración con pasarelas).
    *   Monitorear la ubicación del repartidor en tiempo real.
    *   Calificar el servicio y la comida.
    *   Gestionar su perfil y direcciones.

### 🛵 Repartidor (Courier)
*   **Función:** Socio logístico encargado del transporte.
*   **Permisos:**
    *   Iniciar y cerrar turno (Clock-in/out).
    *   Recibir ofertas de entrega con información de ganancia y distancia.
    *   Aceptar o rechazar entregas.
    *   Cambiar estados del pedido (Recogido, En Camino, Entregado).
    *   Ver historial de ganancias y entregas.

### 🏪 Administrador de Restaurante
*   **Función:** encargado del local gastronómico.
*   **Permisos:**
    *   Gestionar menú (platos, precios, disponibilidad).
    *   Aceptar o rechazar pedidos entrantes.
    *   Ajustar tiempos de preparación.
    *   Ver métricas de ventas.

### 👮 Administrador del Sistema (Super Admin)
*   **Función:** Soporte y gestión global de la plataforma.
*   **Permisos:**
    *   Acceso total a todos los módulos.
    *   Gestión de usuarios y reembolso.
    *   Monitoreo de estado del sistema.

## 3. Flujos Principales (Actividades)

### Flujo de Pedido
1.  **Cliente:** Selecciona restaurante -> Elige platos -> Checkout (Pago).
2.  **Sistema:** Valida pago -> Notifica Restaurante.
3.  **Restaurante:** Acepta pedido -> Inicia preparación.
4.  **Sistema:** Busca Repartidor cercano (Algoritmo de Asignación).
5.  **Repartidor:** Recibe oferta -> Acepta.
6.  **Repartidor:** Navega al restaurante -> Recoge pedido (Valida).
7.  **Repartidor:** Entrega al cliente -> Cliente confirma (PIN/QR).
8.  **Sistema:** Libera pago al restaurante y ganancia al repartidor.

## 4. Requerimientos Funcionales Clave
*   **Geolocalización:** Rastreo en tiempo real usando GPS.
*   **Notificaciones:** Alertas push/SMS para cambios de estado.
*   **Pagos:** Procesamiento seguro y manejo de reembolsos.
*   **Seguridad:** Autenticación robusta (JWT) para todas las operaciones.
