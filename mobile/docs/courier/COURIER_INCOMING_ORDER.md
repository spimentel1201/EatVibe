# 📲 Incoming Order Screen - Oferta de Pedido Entrante

## ✅ Implementación Completada

Se ha implementado la pantalla de oferta de pedido entrante (The Offer) para el courier siguiendo fielmente el diseño proporcionado.

---

## 🎨 Diseño Implementado

### 🌑 **Tema Oscuro con Mapa de Fondo**
- Fondo principal: `#0D1F1A` (verde oscuro profundo)
- Patrón de grid simulando mapa
- Líneas de "carreteras" curvas semi-transparentes
- Efecto de profundidad y contexto geográfico

### ⏱️ **Círculo de Progreso Animado**

**Características:**
- **Tamaño**: 224px (56 en Tailwind)
- **Temporizador**: 30 segundos para aceptar/rechazar
- **Animación**: Círculo verde que se completa en sentido horario
- **Auto-rechazo**: Si el tiempo expira, se rechaza automáticamente

**Contenido del círculo:**
- Texto "EARN" en verde pequeño
- Monto en verde brillante: `$8.50` (texto 6xl)
- Badge "HIGH DEMAND" verde (cuando aplica)

**Colores:**
- Borde de fondo: `#1E3A2E` (gris verdoso oscuro)
- Progreso: `#10B981` (verde brillante)
- Badge: Fondo verde, texto oscuro

### 🎯 **Botón REJECT**
- Ubicación: Esquina superior derecha
- Fondo: `#1E3A2E` semi-transparente
- Texto: Gris claro
- Forma: Rounded-full (píldora)
- Padding: px-6 py-2

### 📊 **Información de Distancia y Tiempo**

**Tarjeta horizontal:**
- Fondo: `#1E3A2E/60` (semi-transparente)
- Forma: Rounded-full
- Padding: px-8 py-4

**Elementos:**
1. **Distancia total**:
   - Ícono de navegación verde
   - Número en blanco bold
   - Texto "km total" en gris

2. **Separador vertical**: Línea gris de 1px

3. **Tiempo estimado**:
   - Ícono de reloj verde
   - Número en blanco bold
   - Texto "min" en gris

### 📦 **Tarjeta de Detalles del Pedido**

**Diseño:**
- Fondo: `#1E3A2E/80` semi-transparente
- Bordes redondeados: rounded-3xl
- Padding: p-6
- Ancho: Pantalla completa - 48px

**Elementos:**

1. **Pickup (Restaurante)**:
   - Dot rojo (`#EF4444`)
   - Nombre del restaurante en blanco bold
   - Distancia desde courier en gris

2. **Delivery (Destino)**:
   - Dot verde (`#10B981`)
   - Dirección en blanco semibold
   - Distancia de entrega en gris

3. **Información adicional** (separada con borde):
   - Ícono de bolsa
   - Número de items
   - Badge "Large Order Bonus Included" (cuando aplica)

### ✅ **Botón ACCEPT DELIVERY**

**Características:**
- Fondo: Verde brillante `#10B981`
- Forma: Rounded-full
- Padding: py-5
- Shadow verde brillante
- Texto: Negro oscuro `#0D1F1A`
- Ícono: Flecha hacia adelante
- Tracking amplio en el texto

### 💬 **Hint "Swipe Up"**

**Elementos:**
- Texto: "SWIPE UP TO VIEW MORE DETAILS"
- Color: Gris `#6B7280`
- Tamaño: xs
- Tracking: Extra amplio
- Indicador visual: Barra gris redondeada

---

## 🎯 Funcionalidades Implementadas

### ✅ **Temporizador de 30 Segundos**
```typescript
const [timeLeft, setTimeLeft] = useState(30);

useEffect(() => {
    const timer = setInterval(() => {
        setTimeLeft((prev) => {
            if (prev <= 1) {
                clearInterval(timer);
                handleReject(); // Auto-reject
                return 0;
            }
            return prev - 1;
        });
    }, 1000);

    return () => clearInterval(timer);
}, []);
```

### ✅ **Animación de Progreso**
```typescript
const [progress] = useState(new Animated.Value(0));

useEffect(() => {
    Animated.timing(progress, {
        toValue: 1,
        duration: 30000, // 30 seconds
        useNativeDriver: false,
    }).start();
}, []);
```

### ✅ **Aceptar Pedido**
- Navega a la pantalla de entrega activa
- Pasa el ID del pedido como parámetro
- TODO: Actualizar estado en backend

### ✅ **Rechazar Pedido**
- Regresa al dashboard
- Libera al courier para recibir nuevas ofertas
- TODO: Notificar al backend

### ✅ **Ver Más Detalles**
- Preparado para mostrar modal con información completa
- Items del pedido
- Instrucciones especiales
- Información del cliente

---

## 📊 Datos del Pedido (Mock)

```typescript
const order = {
    id: 'ORD-12345',
    earnings: 8.50,              // Monto a ganar
    isHighDemand: true,          // Zona de alta demanda
    totalDistance: 3.2,          // km totales
    estimatedTime: 15,           // minutos
    restaurant: {
        name: 'Burger King',
        distance: 0.8,           // km desde courier
        address: '1242 Oak Street',
    },
    delivery: {
        address: '1242 Oak Street',
        distance: 2.4,           // km hasta cliente
    },
    items: 2,                    // Número de items
    hasLargeOrderBonus: true,    // Bono por orden grande
};
```

---

## 🔄 Flujo de Usuario

### 1. **Recepción de Oferta**
```
Dashboard (Online) → Notificación Push → Incoming Order Screen
```

### 2. **Decisión del Courier**
```
Opción A: Accept → Active Delivery Screen
Opción B: Reject → Dashboard
Opción C: Timeout (30s) → Auto-reject → Dashboard
```

### 3. **Información Mostrada**
- ✅ Monto a ganar (con bono si aplica)
- ✅ Distancia total del viaje
- ✅ Tiempo estimado
- ✅ Nombre del restaurante
- ✅ Distancia al restaurante
- ✅ Dirección de entrega
- ✅ Distancia de entrega
- ✅ Número de items
- ✅ Bonos especiales

---

## 🚀 Próximos Pasos

### 1. **Integración con Backend**

```typescript
// Aceptar pedido
const acceptOrder = async (orderId: string) => {
    const response = await fetch('/api/courier/orders/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
    });
    return response.json();
};

// Rechazar pedido
const rejectOrder = async (orderId: string, reason?: string) => {
    const response = await fetch('/api/courier/orders/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, reason }),
    });
    return response.json();
};
```

### 2. **Notificaciones Push**

```typescript
import * as Notifications from 'expo-notifications';

// Configurar notificación de nuevo pedido
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

// Recibir notificación
const subscription = Notifications.addNotificationReceivedListener(
    (notification) => {
        const { orderId } = notification.request.content.data;
        router.push(`/courier/order/incoming?id=${orderId}`);
    }
);
```

### 3. **Sonido y Vibración**

```typescript
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

// Reproducir sonido al recibir pedido
const playNotificationSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/new-order.mp3')
    );
    await sound.playAsync();
};

// Vibración
Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Success
);
```

### 4. **Modal de Detalles Completos**

```typescript
// Mostrar modal con swipe up
const [showDetails, setShowDetails] = useState(false);

const OrderDetailsModal = () => (
    <Modal
        animationType="slide"
        transparent={true}
        visible={showDetails}
    >
        <View className="flex-1 bg-black/50">
            <View className="flex-1 bg-[#0D1F1A] rounded-t-3xl mt-32 p-6">
                {/* Detalles completos del pedido */}
                <ScrollView>
                    <Text className="text-white text-xl font-bold mb-4">
                        Order Details
                    </Text>
                    
                    {/* Items del pedido */}
                    <View className="mb-6">
                        <Text className="text-gray-400 text-sm mb-2">Items</Text>
                        {orderItems.map((item) => (
                            <View key={item.id} className="flex-row justify-between mb-2">
                                <Text className="text-white">{item.name} x{item.quantity}</Text>
                                <Text className="text-gray-400">${item.price}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Instrucciones especiales */}
                    <View className="mb-6">
                        <Text className="text-gray-400 text-sm mb-2">Special Instructions</Text>
                        <Text className="text-white">{order.instructions}</Text>
                    </View>

                    {/* Información del cliente */}
                    <View>
                        <Text className="text-gray-400 text-sm mb-2">Customer</Text>
                        <Text className="text-white">{order.customerName}</Text>
                        <Text className="text-gray-400">{order.customerPhone}</Text>
                    </View>
                </ScrollView>
            </View>
        </View>
    </Modal>
);
```

### 5. **Animaciones Mejoradas**

```bash
npm install react-native-reanimated
```

```typescript
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withSequence,
} from 'react-native-reanimated';

// Animación de pulso para el círculo
const scale = useSharedValue(1);

useEffect(() => {
    scale.value = withRepeat(
        withSequence(
            withTiming(1.05, { duration: 1000 }),
            withTiming(1, { duration: 1000 })
        ),
        -1
    );
}, []);

const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
}));
```

### 6. **Historial de Rechazos**

```typescript
// Tracking de rechazos para métricas
const trackRejection = async (orderId: string, reason: string) => {
    await fetch('/api/courier/analytics/rejection', {
        method: 'POST',
        body: JSON.stringify({
            orderId,
            reason,
            timestamp: new Date().toISOString(),
        }),
    });
};
```

---

## 🎨 Detalles de Diseño

### Círculo de Progreso
- **Implementación**: Border animado con rotación
- **Dirección**: Sentido horario (clockwise)
- **Inicio**: Parte superior (12 en punto)
- **Color**: Verde brillante `#10B981`
- **Grosor**: 4px (border-4)

### Patrón de Mapa
- **Grid vertical**: 8 líneas
- **Grid horizontal**: 12 líneas
- **Opacidad**: 20% para efecto sutil
- **Carreteras**: Bordes curvos con rotación
- **Color**: Verde oscuro semi-transparente

### Tipografía
- **Monto**: 6xl (60px), bold, verde
- **Labels**: xs-sm, semibold, gris
- **Nombres**: base-lg, bold/semibold, blanco
- **Distancias**: sm, regular, gris

---

## 🧪 Cómo Probar

### 1. Navegar a la Pantalla
```typescript
// Desde el dashboard cuando llega un pedido
router.push('/courier/order/incoming?id=ORD-12345');
```

### 2. Probar Temporizador
1. Observar el círculo de progreso
2. Ver countdown de 30 segundos
3. Esperar a que expire (auto-reject)

### 3. Probar Acciones
1. **Accept**: Presionar botón verde → Navega a delivery activo
2. **Reject**: Presionar botón gris → Regresa al dashboard
3. **Details**: Tocar "Swipe up" → Muestra modal (próximamente)

### 4. Verificar Datos
1. Monto correcto ($8.50)
2. Badge "HIGH DEMAND" visible
3. Distancias correctas (0.8 km + 2.4 km = 3.2 km total)
4. Tiempo estimado (15 min)
5. Información del restaurante
6. Bono de orden grande

---

## ⚠️ Consideraciones Importantes

### Timeout Automático
- El pedido se rechaza automáticamente después de 30 segundos
- El courier regresa al dashboard
- Se libera para recibir nuevas ofertas

### Cálculo de Ganancias
- Incluye tarifa base
- Bonos por alta demanda
- Bonos por orden grande
- Propinas estimadas (si aplica)

### Métricas del Courier
- Tasa de aceptación
- Tiempo promedio de respuesta
- Razones de rechazo
- Impacto en rating

---

¡La pantalla de Incoming Order está lista y siguiendo fielmente el diseño! 📲✨
