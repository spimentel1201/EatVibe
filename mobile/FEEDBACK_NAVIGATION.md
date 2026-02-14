# 🧭 Guía de Navegación - Pantallas de Feedback

## 📍 Rutas Disponibles

### Pantalla de Feedback (Rating)
**Ruta:** `/order/feedback?id={orderId}`

**Ejemplo:** `/order/feedback?id=ORD-001`

### Pantalla de Confirmación
**Ruta:** `/order/feedback-confirmation`

---

## 🎯 Formas de Acceder

### ✅ Opción 1: Desde la Pantalla de Órdenes (Más Fácil)

1. Navega a la pestaña **"Orders"** en el tab bar inferior
2. Verás dos botones de prueba en el header:
   - **📝 Feedback** → Te lleva a la pantalla de rating
   - **✅ Confirm** → Te lleva a la pantalla de confirmación

### ✅ Opción 2: Desde la Pantalla de Tracking

1. Navega a **Orders** → Presiona "Track" en cualquier orden activa
2. En la pantalla de tracking, desplázate hacia abajo
3. Verás un botón verde **"🧪 Test: Go to Feedback"**
4. Presiona el botón para ir a la pantalla de feedback

### ✅ Opción 3: Flujo Natural (Simulado)

**Flujo completo del usuario:**

1. **Home** → Selecciona un restaurante
2. **Restaurant Detail** → Agrega items al carrito
3. **Cart** → Presiona "Checkout"
4. **Checkout** → Presiona "Place Order"
5. **Tracking** → Espera la entrega (simulada)
6. **Feedback** → Califica el pedido
7. **Confirmation** → Ve el mensaje de agradecimiento

---

## 🎨 Pantallas de Feedback - Descripción

### 📝 Feedback Screen (`feedback.tsx`)

**Características:**
- Rating de restaurante (1-5 estrellas)
- Rating de courier (1-5 estrellas)
- Tags predefinidos para cada categoría:
  - **Restaurante:** Delicious 😋, Fresh 🌿, Hot 🔥, Good Portion 🍽️, Well Packed 📦
  - **Courier:** Fast ⚡, Friendly 😊, Careful 🤲, Professional 👔, On Time ⏰
- Campo de comentarios opcional
- Botón "Submit Review" (deshabilitado hasta que ambos ratings estén completos)

**Navegación:**
- Al presionar "Submit Review" → Va a `/order/feedback-confirmation`

### ✅ Confirmation Screen (`feedback-confirmation.tsx`)

**Características:**
- Ícono de éxito grande (checkmark verde)
- Mensaje de agradecimiento
- Emojis de celebración 🎉⭐🎊
- Tarjeta de estadísticas:
  - Total Orders: 127
  - Avg Rating: 4.8
  - Satisfaction: 95%
- Botones de acción:
  - **"Back to Home"** → Regresa a la pantalla principal
  - **"View Orders"** → Va a la pantalla de órdenes

---

## 🔧 Botones de Prueba Agregados

### En `orders.tsx`:
```tsx
// Header - Dos botones de prueba
<TouchableOpacity onPress={() => router.push('/order/feedback?id=TEST-001')}>
  📝 Feedback
</TouchableOpacity>

<TouchableOpacity onPress={() => router.push('/order/feedback-confirmation')}>
  ✅ Confirm
</TouchableOpacity>
```

### En `tracking.tsx`:
```tsx
// Panel inferior - Botón de prueba verde
<TouchableOpacity onPress={() => router.push(`/order/feedback?id=${orderId}`)}>
  🧪 Test: Go to Feedback
</TouchableOpacity>
```

---

## 🗺️ Mapa de Navegación Completo

```
Home
├── Restaurant Detail
│   └── Cart
│       └── Checkout
│           └── Tracking
│               └── Feedback ← AQUÍ
│                   └── Feedback Confirmation ← Y AQUÍ
│
└── Orders
    ├── 📝 Feedback (botón de prueba)
    └── ✅ Confirm (botón de prueba)
```

---

## 🎬 Pasos para Probar

### Método Rápido (Recomendado):

1. Abre la app en Expo
2. Navega a la pestaña **"Orders"** (ícono de recibo en el tab bar)
3. Presiona el botón **"📝 Feedback"** en el header
4. Califica el restaurante y el courier (selecciona estrellas)
5. Opcionalmente selecciona tags y agrega comentarios
6. Presiona **"Submit Review"**
7. Verás la pantalla de confirmación

### Para Probar el Flujo Completo:

1. Desde **Home**, navega a cualquier restaurante
2. Agrega items al carrito
3. Ve al carrito y presiona "Checkout"
4. Completa el checkout y presiona "Place Order"
5. En la pantalla de tracking, presiona **"🧪 Test: Go to Feedback"**
6. Completa el feedback
7. Ve la confirmación

---

## 🎨 Verificar el Diseño

Las pantallas ya tienen el diseño implementado con:

### Feedback Screen:
- ✅ Header con título y número de orden
- ✅ Sección de rating de restaurante con ícono naranja
- ✅ Sección de rating de courier con ícono azul
- ✅ Sistema de estrellas interactivo (1-5)
- ✅ Tags seleccionables con emojis
- ✅ Campo de texto para comentarios
- ✅ Botón de submit con estado deshabilitado

### Confirmation Screen:
- ✅ Ícono de éxito grande
- ✅ Mensaje de agradecimiento
- ✅ Emojis decorativos
- ✅ Tarjeta de estadísticas naranja
- ✅ Botones de acción (Home y View Orders)

---

## 🔄 Eliminar Botones de Prueba (Producción)

Cuando estés listo para producción, elimina estos botones:

1. En `orders.tsx`: Elimina los botones "📝 Feedback" y "✅ Confirm"
2. En `tracking.tsx`: Elimina el botón "🧪 Test: Go to Feedback"

O simplemente comenta las líneas con `// DEV:` para identificarlas fácilmente.

---

## 📱 Capturas de Pantalla Esperadas

### Feedback:
- Header con "Rate Your Order"
- Dos secciones separadas (restaurante y courier)
- Estrellas grandes y táctiles
- Tags coloridos (naranja cuando seleccionados)
- Campo de texto con placeholder

### Confirmation:
- Checkmark verde grande
- Texto "Thank You!" en grande
- Tarjeta naranja con 3 estadísticas
- Dos botones apilados verticalmente

---

¡Listo! Ahora puedes acceder fácilmente a las pantallas de feedback para verificar el diseño. 🎉
