# 🚴‍♂️ Módulo Courier - Documentación Técnica

Bienvenido a la documentación técnica del módulo para repartidores de **EatVibe**. Este directorio contiene toda la información detallada sobre los flujos, pantallas, funcionalidades y estado actual del desarrollo de la aplicación para couriers.

---

## 📚 Índice de Documentación

### 🚀 1. Flujo de Entrega (Core Loop)
Documentación relacionada con el ciclo de vida de un pedido, desde que se recibe hasta que se completa.

| Documento | Descripción |
|-----------|-------------|
| [Incoming Order](./COURIER_INCOMING_ORDER.md) | Pantalla de notificación de nuevo pedido. Detalles sobre aceptación/rechazo y timers. |
| [Active Delivery](./COURIER_ACTIVE_DELIVERY.md) | Panel principal durante una entrega activa. Incluye gestión de estados (pickup/dropoff). |
| [Proof of Delivery](./COURIER_PROOF_OF_DELIVERY.md) | Proceso de validación de entrega (PIN, firma o foto). |
| [Delivery Completed](./COURIER_DELIVERY_COMPLETED.md) | Resumen post-entrega, desglose de ganancias del pedido y feedback. |
| [Trip Details](./COURIER_TRIP_DETAILS.md) | Vista detallada de un pedido finalizado en el historial. |

### 💰 2. Sistema de Ganancias
Gestión financiera, historial de pagos y métricas de desempeño.

| Documento | Descripción |
|-----------|-------------|
| [Earnings Hub](./COURIER_EARNINGS_HUB.md) | Dashboard financiero. Muestra ganancias actuales, gráficas semanales y balance disponible. |
| [Financial History](./COURIER_FINANCIAL_HISTORY.md) | Historial detallado de todas las transacciones (pagos, bonos, propinas). |
| [Trip History](./COURIER_TRIP_HISTORY.md) | Listado histórico de todos los viajes realizados con filtros por fecha. |

### 👤 3. Perfil y Configuración
Gestión de la cuenta del repartidor y preferencias de la aplicación.

| Documento | Descripción |
|-----------|-------------|
| [Dashboard](./COURIER_DASHBOARD.md) | Pantalla de inicio ("Home"). Resumen de actividad, estado online/offline y mapa de calor. |
| [Profile & Settings](./COURIER_PROFILE_SETTINGS.md) | Configuración de cuenta, gestión de vehículos, documentos legales y preferencias de app. |

### 🛠️ 4. Especificaciones Técnicas
Detalles sobre implementaciones específicas y deuda técnica.

| Documento | Descripción |
|-----------|-------------|
| [Camera Functionality](./COURIER_CAMERA_FUNCTIONALITY.md) | Especificaciones para el uso de la cámara (escaneo de documentos, verificación facial). |
| [Pantallas Faltantes](./COURIER_PANTALLAS_FALTANTES.md) | Listado de features pendientes y deuda técnica (Gamificación, Referidos, etc.). |

---

## 📊 Estado del Proyecto

**Progreso Actual: 79% (22/28 Pantallas Completadas)**

### ✅ Lo que está listo
- **Flujo Principal Completo**: Desde la aceptación del pedido hasta la entrega final.
- **Navegación**: Implementación de `expo-router` con Tabs y Stacks para una navegación fluida.
- **Gestión Financiera**: Visualización de ganancias y solicitud de retiros.
- **Gestión de Perfil**: Edición de datos, vehículos y documentos.

### 🚧 Lo que falta (Next Steps)
Las siguientes funcionalidades están pendientes y documentadas en [Pantallas Faltantes](./COURIER_PANTALLAS_FALTANTES.md):
1. **Gamificación**: Leaderboards y sistema de niveles.
2. **Promociones**: Visualización de bonos activos.
3. **Programa de Referidos**: Invitar a otros couriers.
4. **Sistema de Notificaciones**: Centro de mensajes in-app.

---

## 🏗️ Arquitectura y Estructura

El módulo se encuentra en `src/app/(courier)/` y sigue una arquitectura basada en **Expo Router**.

```bash
src/app/(courier)/
├── dashboard/      # Home Screen
├── delivery/       # Flujo activo (Mapas, Contacto, Reportes)
├── earnings/       # Finanzas y Retiros
├── trips/          # Historial de viajes
├── profile/        # Configuración de cuenta
└── order/          # Gestión de pedidos entrantes
```

### Tecnologías Clave
- **Mapas**: `react-native-maps` con estilos personalizados oscuros.
- **UI**: Tailwind CSS (`NativeWind`) con un tema oscuro consistente (`bg-[#0A0E27]`).
- **Navegación**: Tab Bar personalizado y Stacks anidados.

---

**Última actualización**: 14 de febrero de 2026
**Mantenido por**: Equipo de Desarrollo Mobile
