# 🚴 Trip Details - Past Order Review

## ✅ Implementación Completada

Se ha implementado la pantalla de Trip Details que muestra el resumen completo de un viaje pasado, incluyendo mapa de ruta, timeline de eventos y desglose financiero detallado.

---

## 🎨 Diseño Implementado

### 🌑 **Tema Oscuro Consistente**
- Fondo principal: `#0A0E27`
- Tarjeta de resumen: `#1A1F3A` con borde `#2A2F4A`
- Mapa con estilo oscuro personalizado

### 📋 **Header**

**Diseño:**
- Botón de back (chevron izquierdo)
- Label: "TRIP REVIEW" (xs, gris, tracking amplio)
- Título: "Order #FR-9928" (lg bold blanco)
- Badge de estado: "COMPLETED" (azul `#3B82F6`)

**Estados del badge:**
- **COMPLETED**: Azul `#3B82F6`
- **CANCELLED**: Rojo `#EF4444`
- **IN PROGRESS**: Naranja `#F59E0B`

### 🗺️ **Map Section**

**Diseño:**
- Altura: 200px
- Rounded-3xl
- Estilo oscuro personalizado
- Scroll y zoom deshabilitados (solo vista)

**Marcadores:**

1. **Restaurante (A)**:
   - Círculo azul `#3B82F6` con letra "A"
   - Borde blanco de 2px
   - Label: "RESTAURANT"
   - Info: "Burger Palace, 5th Ave"
   - Fondo del label: `#0A0E27`

2. **Cliente (B)**:
   - Círculo naranja `#F59E0B` con letra "B"
   - Borde blanco de 2px
   - Label: "CUSTOMER"
   - Info: "Jessica's Home, West St"
   - Fondo del label: `#0A0E27`

**Ruta:**
- Línea azul `#3B82F6`
- Grosor: 3px
- Estilo: Línea punteada (dash pattern [5, 5])
- Conecta restaurante → cliente

### 📅 **Timeline Section**

**Header:**
- "TIMELINE" (sm bold azul `#3B82F6`, tracking amplio)

**3 eventos con diseño vertical:**

1. **Trip Accepted** ✅
   - Ícono: Checkmark circular azul
   - Título: "Trip Accepted" (base bold blanco)
   - Subtítulo: "0.2 miles from your location" (sm gris)
   - Hora: "10:00 AM" (sm gris, alineado a la derecha)

2. **Picked Up** ⏸️
   - Ícono: Pause circular azul
   - Título: "Picked Up" (base bold blanco)
   - Subtítulo: "Order verified at Burger Palace" (sm gris)
   - Hora: "10:15 AM"

3. **Delivered** ⬆️
   - Ícono: Arrow up circular azul
   - Título: "Delivered" (base bold blanco)
   - Subtítulo: "Handed to customer" (sm gris)
   - Hora: "10:30 AM"

**Línea conectora:**
- Entre eventos (excepto el último)
- Color: Azul semi-transparente `#3B82F6/30`
- Grosor: 0.5px (2px en código)
- Altura: 48px

### 💰 **Financial Summary**

**Tarjeta principal:**
- Fondo `#1A1F3A`
- Rounded-3xl
- Padding p-6
- Borde `#2A2F4A`

**Header de la tarjeta:**
- Label: "FINANCIAL SUMMARY" (sm bold azul)
- Badge: "PAID OUT" (azul semi-transparente)

**Total destacado:**
- Label: "Standard Delivery Fare" (xs gris)
- Monto: "$14.50" (4xl bold blanco)
- Borde inferior gris
- Padding bottom

**Desglose (4 líneas):**

1. **Base Fare**:
   - Label: "Base Fare" (base gris)
   - Monto: "$4.00" (lg semibold blanco)

2. **Distance**:
   - Label: "Distance (2.4 mi)" (base gris)
   - Monto: "$2.50" (lg semibold blanco)

3. **Boost Promotion** (destacado):
   - Label: "Boost Promotion" (base gris)
   - Badge: "1.5X" (azul `#3B82F6`)
   - Monto: "+$3.00" (lg bold azul)

4. **Customer Tip**:
   - Label: "Customer Tip" (base gris)
   - Monto: "$5.00" (lg bold verde `#10B981`)

**Botón de Total Trip Earnings:**
- Fondo `#2A2F4A`
- Rounded-2xl
- Padding p-4
- Ícono de billetera en círculo azul
- Label: "TOTAL TRIP EARNINGS" (xs gris)
- Monto: "$14.50" (xl bold blanco)
- Chevron derecho gris

### ⚠️ **Report Issue Button**

**Diseño:**
- Fondo transparente
- Borde naranja `#F59E0B` de 2px
- Rounded-full
- Padding py-4
- Ícono de advertencia naranja
- Texto: "REPORT ISSUE WITH THIS TRIP" (base bold naranja)
- Centrado

---

## 🎯 Funcionalidades Implementadas

### ✅ **Mapa con Ruta**

```typescript
<MapView
    provider={PROVIDER_DEFAULT}
    customMapStyle={darkMapStyle}
    initialRegion={{
        latitude: (restaurant.lat + customer.lat) / 2,
        longitude: (restaurant.lng + customer.lng) / 2,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    }}
    scrollEnabled={false}
    zoomEnabled={false}
>
    {/* Marcadores y ruta */}
</MapView>
```

### ✅ **Timeline de Eventos**

```typescript
interface TimelineEvent {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
    time: string;
    completed: boolean;
}

const timeline: TimelineEvent[] = [
    {
        id: '1',
        icon: 'checkmark-circle',
        title: 'Trip Accepted',
        subtitle: '0.2 miles from your location',
        time: '10:00 AM',
        completed: true,
    },
    // más eventos...
];
```

### ✅ **Desglose Financiero**

```typescript
interface Earnings {
    baseFare: number;
    distance: number;
    distanceMiles: number;
    boostMultiplier?: number;
    boostAmount?: number;
    customerTip: number;
    total: number;
}

const earnings: Earnings = {
    baseFare: 4.00,
    distance: 2.50,
    distanceMiles: 2.4,
    boostMultiplier: 1.5,
    boostAmount: 3.00,
    customerTip: 5.00,
    total: 14.50,
};
```

### ✅ **Estados del Trip**

```typescript
type TripStatus = 'completed' | 'cancelled' | 'in_progress';

const getStatusColor = (status: TripStatus) => {
    switch (status) {
        case 'completed': return '#3B82F6';
        case 'cancelled': return '#EF4444';
        default: return '#F59E0B';
    }
};

const getStatusText = (status: TripStatus) => {
    switch (status) {
        case 'completed': return 'COMPLETED';
        case 'cancelled': return 'CANCELLED';
        default: return 'IN PROGRESS';
    }
};
```

### ✅ **Navegación**

```typescript
const handleReportIssue = () => {
    router.push('/courier/delivery/report-issue');
};

const handleViewEarnings = () => {
    router.push('/courier/earnings');
};
```

---

## 🚀 Próximos Pasos

### 1. **Mapa Interactivo**

```typescript
const [mapInteractive, setMapInteractive] = useState(false);

const toggleMapInteraction = () => {
    setMapInteractive(!mapInteractive);
};

<MapView
    scrollEnabled={mapInteractive}
    zoomEnabled={mapInteractive}
    pitchEnabled={mapInteractive}
    rotateEnabled={mapInteractive}
/>

<TouchableOpacity
    onPress={toggleMapInteraction}
    className="absolute top-4 right-4 bg-white rounded-full p-2"
>
    <Ionicons 
        name={mapInteractive ? 'contract' : 'expand'} 
        size={20} 
        color="#000" 
    />
</TouchableOpacity>
```

### 2. **Ruta Real con Directions API**

```typescript
import MapViewDirections from 'react-native-maps-directions';

const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY';

<MapViewDirections
    origin={tripData.restaurant.coordinates}
    destination={tripData.customer.coordinates}
    apikey={GOOGLE_MAPS_API_KEY}
    strokeWidth={3}
    strokeColor="#3B82F6"
    lineDashPattern={[5, 5]}
    onReady={result => {
        console.log(`Distance: ${result.distance} km`);
        console.log(`Duration: ${result.duration} min`);
    }}
/>
```

### 3. **Timeline Expandible**

```typescript
const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

const toggleEvent = (eventId: string) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
};

{timeline.map((event) => (
    <TouchableOpacity onPress={() => toggleEvent(event.id)}>
        <View>
            <Text>{event.title}</Text>
            {expandedEvent === event.id && (
                <View className="mt-2 bg-[#1A1F3A] rounded-xl p-3">
                    <Text className="text-gray-400 text-sm">
                        Additional details about this event...
                    </Text>
                    {event.id === '2' && (
                        <View>
                            <Text className="text-white">Wait time: 5 min</Text>
                            <Text className="text-white">Items: 3</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    </TouchableOpacity>
))}
```

### 4. **Compartir Recibo**

```typescript
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';

const viewShotRef = useRef(null);

const shareReceipt = async () => {
    const uri = await viewShotRef.current.capture();
    await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share Trip Receipt',
    });
};

<ViewShot ref={viewShotRef}>
    {/* Financial Summary */}
</ViewShot>

<TouchableOpacity onPress={shareReceipt}>
    <Ionicons name="share-social" size={24} color="#3B82F6" />
</TouchableOpacity>
```

### 5. **Descargar Recibo PDF**

```typescript
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';

const downloadReceipt = async () => {
    const html = `
        <html>
            <body>
                <h1>Trip Receipt - Order #${tripData.orderId}</h1>
                <h2>Financial Summary</h2>
                <table>
                    <tr><td>Base Fare</td><td>$${tripData.earnings.baseFare}</td></tr>
                    <tr><td>Distance</td><td>$${tripData.earnings.distance}</td></tr>
                    <tr><td>Boost</td><td>$${tripData.earnings.boostAmount}</td></tr>
                    <tr><td>Tip</td><td>$${tripData.earnings.customerTip}</td></tr>
                    <tr><td><b>Total</b></td><td><b>$${tripData.earnings.total}</b></td></tr>
                </table>
            </body>
        </html>
    `;
    
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
};

<TouchableOpacity onPress={downloadReceipt}>
    <Text>Download PDF</Text>
</TouchableOpacity>
```

### 6. **Fotos de Entrega**

```typescript
interface TripDetails {
    // ... existing fields
    deliveryPhotos?: string[];
    signatureUrl?: string;
}

// Mostrar fotos si existen
{tripData.deliveryPhotos && tripData.deliveryPhotos.length > 0 && (
    <View className="mb-6">
        <Text className="text-[#3B82F6] text-sm font-bold mb-3">
            DELIVERY PROOF
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tripData.deliveryPhotos.map((photo, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => openPhotoViewer(photo)}
                >
                    <Image
                        source={{ uri: photo }}
                        className="w-32 h-32 rounded-2xl mr-3"
                    />
                </TouchableOpacity>
            ))}
        </ScrollView>
    </View>
)}

// Mostrar firma si existe
{tripData.signatureUrl && (
    <View className="mb-6">
        <Text className="text-[#3B82F6] text-sm font-bold mb-3">
            CUSTOMER SIGNATURE
        </Text>
        <Image
            source={{ uri: tripData.signatureUrl }}
            className="w-full h-32 rounded-2xl"
            resizeMode="contain"
        />
    </View>
)}
```

### 7. **Información del Pedido**

```typescript
interface OrderItems {
    name: string;
    quantity: number;
    specialInstructions?: string;
}

interface TripDetails {
    // ... existing fields
    orderItems?: OrderItems[];
    restaurantInstructions?: string;
    customerInstructions?: string;
}

// Sección de items del pedido
<View className="px-6 mb-6">
    <TouchableOpacity
        onPress={() => setShowOrderItems(!showOrderItems)}
        className="flex-row justify-between items-center mb-3"
    >
        <Text className="text-[#3B82F6] text-sm font-bold">
            ORDER ITEMS ({tripData.orderItems?.length || 0})
        </Text>
        <Ionicons
            name={showOrderItems ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#3B82F6"
        />
    </TouchableOpacity>
    
    {showOrderItems && (
        <View className="bg-[#1A1F3A] rounded-2xl p-4">
            {tripData.orderItems?.map((item, index) => (
                <View key={index} className="mb-3">
                    <View className="flex-row justify-between">
                        <Text className="text-white font-semibold">
                            {item.quantity}x {item.name}
                        </Text>
                    </View>
                    {item.specialInstructions && (
                        <Text className="text-gray-400 text-sm mt-1">
                            Note: {item.specialInstructions}
                        </Text>
                    )}
                </View>
            ))}
        </View>
    )}
</View>
```

### 8. **Integración con Backend**

```typescript
const fetchTripDetails = async (tripId: string) => {
    const response = await fetch(`/api/courier/trips/${tripId}`);
    return response.json();
};

useEffect(() => {
    const loadTripDetails = async () => {
        const data = await fetchTripDetails(params.id as string);
        setTripData(data);
    };
    
    loadTripDetails();
}, [params.id]);
```

---

## 🎨 Detalles de Diseño

### Mapa
- **Estilo oscuro**: Coherente con el tema de la app
- **Marcadores personalizados**: Letras A y B con colores distintos
- **Ruta punteada**: Indica el camino recorrido
- **Labels informativos**: Nombres y direcciones

### Timeline
- **Diseño vertical**: Fácil de seguir cronológicamente
- **Íconos azules**: Consistencia visual
- **Línea conectora**: Muestra progresión
- **Horas alineadas**: A la derecha para fácil lectura

### Financial Summary
- **Total destacado**: Monto grande y visible
- **Desglose claro**: Cada componente separado
- **Boost destacado**: Badge azul con multiplicador
- **Tip en verde**: Diferenciación del resto
- **Botón de earnings**: Acceso rápido a detalles

### Report Button
- **Borde naranja**: Llama la atención sin ser intrusivo
- **Ícono de advertencia**: Indica la función
- **Transparente**: No compite con el contenido principal

---

## 🧪 Cómo Probar

### 1. Navegar a la Pantalla
```typescript
// Desde Trip History
router.push(`/courier/trips/${tripId}`);

// Desde Financial History
router.push(`/courier/trips/${tripId}`);
```

### 2. Probar Mapa
1. Ver marcadores A y B
2. Ver ruta punteada
3. Verificar labels

### 3. Probar Timeline
1. Ver 3 eventos
2. Verificar íconos y horas
3. Ver línea conectora

### 4. Probar Financial Summary
1. Ver total destacado
2. Ver desglose completo
3. Tocar botón de earnings

### 5. Probar Report Issue
1. Tocar botón naranja
2. Navega a pantalla de reporte

---

## 📊 Flujo Completo

```
Trip History
    ↓ (Tocar tarjeta)
Trip Details ← ESTAMOS AQUÍ
    ↓ (Report Issue)
Report Issue Screen
    ↓ (View Earnings)
Earnings Hub
```

---

¡La pantalla de Trip Details está lista con mapa, timeline y desglose financiero! 🚴✨
