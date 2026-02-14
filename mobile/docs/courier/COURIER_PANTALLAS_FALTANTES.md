# 📋 Pantallas Faltantes - Módulo Courier

## ✅ Pantallas Ya Implementadas (8)

1. ✅ **Vehicle Registration** - Onboarding con cámara
2. ✅ **Driver Dashboard** - Pantalla principal con estadísticas
3. ✅ **Incoming Order** - Oferta de pedido con temporizador
4. ✅ **Active Delivery** - Entrega activa con mapa y state machine
5. ✅ **Proof of Delivery** - Verificación de PIN de seguridad
6. ✅ **Earnings Hub** - Ganancias semanales y retiros
7. ✅ **Trip History** - Historial de entregas con filtros
8. ✅ **Profile & Settings** - Gestión de cuenta y preferencias

---

## 🚧 Pantallas Faltantes por Implementar

### 🎯 **PRIORIDAD ALTA** (Flujo Principal)

#### 1. **Order Details** 📦
**Ruta:** `/courier/order/[id]`

**Descripción:**
Pantalla que muestra los detalles completos de un pedido antes de aceptarlo o después de aceptarlo.

**Elementos:**
- **Header**: Número de orden, estado
- **Restaurante**: Nombre, dirección, distancia, tiempo estimado
- **Cliente**: Nombre (parcial), dirección de entrega, distancia
- **Mapa**: Vista previa de la ruta (restaurante → cliente)
- **Items del pedido**: Lista de productos (opcional, puede estar oculto)
- **Ganancias**: Desglose (base + propina + bonos)
- **Instrucciones especiales**: Del restaurante y del cliente
- **Botones de acción**:
  - Si no aceptado: "Accept Order" / "Decline"
  - Si aceptado: "Start Pickup" / "Contact Restaurant" / "Report Issue"

**Navegación:**
- Desde: Incoming Order (al tocar "View Details")
- Hacia: Active Delivery (al aceptar)

---

#### 2. **Delivery Completed** ✅
**Ruta:** `/courier/delivery/completed`

**Descripción:**
Pantalla de confirmación después de completar una entrega exitosamente.

**Elementos:**
- **Ícono de éxito**: Checkmark grande animado
- **Mensaje**: "Delivery Completed!"
- **Ganancias**: Monto total ganado con animación
- **Desglose**:
  - Base fare: $8.00
  - Distance bonus: $2.50
  - Customer tip: $4.00
  - **Total**: $14.50 (destacado en verde)
- **Rating prompt**: "How was your experience?"
  - 5 estrellas para calificar al cliente/restaurante
- **Estadísticas del viaje**:
  - Distancia recorrida: 3.2 miles
  - Tiempo total: 18 min
- **Botones**:
  - "View Receipt" (ver detalles completos)
  - "Find Next Order" (volver a dashboard)

**Navegación:**
- Desde: Proof of Delivery (después de PIN correcto)
- Hacia: Dashboard o nueva orden

---

#### 3. **Navigation Screen** 🗺️
**Ruta:** `/courier/delivery/navigate`

**Descripción:**
Pantalla de navegación activa durante el pickup o delivery.

**Elementos:**
- **Mapa en pantalla completa**: Con ruta trazada
- **Marcadores**:
  - Ubicación actual del courier (dot azul animado)
  - Destino (pin rojo)
- **Panel inferior deslizable**:
  - Dirección de destino
  - Distancia restante: "0.8 miles away"
  - Tiempo estimado: "4 min"
  - Instrucciones de navegación: "Turn right on Main St"
- **Botones flotantes**:
  - "Open in [Google Maps/Waze]" (según preferencia)
  - "Call Customer/Restaurant"
  - "Report Issue"
- **Estado del pedido**: Indicador visual (Pickup / Delivery)

**Navegación:**
- Desde: Active Delivery (al tocar "Navigate")
- Hacia: Active Delivery (al llegar)

---

#### 4. **Cash Out** 💰
**Ruta:** `/courier/earnings/cash-out`

**Descripción:**
Pantalla para retirar ganancias disponibles.

**Elementos:**
- **Header**: "Cash Out"
- **Balance disponible**: $250.00 (grande, destacado)
- **Input de monto**:
  - Campo numérico para ingresar monto
  - Botones rápidos: "25%", "50%", "75%", "100%"
- **Método de pago**:
  - Tarjeta seleccionada: "Chase ****4920"
  - Botón "Change" para cambiar método
- **Opciones de velocidad**:
  - **Instant Payout**: 
    - Fee: $1.50
    - Tiempo: "Typically within 15 minutes"
    - Botón radio seleccionado
  - **Standard Payout**:
    - Fee: Free
    - Tiempo: "1-3 business days"
    - Botón radio
- **Total a recibir**: Monto - fee (si aplica)
- **Botón principal**: "Cash Out $248.50"
- **Historial reciente**: Últimos 3 retiros

**Navegación:**
- Desde: Earnings Hub (botón "Cash Out Now")
- Hacia: Confirmación de retiro

---

#### 5. **All Transactions** 📜
**Ruta:** `/courier/earnings/transactions`

**Descripción:**
Lista completa de todas las transacciones (entregas, retiros, bonos, propinas).

**Elementos:**
- **Header**: "All Transactions"
- **Filtros**:
  - Tabs: "All", "Deliveries", "Payouts", "Bonuses", "Tips"
  - Selector de rango de fechas
- **Lista de transacciones**:
  - Agrupadas por fecha
  - Cada transacción muestra:
    - Ícono según tipo
    - Título y descripción
    - Fecha y hora
    - Monto (verde para ingresos, gris para egresos)
- **Infinite scroll**: Carga más al llegar al final
- **Búsqueda**: Campo para buscar por descripción
- **Exportar**: Botón para exportar a CSV/PDF

**Navegación:**
- Desde: Earnings Hub (botón "See All")
- Hacia: Detalle de transacción individual

---

#### 6. **Trip Details** 🚴
**Ruta:** `/courier/trips/[id]`

**Descripción:**
Detalles completos de un viaje completado.

**Elementos:**
- **Header**: "Trip #4920"
- **Mapa de ruta**: Muestra el recorrido completo
  - Punto A: Restaurante
  - Punto B: Cliente
  - Ruta trazada
- **Timeline de eventos**:
  - ✅ Order accepted: 6:30 PM
  - ✅ Arrived at restaurant: 6:35 PM
  - ✅ Picked up order: 6:42 PM
  - ✅ Arrived at customer: 6:55 PM
  - ✅ Delivered: 6:58 PM
- **Desglose de ganancias**:
  - Base fare: $8.00
  - Distance: $2.50
  - Tip: $2.00
  - **Total**: $12.50
- **Información del pedido**:
  - Restaurante: Burger King
  - Cliente: John D. (parcial)
  - Distancia total: 3.2 miles
  - Tiempo total: 28 min
- **Items del pedido** (opcional)
- **Botones**:
  - "Report Issue"
  - "Contact Support"

**Navegación:**
- Desde: Trip History (al tocar una tarjeta)
- Hacia: Soporte o reportar problema

---

### ⚙️ **PRIORIDAD MEDIA** (Gestión de Cuenta)

#### 7. **My Vehicle** 🚴
**Ruta:** `/courier/profile/vehicle`

**Descripción:**
Gestión del vehículo registrado del courier.

**Elementos:**
- **Header**: "My Vehicle"
- **Foto del vehículo**: Imagen grande
- **Información básica**:
  - Tipo: "RadRunner 2"
  - Placa: "FR-9921"
  - Color: "Black"
  - Año: 2023
- **Seguro**:
  - Proveedor: "State Farm"
  - Número de póliza: "SF-123456"
  - Fecha de expiración: "Jun 15, 2025"
  - Estado: ✅ Valid
- **Documentos**:
  - Foto de la placa
  - Foto del seguro
- **Botones**:
  - "Edit Vehicle"
  - "Upload Insurance"
  - "Add New Vehicle"

**Navegación:**
- Desde: Profile (opción "My Vehicle")
- Hacia: Editar vehículo, subir documentos

---

#### 8. **Documents** 📄
**Ruta:** `/courier/profile/documents`

**Descripción:**
Gestión de documentos del courier (licencia, background check, seguro).

**Elementos:**
- **Header**: "Documents"
- **Lista de documentos**:
  
  1. **Driver's License**:
     - Estado: ⚠️ Expiring Soon (naranja)
     - Número: "DL-123456"
     - Expira: "Nov 5, 2024" (12 days)
     - Botón: "Upload New"
     
  2. **Background Check**:
     - Estado: ✅ Valid (verde)
     - Completado: "Jan 15, 2022"
     - Expira: "Jan 15, 2025"
     - Botón: "View Report"
     
  3. **Vehicle Insurance**:
     - Estado: ✅ Valid (verde)
     - Proveedor: "State Farm"
     - Expira: "Jun 15, 2025"
     - Botón: "Upload New"

- **Cada documento muestra**:
  - Ícono según tipo
  - Estado con color (verde/naranja/rojo)
  - Información clave
  - Thumbnail de la foto (si existe)
  - Botón de acción

**Navegación:**
- Desde: Profile (opción "Documents")
- Hacia: Subir documento, ver detalles

---

#### 9. **Bank Details** 💳
**Ruta:** `/courier/profile/bank`

**Descripción:**
Gestión de cuentas bancarias para recibir pagos.

**Elementos:**
- **Header**: "Bank Details"
- **Cuenta principal**:
  - Ícono de banco
  - Nombre del titular: "Alex Thompson"
  - Banco: "Chase"
  - Número de cuenta: "****4920"
  - Routing number: "****1234"
  - Tipo: "Checking"
  - Badge: "Primary"
- **Estado de verificación**:
  - ✅ Verified
  - Fecha de verificación: "Jan 15, 2022"
- **Botones**:
  - "Add Bank Account"
  - "Remove Bank Account"
  - "Set as Primary" (si hay múltiples)
- **Información de seguridad**:
  - "Your bank information is encrypted and secure"
  - Logo de Stripe/Plaid

**Navegación:**
- Desde: Profile (opción "Bank Details")
- Hacia: Agregar cuenta, verificar cuenta

---

#### 10. **App Settings** ⚙️
**Ruta:** `/courier/profile/settings`

**Descripción:**
Configuración de la aplicación.

**Elementos:**
- **Header**: "App Settings"

**Secciones:**

1. **Appearance**:
   - Toggle: "Dark Mode" (on/off)
   - Selector: "Theme" (Dark / Light / Auto)

2. **Notifications**:
   - Toggle: "Order Alerts" (on)
   - Toggle: "Earnings Updates" (on)
   - Toggle: "Promotions" (off)
   - Toggle: "Sound Effects" (on)
   - Toggle: "Haptic Feedback" (on)

3. **Units**:
   - Selector: "Distance" (Miles / Kilometers)
   - Selector: "Currency" (USD / EUR / etc.)

4. **Language**:
   - Selector: "English" / "Spanish" / etc.

5. **Delivery Preferences**:
   - Toggle: "Auto-Accept Orders" (off)
   - Slider: "Max Distance" (1-20 miles)
   - Toggle: "Accept Cash Orders" (on)

6. **Privacy**:
   - Toggle: "Share Location" (on)
   - Toggle: "Anonymous Mode" (off)
   - Botón: "Clear Cache"
   - Botón: "Delete Account"

**Navegación:**
- Desde: Profile (opción "App Settings")
- Hacia: Ninguna (configuración en la misma pantalla)

---

### 📱 **PRIORIDAD MEDIA** (Comunicación y Soporte)

#### 11. **Contact Customer** 📞
**Ruta:** `/courier/delivery/contact-customer`

**Descripción:**
Opciones para contactar al cliente durante una entrega.

**Elementos:**
- **Header**: "Contact Customer"
- **Información del cliente**:
  - Nombre: "John D." (parcial por privacidad)
  - Dirección: "123 Main St, Apt 4B"
  - Instrucciones de entrega: "Ring doorbell twice"
- **Opciones de contacto**:
  - **Call**: Botón grande con ícono de teléfono
    - "Call Customer"
    - Número enmascarado para privacidad
  - **Message**: Botón grande con ícono de mensaje
    - "Send Message"
    - Mensajes predefinidos:
      - "I'm on my way"
      - "I'm outside"
      - "Running late"
      - Custom message
- **Historial de mensajes**: Si ya hay conversación
- **Botón de emergencia**: "Report Issue"

**Navegación:**
- Desde: Active Delivery (botón "Contact Customer")
- Hacia: Llamada o chat

---

#### 12. **Contact Restaurant** 🏪
**Ruta:** `/courier/delivery/contact-restaurant`

**Descripción:**
Opciones para contactar al restaurante durante el pickup.

**Elementos:**
- **Header**: "Contact Restaurant"
- **Información del restaurante**:
  - Nombre: "Burger King"
  - Dirección: "123 Maple St"
  - Número de orden: "#4920"
- **Opciones de contacto**:
  - **Call**: Botón grande
    - "Call Restaurant"
    - Número directo
  - **Message**: Botón grande
    - Mensajes predefinidos:
      - "I'm here for pickup"
      - "Where should I park?"
      - "Order not ready?"
- **Instrucciones especiales**: Del restaurante
- **Botones**:
  - "Report Issue"
  - "Order Not Ready"

**Navegación:**
- Desde: Active Delivery (botón "Contact Restaurant")
- Hacia: Llamada o reportar problema

---

#### 13. **Report Issue** ⚠️
**Ruta:** `/courier/delivery/report-issue`

**Descripción:**
Reportar problemas durante una entrega.

**Elementos:**
- **Header**: "Report Issue"
- **Tipo de problema** (selección):
  - 🏪 Restaurant Issues:
    - "Order not ready"
    - "Restaurant closed"
    - "Items missing"
    - "Wrong order"
  - 📍 Navigation Issues:
    - "Can't find address"
    - "Unsafe location"
    - "Road closed"
  - 👤 Customer Issues:
    - "Customer not responding"
    - "Customer cancelled"
    - "Unsafe situation"
  - 🚴 Vehicle Issues:
    - "Flat tire"
    - "Accident"
    - "Vehicle breakdown"
- **Descripción**: Campo de texto para detalles
- **Foto**: Opción de subir foto del problema
- **Botones**:
  - "Submit Report"
  - "Contact Support"
  - "Cancel Delivery" (si es grave)

**Navegación:**
- Desde: Active Delivery, Order Details, Trip Details
- Hacia: Soporte o cancelación

---

#### 14. **Support Center** 💬
**Ruta:** `/courier/support`

**Descripción:**
Centro de ayuda y soporte para couriers.

**Elementos:**
- **Header**: "Support Center"
- **Búsqueda**: Campo para buscar en FAQs
- **Categorías de ayuda**:
  - 📦 "Delivery Help"
  - 💰 "Earnings & Payouts"
  - 🚴 "Vehicle & Documents"
  - 📱 "App Issues"
  - 🔐 "Account & Security"
- **FAQs populares**:
  - "How do I update my bank account?"
  - "What if the customer isn't home?"
  - "How do I report an accident?"
- **Contacto directo**:
  - **Chat**: "Chat with Support" (botón)
  - **Call**: "Call Support" (botón)
  - **Email**: "support@eatvibe.com"
- **Horario de atención**: "24/7 Support"

**Navegación:**
- Desde: Cualquier pantalla (menú o botón de ayuda)
- Hacia: Chat, llamada, FAQs

---

### 🎁 **PRIORIDAD BAJA** (Features Adicionales)

#### 15. **Promotions & Bonuses** 🎁
**Ruta:** `/courier/promotions`

**Descripción:**
Promociones activas y bonos disponibles.

**Elementos:**
- **Header**: "Promotions & Bonuses"
- **Promociones activas**:
  - **Peak Hour Bonus**:
    - "Earn $3 extra per delivery"
    - Horario: "5-9 PM"
    - Progreso: "2/5 deliveries"
  - **Weekend Warrior**:
    - "Complete 20 deliveries this weekend"
    - Bonus: "$50"
    - Progreso: "8/20 deliveries"
- **Referral program**:
  - "Invite friends to become couriers"
  - Bonus: "$100 per referral"
  - Código de referido: "ALEX2024"
  - Botón: "Share Code"
- **Historial de bonos**: Bonos ganados anteriormente

**Navegación:**
- Desde: Dashboard (banner de promoción)
- Hacia: Compartir código de referido

---

#### 16. **Referral Program** 🤝
**Ruta:** `/courier/referral`

**Descripción:**
Programa de referidos para invitar nuevos couriers.

**Elementos:**
- **Header**: "Refer a Friend"
- **Código de referido**: "ALEX2024" (grande, copiable)
- **Cómo funciona**:
  1. "Share your code"
  2. "Friend signs up and completes 20 deliveries"
  3. "You both earn $100"
- **Progreso de referidos**:
  - "John D.": 15/20 deliveries (75%)
  - "Sarah M.": 20/20 deliveries ✅ ($100 earned)
- **Total ganado**: "$300 from referrals"
- **Botones**:
  - "Share Code" (WhatsApp, SMS, Email)
  - "Copy Code"

**Navegación:**
- Desde: Promotions, Dashboard
- Hacia: Compartir en apps

---

#### 17. **Ratings & Reviews** ⭐
**Ruta:** `/courier/ratings`

**Descripción:**
Ver calificaciones y comentarios de clientes.

**Elementos:**
- **Header**: "My Ratings"
- **Rating general**: 4.9 ⭐ (grande)
- **Total de reviews**: 1,247
- **Desglose**:
  - 5 estrellas: 1,100 (88%)
  - 4 estrellas: 120 (10%)
  - 3 estrellas: 20 (2%)
  - 2 estrellas: 5 (0%)
  - 1 estrella: 2 (0%)
- **Reviews recientes**:
  - Cada review muestra:
    - Nombre del cliente (parcial)
    - Rating (estrellas)
    - Comentario
    - Fecha
- **Filtros**: Por rating, por fecha
- **Tips para mejorar**: Sugerencias basadas en feedback

**Navegación:**
- Desde: Profile (tocar rating badge)
- Hacia: Ninguna

---

#### 18. **Leaderboard** 🏆
**Ruta:** `/courier/leaderboard`

**Descripción:**
Tabla de clasificación de couriers top.

**Elementos:**
- **Header**: "Leaderboard"
- **Filtros**:
  - "This Week" / "This Month" / "All Time"
  - "By Deliveries" / "By Earnings" / "By Rating"
- **Top 3** (destacados):
  - 🥇 1st place: Avatar + nombre + stat
  - 🥈 2nd place
  - 🥉 3rd place
- **Lista del 4-100**:
  - Posición
  - Avatar
  - Nombre
  - Stat (deliveries/earnings/rating)
- **Tu posición**: Fija en la parte inferior
  - "#24 - You - 156 deliveries"
- **Premios**: "Top 10 earn bonus rewards!"

**Navegación:**
- Desde: Dashboard (botón opcional)
- Hacia: Perfil de otro courier (opcional)

---

#### 19. **Notifications** 🔔
**Ruta:** `/courier/notifications`

**Descripción:**
Centro de notificaciones.

**Elementos:**
- **Header**: "Notifications"
- **Tabs**: "All" / "Orders" / "Earnings" / "Updates"
- **Lista de notificaciones**:
  - Cada notificación muestra:
    - Ícono según tipo
    - Título
    - Descripción
    - Tiempo ("2 min ago")
    - Badge de "new" si no leída
- **Tipos de notificaciones**:
  - 📦 New order available
  - 💰 Payout completed
  - ⭐ New review received
  - 🎁 Bonus unlocked
  - 📄 Document expiring soon
  - 🔧 App update available
- **Acciones**:
  - Swipe para eliminar
  - Tocar para ver detalles
  - "Mark all as read"

**Navegación:**
- Desde: Cualquier pantalla (ícono de campana)
- Hacia: Pantalla relacionada (orden, earnings, etc.)

---

#### 20. **Heat Map** 🗺️
**Ruta:** `/courier/heatmap`

**Descripción:**
Mapa de calor que muestra zonas con alta demanda.

**Elementos:**
- **Header**: "Demand Heat Map"
- **Mapa interactivo**:
  - Zonas rojas: Alta demanda
  - Zonas naranjas: Demanda media
  - Zonas verdes: Baja demanda
- **Filtros**:
  - Hora del día (slider)
  - Día de la semana
- **Información de zona** (al tocar):
  - Nombre de la zona
  - Demanda actual: "High"
  - Promedio de ganancias: "$15/delivery"
  - Tiempo de espera: "2-5 min"
- **Sugerencia**: "Head to Downtown for more orders"
- **Toggle**: "Show my location"

**Navegación:**
- Desde: Dashboard (botón opcional)
- Hacia: Navegación a zona sugerida

---

## 📊 Resumen de Pantallas Faltantes

### Por Prioridad:

**🎯 PRIORIDAD ALTA (6 pantallas):**
1. Order Details
2. Delivery Completed
3. Navigation Screen
4. Cash Out
5. All Transactions
6. Trip Details

**⚙️ PRIORIDAD MEDIA (8 pantallas):**
7. My Vehicle
8. Documents
9. Bank Details
10. App Settings
11. Contact Customer
12. Contact Restaurant
13. Report Issue
14. Support Center

**🎁 PRIORIDAD BAJA (6 pantallas):**
15. Promotions & Bonuses
16. Referral Program
17. Ratings & Reviews
18. Leaderboard
19. Notifications
20. Heat Map

---

## 🎯 Recomendación de Implementación

### **Fase 1: Completar Flujo Principal** (Prioridad Alta)
Implementar las 6 pantallas de prioridad alta para tener un flujo completo de delivery funcional.

### **Fase 2: Gestión de Cuenta** (Prioridad Media - Parte 1)
Implementar pantallas 7-10 para completar la gestión de perfil y configuración.

### **Fase 3: Comunicación y Soporte** (Prioridad Media - Parte 2)
Implementar pantallas 11-14 para mejorar la experiencia de soporte.

### **Fase 4: Features Adicionales** (Prioridad Baja)
Implementar pantallas 15-20 según necesidad y feedback de usuarios.

---

## 📝 Total de Pantallas

- **Implementadas**: 8 pantallas ✅
- **Faltantes**: 20 pantallas 🚧
- **Total del módulo**: 28 pantallas completas

¡El módulo de Courier será uno de los más completos y funcionales! 🚀
