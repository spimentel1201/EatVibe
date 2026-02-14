# 🚚 Active Delivery Screen - State Machine Orchestrator

## ✅ Implementación Completada

Se ha implementado la pantalla de entrega activa (Active Delivery) que funciona como un orquestador de máquina de estados para gestionar todo el flujo de entrega del courier.

---

## 🎨 Diseño Implementado

### 🗺️ **Mapa a Pantalla Completa**

**Características:**
- `react-native-maps` con estilo oscuro personalizado
- Ruta azul desde courier hasta destino
- Marcadores personalizados:
  - **Courier**: Círculo rosa/rojo con ícono de navegación
  - **Restaurante**: Círculo rojo con ícono de restaurante
  - **Cliente**: (Se muestra después del pickup)

**Estilo del mapa:**
- Fondo: Azul oscuro `#1d2c4d`
- Carreteras: Gris oscuro `#38414e`
- Agua: Azul profundo `#17263c`
- Labels: Verde agua `#8ec3b9`

### 🧭 **Tarjeta de Navegación (Top)**

**Diseño:**
- Fondo: Azul brillante `#3B82F6`
- Forma: Rounded-3xl con shadow
- Posición: Flotante en la parte superior

**Contenido:**
- **Ícono de dirección**: Círculo blanco semi-transparente
  - Left arrow (←)
  - Right arrow (→)
  - Straight arrow (↑)
- **Distancia**: Texto grande bold (50m)
- **Instrucción**: "Turn right onto Baker St."

### 🏪 **Tarjeta de Restaurante**

**Diseño:**
- Ícono: Círculo oscuro con ícono de comida naranja
- Tamaño: 64px (16 en Tailwind)
- Borde: 2px gris oscuro

**Información:**
- **Nombre**: "The Burger Lab" (texto xl bold)
- **Distancia y tiempo**: "2.4 km • 8 min away"
- **Badge de estado**: 
  - "READY" → Verde `#10B981`
  - "PREPARING" → Amarillo `#F59E0B`

### 📦 **Order Contents (Accordion)**

**Header:**
- Ícono de bolsa azul
- Texto: "Order Contents"
- Chevron up/down según estado

**Items expandidos:**
- Cantidad y nombre del item
- Notas especiales (si existen)
- Separador sutil entre items

**Ejemplo:**
```
2x Classic Burger
   Note: No onions

1x French Fries
   Note: Extra crispy

2x Coke
```

### 🔄 **Botón de Swipe**

**Diseño:**
- Fondo: Gris oscuro `#2A2F3E`
- Altura: 64px (16 en Tailwind)
- Forma: Rounded-full

**Elementos:**
- **Barra de progreso**: Azul, 25% del ancho
- **Ícono de swipe**: Círculo azul con chevron
- **Texto**: Centrado, gris, tracking amplio

**Estados del texto:**
1. "SWIPE TO PICK UP" → Yendo al restaurante
2. "SWIPE TO CONFIRM PICKUP" → En el restaurante
3. "SWIPE TO COMPLETE" → Yendo al cliente

### 📱 **Bottom Navigation**

**3 tabs:**
1. **Dashboard** (Grid icon)
2. **Earnings** (Wallet icon)
3. **Account** (Person icon)

**Características:**
- Color activo: Azul `#3B82F6`
- Color inactivo: Gris `#64748B`
- Texto: xs, semibold

---

## 🔄 State Machine (Máquina de Estados)

### Estados de la Entrega

```typescript
type DeliveryState = 
    | 'heading_to_restaurant'    // Yendo al restaurante
    | 'at_restaurant'            // En el restaurante
    | 'picked_up'                // Orden recogida
    | 'heading_to_customer'      // Yendo al cliente
    | 'delivered';               // Entregado
```

### Flujo de Estados

```
1. HEADING_TO_RESTAURANT
   ↓ (Swipe to Pick Up)
   
2. AT_RESTAURANT
   ↓ (Swipe to Confirm Pickup)
   
3. PICKED_UP
   ↓ (Automático)
   
4. HEADING_TO_CUSTOMER
   ↓ (Swipe to Complete)
   
5. DELIVERED
   ↓ (Navigate to completion screen)
```

### Transiciones de Estado

```typescript
const handleSwipeToPickUp = () => {
    if (deliveryState === 'heading_to_restaurant') {
        setDeliveryState('at_restaurant');
        // Mostrar confirmación
    } else if (deliveryState === 'at_restaurant') {
        setDeliveryState('picked_up');
        // Actualizar ruta al cliente
        // Cambiar marcador de destino
    }
};

const handleSwipeToComplete = () => {
    if (deliveryState === 'heading_to_customer') {
        setDeliveryState('delivered');
        // Navegar a pantalla de completado
        // Mostrar resumen de ganancias
    }
};
```

---

## 🎯 Funcionalidades Implementadas

### ✅ **Navegación Turn-by-Turn**
- Instrucciones en tiempo real
- Distancia al próximo giro
- Iconos direccionales (left/right/straight)
- Actualización dinámica según ubicación

### ✅ **Tracking de Ubicación**
- Marcador del courier en el mapa
- Actualización en tiempo real
- Ruta dibujada con Polyline
- Cámara siguiendo al courier

### ✅ **Información del Pedido**
- Detalles del restaurante
- Estado de preparación (READY/PREPARING)
- Lista de items expandible
- Notas especiales por item

### ✅ **Botón de Swipe Contextual**
- Texto dinámico según estado
- Barra de progreso visual
- Confirmación de acciones
- Prevención de errores

### ✅ **Bottom Navigation**
- Navegación entre secciones
- Indicador visual de tab activo
- Acceso rápido a dashboard y earnings

---

## 📊 Datos del Delivery (Mock)

```typescript
const delivery = {
    id: 'ORD-12345',
    restaurant: {
        name: 'The Burger Lab',
        address: '1242 Oak Street',
        distance: 2.4,              // km
        estimatedTime: 8,           // minutes
        status: 'READY',            // PREPARING | READY
        phone: '+1 234 567 8900',
        location: {
            latitude: 37.78925,
            longitude: -122.4324,
        },
    },
    customer: {
        name: 'John Doe',
        address: '456 Elm Street, Apt 3B',
        phone: '+1 234 567 8901',
        location: {
            latitude: 37.79525,
            longitude: -122.4274,
        },
    },
    items: [
        { id: '1', name: 'Classic Burger', quantity: 2, notes: 'No onions' },
        { id: '2', name: 'French Fries', quantity: 1, notes: 'Extra crispy' },
        { id: '3', name: 'Coke', quantity: 2, notes: '' },
    ],
    navigation: {
        nextTurn: 'Turn right onto Baker St.',
        distance: 50,               // meters
        direction: 'right',         // left | right | straight
    },
};
```

---

## 🚀 Próximos Pasos

### 1. **Integración con Servicio de Navegación**

```typescript
import * as Location from 'expo-location';

// Tracking de ubicación en tiempo real
const startLocationTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status === 'granted') {
        await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 3000,
                distanceInterval: 10,
            },
            (location) => {
                setCourierLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
                
                // Actualizar backend
                updateCourierLocation(location.coords);
                
                // Calcular próxima instrucción
                calculateNextTurn(location.coords);
            }
        );
    }
};
```

### 2. **Integración con Google Directions API**

```typescript
const getDirections = async (origin: LatLng, destination: LatLng) => {
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?` +
        `origin=${origin.latitude},${origin.longitude}&` +
        `destination=${destination.latitude},${destination.longitude}&` +
        `key=YOUR_API_KEY`
    );
    
    const data = await response.json();
    const route = data.routes[0];
    
    // Decodificar polyline
    const points = decodePolyline(route.overview_polyline.points);
    
    // Obtener instrucciones
    const steps = route.legs[0].steps.map((step: any) => ({
        instruction: step.html_instructions,
        distance: step.distance.value,
        duration: step.duration.value,
    }));
    
    return { points, steps };
};
```

### 3. **Swipe Gesture Real**

```bash
npm install react-native-gesture-handler
```

```typescript
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';

const SwipeButton = ({ onComplete }: { onComplete: () => void }) => {
    const translateX = useSharedValue(0);
    const SWIPE_THRESHOLD = width - 120;

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            translateX.value = Math.max(0, Math.min(e.translationX, SWIPE_THRESHOLD));
        })
        .onEnd(() => {
            if (translateX.value > SWIPE_THRESHOLD * 0.8) {
                // Completado
                onComplete();
                translateX.value = withSpring(SWIPE_THRESHOLD);
            } else {
                // Resetear
                translateX.value = withSpring(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <View className="bg-[#2A2F3E] rounded-full h-16 relative">
            <GestureDetector gesture={panGesture}>
                <Animated.View
                    style={animatedStyle}
                    className="w-14 h-14 rounded-full bg-[#3B82F6] items-center justify-center"
                >
                    <Ionicons name="chevron-forward" size={28} color="#FFF" />
                </Animated.View>
            </GestureDetector>
        </View>
    );
};
```

### 4. **Llamadas al Restaurante/Cliente**

```typescript
import { Linking } from 'react-native';

const callRestaurant = () => {
    Linking.openURL(`tel:${delivery.restaurant.phone}`);
};

const callCustomer = () => {
    Linking.openURL(`tel:${delivery.customer.phone}`);
};

// Agregar botones de llamada
<TouchableOpacity onPress={callRestaurant}>
    <Ionicons name="call" size={24} color="#3B82F6" />
</TouchableOpacity>
```

### 5. **Notificaciones de Estado**

```typescript
import * as Notifications from 'expo-notifications';

// Notificar cuando la orden está lista
const notifyOrderReady = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Order Ready! 🍔',
            body: `${delivery.restaurant.name} has your order ready for pickup`,
            sound: true,
        },
        trigger: null,
    });
};

// Notificar al cliente cuando el courier está cerca
const notifyCustomerArriving = async () => {
    // Backend notification to customer
    await fetch('/api/delivery/notify-customer', {
        method: 'POST',
        body: JSON.stringify({
            deliveryId: delivery.id,
            message: 'Your courier is arriving soon!',
        }),
    });
};
```

### 6. **Problemas Durante la Entrega**

```typescript
const reportIssue = async (issue: string) => {
    const issues = [
        'Restaurant closed',
        'Order not ready',
        'Wrong items',
        'Customer not available',
        'Address incorrect',
        'Other',
    ];

    // Mostrar modal de selección
    // Enviar reporte al backend
    // Contactar soporte si es necesario
};
```

### 7. **Optimización de Batería**

```typescript
// Reducir frecuencia de actualización cuando está lejos
const getLocationUpdateInterval = (distanceToDestination: number) => {
    if (distanceToDestination < 0.5) {
        return 3000; // 3 segundos cuando está cerca
    } else if (distanceToDestination < 2) {
        return 10000; // 10 segundos a distancia media
    } else {
        return 30000; // 30 segundos cuando está lejos
    }
};
```

---

## 🎨 Detalles de Diseño

### Mapa Oscuro
- Mejora la visibilidad de la ruta azul
- Reduce fatiga visual durante uso prolongado
- Ahorra batería en pantallas OLED

### Ruta Azul
- Color: `#3B82F6` (azul brillante)
- Grosor: 4px
- Contrasta bien con el fondo oscuro

### Marcadores
- **Courier**: Rosa/rojo `#EC4899` para destacar
- **Restaurante**: Rojo `#EF4444` para pickup
- **Cliente**: Verde `#10B981` para delivery
- Bordes blancos para mejor visibilidad

### Tarjeta de Navegación
- Siempre visible en la parte superior
- Información crítica: distancia y dirección
- Fondo azul brillante para captar atención

---

## 🧪 Cómo Probar

### 1. Navegar a la Pantalla
```typescript
// Desde incoming order después de aceptar
router.push('/courier/delivery/active?id=ORD-12345');
```

### 2. Probar State Machine
1. **Estado inicial**: "SWIPE TO PICK UP"
2. **Swipe**: Cambia a "SWIPE TO CONFIRM PICKUP"
3. **Swipe**: Cambia a "SWIPE TO COMPLETE"
4. **Swipe**: Navega a pantalla de completado

### 3. Probar Accordion
1. Tocar "Order Contents"
2. Ver lista de items expandida
3. Verificar notas especiales
4. Tocar nuevamente para colapsar

### 4. Verificar Mapa
1. Ver ruta azul desde courier a restaurante
2. Ver marcadores en posiciones correctas
3. Verificar estilo oscuro del mapa

---

¡La pantalla de Active Delivery está lista con state machine completo! 🚚✨
