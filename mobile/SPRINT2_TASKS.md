# Sprint 2 - Task Breakdown

**Sprint Goal**: Implementar flujo completo de órdenes, tracking en tiempo real, y perfil de usuario

**Fecha Inicio**: 2026-02-12  
**Estado**: 🟡 En Progreso (40% completado)

---

## ✅ Fase 1: Pantallas Core (COMPLETADO)

### 1.1 Checkout Summary ✅
- [x] Crear pantalla de checkout
- [x] Lista de items del carrito
- [x] Sección de dirección de entrega
- [x] Sección de método de pago
- [x] Breakdown de costos (subtotal, fees, total)
- [x] Validación de carrito vacío
- [x] Botón "Place Order"
- [x] Navegación a tracking
- [x] Fix TypeScript errors

### 1.2 Real-Time Order Tracking ✅
- [x] Crear pantalla de tracking
- [x] Timeline de estados de orden
- [x] Placeholder para mapa
- [x] Card de información del courier
- [x] Botones de contacto (call/message)
- [x] ETA estimado
- [x] Detalles de la orden
- [x] Animaciones con Reanimated

### 1.3 Order History & Reorder ✅
- [x] Mejorar pantalla de orders existente
- [x] Tabs funcionales (Active/Past)
- [x] Filtrado dinámico
- [x] Botón "Track" para órdenes activas
- [x] Botón "Reorder" para órdenes pasadas
- [x] Empty states
- [x] Navegación a tracking

### 1.4 User Profile & Settings ✅
- [x] Crear pantalla de profile
- [x] Card de usuario con avatar
- [x] Secciones organizadas (Account, Preferences, Support)
- [x] Navegación a sub-pantallas
- [x] Botón de logout
- [x] Integración con useAuth

### 1.5 Navigation Updates ✅
- [x] Agregar tab "Profile"
- [x] Ocultar rutas de checkout/tracking del tab bar
- [x] Actualizar iconos

---

## ✅ Fase 2: Feedback & Rating (COMPLETADO)

### 2.1 Order Feedback Screen ✅
- [x] Crear pantalla de rating
- [x] Rating de estrellas para restaurante
- [x] Rating de estrellas para courier
- [x] Tags predefinidos (Rápido, Amable, Buena comida, etc.)
- [x] Text area para comentarios
- [x] Botón "Submit Review"
- [x] Validación de rating mínimo
- [x] Animaciones con Reanimated

### 2.2 Review Confirmation Modal ✅
- [x] Modal de éxito
- [x] Animación de celebración (Reanimated)
- [x] Mensaje de agradecimiento
- [x] Stats card con métricas
- [x] Botón "Back to Home"
- [x] Botón "View Orders"

---

## ✅ Fase 3: Sub-pantallas de Profile (COMPLETADO)

### 3.1 Edit Personal Information ✅
- [x] Formulario de edición de perfil
- [x] Campos: nombre, email, teléfono, avatar
- [x] Validación de campos
- [x] Botón "Save Changes"
- [x] Integración con API (Mocked)

### 3.2 Manage Addresses ✅
- [x] Lista de direcciones guardadas
- [x] Botón "Add New Address"
- [x] Modal/Screen de agregar dirección (navigatable)
- [x] Integración con Google Places API (Mocked functionality)
- [x] Marcar dirección como favorita
- [x] Editar/Eliminar dirección

### 3.3 Manage Payment Methods ✅
- [x] Lista de métodos de pago guardados
- [x] Botón "Add Payment Method"
- [x] Formulario de tarjeta (Mocked visuals)
- [x] Integración con Stripe/MercadoPago (Mocked functionality)
- [x] Marcar método como predeterminado
- [x] Eliminar método de pago

### 3.4 Notification Settings ✅
- [x] Toggle para notificaciones push
- [x] Toggle para notificaciones de email
- [x] Toggle para promociones
- [x] Guardar preferencias (Mocked)

### 3.5 Help Center ✅
- [x] Lista de FAQs
- [x] Secciones expandibles
- [x] Buscador de ayuda

### 3.6 Contact Us ✅
- [x] Formulario de contacto
- [x] Campos: asunto, mensaje
- [x] Botón "Send Message"

### 3.7 Terms & Privacy ✅
- [x] Pantalla de términos y condiciones (Unified view)
- [x] Pantalla de política de privacidad (Unified view)
- [x] ScrollView con contenido legal

---

## 🔌 Fase 4: Integraciones Técnicas (PENDIENTE)

### 4.1 Backend Integration ⏳
- [ ] Conectar checkout con API de órdenes
- [ ] Endpoint POST /orders
- [ ] Implementar creación de orden real
- [ ] Integrar historial de órdenes (GET /orders)
- [ ] Conectar perfil con API de usuario
- [ ] Endpoint GET/PUT /users/me

### 4.2 Real-Time Features ⏳
- [ ] Setup WebSocket client
- [ ] Conectar a servidor de tracking
- [ ] Implementar listeners de eventos
- [ ] Actualizar estado de orden en tiempo real
- [ ] Actualizar ubicación del courier
- [ ] Push notifications para cambios de estado

### 4.3 Maps Integration ⏳
- [ ] Instalar react-native-maps
- [ ] Configurar Google Maps API key
- [ ] Implementar mapa en tracking screen
- [ ] Mostrar ubicación del courier
- [ ] Mostrar ubicación de destino
- [ ] Animación del marcador
- [ ] Dibujar ruta del courier

### 4.4 Payment Integration ⏳
- [ ] Instalar @stripe/stripe-react-native
- [ ] Configurar Stripe publishable key
- [ ] Crear pantalla de selección de método de pago
- [ ] Implementar formulario de tarjeta
- [ ] Tokenización de tarjeta
- [ ] Gestión de métodos guardados
- [ ] Procesamiento de pago en checkout

---

## 🎨 Fase 5: Polish & Animations (PENDIENTE)

### 5.1 Micro-animations ⏳
- [ ] Animación de transición entre pantallas
- [ ] Loading states con skeleton screens
- [ ] Pull-to-refresh en listas
- [ ] Swipe gestures en order cards
- [ ] Haptic feedback en acciones importantes

### 5.2 Error Handling ⏳
- [ ] Toast notifications para errores
- [ ] Retry logic para requests fallidos
- [ ] Offline mode indicators
- [ ] Error boundaries

### 5.3 Performance ⏳
- [ ] Optimizar re-renders con React.memo
- [ ] Implementar lazy loading de imágenes
- [ ] Optimizar animaciones (useNativeDriver)
- [ ] Code splitting si es necesario

---

## 📊 Métricas de Progreso

- **Total de tareas**: 107
- **Completadas**: 68 ✅ (Core + Feedback + Profile)
- **En progreso**: 0 🔄
- **Pendientes**: 39 ⏳ (Fases 4-5)
- **Progreso**: 64%

---

## 🚀 Próximos Pasos Inmediatos

1. ✅ ~~Crear checkout screen~~
2. ✅ ~~Crear tracking screen~~
3. ✅ ~~Mejorar orders screen~~
4. ✅ ~~Crear profile screen~~
5. 🔄 **Crear order feedback screen** ← ACTUAL
6. ⏳ Crear review confirmation modal
7. ⏳ Implementar sub-pantallas de profile
8. ⏳ Integrar Google Maps
9. ⏳ Setup WebSocket
10. ⏳ Integrar backend APIs

---

**Última actualización**: 2026-02-12 00:57  
**Responsable**: Sprint 2 Development Team
