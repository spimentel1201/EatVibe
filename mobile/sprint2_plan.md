#  FoodRush Mobile App - Sprint 2: Orders, Tracking & User Experience

##  Resumen del Sprint

**Objetivo**: Implementar el flujo completo de órdenes (checkout, tracking en tiempo real, historial) y perfil de usuario, siguiendo fielmente los diseños de Stitch.

**Duración estimada**: 3-4 semanas  
**Prioridad**: Alta  
**Diseños base**: https://stitch.withgoogle.com/projects/17003972511056142404

---

##  Pantallas a Implementar (Basadas en Stitch)

### 1. **Checkout Summary**  ALTA PRIORIDAD
**Screen ID**: 70fa9f10339946779073d0dbd9bd0eec  
**Ruta**: /checkout

**Elementos del diseño**:
- Header con botón de regreso
- Lista de items del carrito con imágenes
- Sección de dirección de entrega con mapa
- Método de pago seleccionado
- Breakdown de costos (Subtotal, Delivery Fee, Service Fee, Total)
- Botón CTA \"Place Order\" con precio total
- Animaciones: Slide-in para el resumen, fade-in para items

**Funcionalidades**:
- Editar dirección de entrega
- Cambiar método de pago
- Aplicar cupón de descuento
- Validación antes de confirmar orden
- Integración con API de órdenes

---

### 2. **Real-Time Order Tracking**  ALTA PRIORIDAD
**Screen ID**: 9bf66c5cc4364820b7b379eaa1055887  
**Ruta**: /order/[id]/tracking

**Elementos del diseño**:
- Mapa interactivo con ubicación del courier
- Timeline de estados (Confirmed  Preparing  On the way  Delivered)
- Card del courier con foto, nombre, rating
- Botones de \"Call\" y \"Message\"
- ETA estimado
- Detalles de la orden (items, dirección)

**Funcionalidades**:
- WebSocket para actualización en tiempo real
- Integración con Google Maps / Mapbox
- Animación del marcador del courier
- Notificaciones push para cambios de estado
- Llamada/chat con el courier

---

### 3. **Order History & Reorder**  MEDIA PRIORIDAD
**Screen ID**: 2816c8605e8d425081543a29356c463c  
**Ruta**: /orders/history

**Elementos del diseño**:
- Tabs: \"Active\" y \"Past Orders\"
- Cards de órdenes con:
  - Nombre del restaurante
  - Fecha y hora
  - Status badge (Delivered, Cancelled, etc.)
  - Items resumidos
  - Precio total
- Botón \"Reorder\" en cada card
- Filtros por fecha/estado

**Funcionalidades**:
- Listar órdenes del usuario
- Filtrar por estado y fecha
- Reordenar con un tap
- Ver detalle de orden pasada
- Animación de lista con stagger

---

### 4. **Order Feedback & Rating**  MEDIA PRIORIDAD
**Screen ID**: 93021ae194b4eee89c98d14533cba73  
**Ruta**: /order/[id]/feedback

**Elementos del diseño**:
- Header con ilustración de éxito
- Rating de estrellas para el restaurante
- Rating de estrellas para el courier
- Text area para comentarios
- Tags predefinidos (\"Fast delivery\", \"Great food\", etc.)
- Botón \"Submit Review\"

**Funcionalidades**:
- Rating con animación de estrellas
- Selección múltiple de tags
- Validación de formulario
- Envío de reseña al backend
- Animación de confirmación

---

### 5. **User Profile & Settings**  MEDIA PRIORIDAD
**Screen ID**: 78b0799c3b6b476ba5a378d401a4337a  
**Ruta**: /profile

**Elementos del diseño**:
- Avatar del usuario con opción de editar
- Nombre y email
- Secciones:
  - Personal Information
  - Saved Addresses
  - Payment Methods
  - Notification Settings
  - Help & Support
  - Logout
- Iconos para cada sección
- Chevron indicators

**Funcionalidades**:
- Editar perfil (nombre, foto, teléfono)
- Gestión de direcciones (CRUD)
- Gestión de métodos de pago
- Toggle de notificaciones
- Logout con confirmación

---

### 6. **Review Confirmation Thank You**  BAJA PRIORIDAD
**Screen ID**: b1e5cfe09b94774ad2a07182d8811fd  
**Ruta**: Modal después de enviar review

**Elementos del diseño**:
- Ilustración de éxito (confetti/checkmark)
- Mensaje de agradecimiento
- Botón \"Back to Home\"
- Animación de celebración

---

### 7. **Active Delivery Management**  ALTA PRIORIDAD
**Screen ID**: 41270d1568c94e8b8d3c7385fb7e919d  
**Ruta**: /order/[id]/active

**Elementos del diseño**:
- Vista compacta del mapa
- Progress bar de estados
- Información del courier
- Botones de acción rápida
- Countdown timer

---

##  Implementación Técnica

### Semana 1: Checkout & Payment Flow
- [ ] Crear pantalla de Checkout Summary
- [ ] Implementar selección de dirección
- [ ] Integrar selección de método de pago
- [ ] Crear breakdown de costos
- [ ] Implementar validación y confirmación
- [ ] Conectar con API de órdenes

### Semana 2: Real-Time Tracking
- [ ] Setup WebSocket/Firebase para real-time
- [ ] Integrar Google Maps SDK
- [ ] Implementar pantalla de tracking
- [ ] Crear timeline de estados
- [ ] Añadir animaciones del courier
- [ ] Implementar notificaciones push

### Semana 3: Order History & Profile
- [ ] Crear pantalla de Order History
- [ ] Implementar filtros y tabs
- [ ] Funcionalidad de reorder
- [ ] Crear pantalla de Profile
- [ ] Implementar edición de perfil
- [ ] Gestión de direcciones y pagos

### Semana 4: Feedback & Polish
- [ ] Pantalla de Rating & Review
- [ ] Modal de confirmación
- [ ] Animaciones y transiciones
- [ ] Testing end-to-end
- [ ] Optimización de performance
- [ ] Bug fixes

---

##  Guía de Diseño (Basada en Stitch)

### Colores
- **Primary**: #FF5724 (Orange)
- **Background**: #FFFFFF
- **Text Primary**: #1F2937
- **Text Secondary**: #6B7280
- **Success**: #10B981
- **Error**: #EF4444

### Tipografía
- **Font**: Plus Jakarta Sans
- **Heading**: 24-32px, Bold (900)
- **Body**: 14-16px, Medium (500)
- **Caption**: 12-14px, Regular (400)

### Border Radius
- **Cards**: 32px
- **Buttons**: 28px (full rounded)
- **Inputs**: 24px
- **Chips**: 20px

### Spacing
- **Section padding**: 24px
- **Card padding**: 20px
- **Element gap**: 16px

### Animaciones
- **Duration**: 250-350ms
- **Easing**: Ease-out
- **Spring**: Gentle bounce
- **Stagger delay**: 50ms

---

##  Dependencias Nuevas

\\\json
{
  \"react-native-maps\": \"^1.18.0\",
  \"@react-native-google-signin/google-signin\": \"^13.1.0\",
  \"socket.io-client\": \"^4.8.1\",
  \"react-native-push-notification\": \"^8.1.1\",
  \"@stripe/stripe-react-native\": \"^0.40.1\",
  \"lottie-react-native\": \"^7.2.0\"
}
\\\

---

##  Definition of Done

- [ ] Todas las pantallas implementadas según diseño de Stitch
- [ ] Animaciones suaves (60 FPS)
- [ ] TypeScript sin errores
- [ ] Integración con backend funcional
- [ ] Real-time tracking operativo
- [ ] Tests unitarios para stores
- [ ] Tests de integración para flujos críticos
- [ ] Performance optimizado
- [ ] Documentación actualizada

---

##  Próximos Pasos Inmediatos

1. Descargar assets de Stitch (iconos, ilustraciones)
2. Crear branch eature/mobile-consumer-sprint2
3. Implementar Checkout Summary (pantalla más crítica)
4. Setup WebSocket infrastructure
5. Integrar Google Maps

---

**Creado**: 2026-02-12  
**Última actualización**: 2026-02-12
