# Integración de Mapas en EatVibe

## 📦 Instalación

### 1. Instalar react-native-maps

```bash
cd mobile
npx expo install react-native-maps
```

### 2. Configurar permisos (si es necesario)

En `app.json`, agrega los permisos de ubicación:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow EatVibe to use your location to show delivery tracking."
        }
      ]
    ]
  }
}
```

## 🗺️ Implementación en tracking.tsx

Reemplaza el placeholder del mapa con este código:

```tsx
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// Dentro del componente, define las coordenadas
const restaurantLocation = {
    latitude: -12.1191,
    longitude: -77.0350,
};

const courierLocation = {
    latitude: -12.1150,
    longitude: -77.0320,
};

const destinationLocation = {
    latitude: -12.1100,
    longitude: -77.0280,
};

// Reemplaza el View del mapa con:
<MapView
    provider={PROVIDER_GOOGLE}
    style={{ flex: 1 }}
    initialRegion={{
        latitude: -12.1150,
        longitude: -77.0320,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    }}
    customMapStyle={darkMapStyle} // Opcional: estilo oscuro
>
    {/* Marcador del Restaurante */}
    <Marker coordinate={restaurantLocation}>
        <View className="w-8 h-8 rounded-full bg-orange-500 items-center justify-center">
            <View className="w-3 h-3 rounded-full bg-white" />
        </View>
    </Marker>

    {/* Marcador del Courier */}
    <Marker coordinate={courierLocation}>
        <View className="items-center">
            <View className="bg-[#FF5722] px-3 py-1 rounded-full mb-2">
                <Text className="text-white text-xs font-bold">COURIER</Text>
            </View>
            <View className="w-12 h-12 rounded-full bg-[#FF5722] items-center justify-center shadow-lg">
                <Ionicons name="bicycle" size={24} color="#FFF" />
            </View>
        </View>
    </Marker>

    {/* Marcador del Destino (opcional) */}
    <Marker coordinate={destinationLocation}>
        <View className="w-8 h-8 rounded-full bg-green-500 items-center justify-center">
            <Ionicons name="home" size={16} color="#FFF" />
        </View>
    </Marker>
</MapView>
```

## 🎨 Estilo de Mapa Oscuro (Opcional)

Para un mapa con tema oscuro como en el mockup:

```tsx
const darkMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#212121" }]
  },
  {
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#212121" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#2c2c2c" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#212121" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#000000" }]
  }
];
```

## 🔄 Actualización en Tiempo Real

Para actualizar la posición del courier en tiempo real:

```tsx
import { useState, useEffect } from 'react';

const [courierPosition, setCourierPosition] = useState(courierLocation);

useEffect(() => {
    // Simular actualización de posición (reemplazar con WebSocket real)
    const interval = setInterval(() => {
        setCourierPosition(prev => ({
            latitude: prev.latitude + 0.0001,
            longitude: prev.longitude + 0.0001,
        }));
    }, 3000);

    return () => clearInterval(interval);
}, []);
```

## 📍 Seguir al Courier

Para que la cámara siga al courier:

```tsx
import { useRef } from 'react';

const mapRef = useRef<MapView>(null);

useEffect(() => {
    mapRef.current?.animateToRegion({
        latitude: courierPosition.latitude,
        longitude: courierPosition.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    }, 1000);
}, [courierPosition]);

// En el MapView:
<MapView ref={mapRef} ... >
```

## 🛣️ Mostrar Ruta (Polyline)

Para mostrar la ruta entre puntos:

```tsx
import { Polyline } from 'react-native-maps';

// Dentro del MapView:
<Polyline
    coordinates={[
        restaurantLocation,
        courierLocation,
        destinationLocation,
    ]}
    strokeColor="#FF5722"
    strokeWidth={4}
    lineDashPattern={[1]}
/>
```

## 🔧 Funcionalidad del Botón Zoom

```tsx
const handleZoomIn = () => {
    mapRef.current?.animateCamera({
        zoom: 15, // Ajustar según necesidad
    }, { duration: 300 });
};

// En el botón:
<TouchableOpacity 
    onPress={handleZoomIn}
    className="w-12 h-12 rounded-full bg-white items-center justify-center shadow-lg"
>
    <Ionicons name="add" size={28} color="#000" />
</TouchableOpacity>
```

## 📱 Configuración de API Keys

### Para Android:
En `android/app/src/main/AndroidManifest.xml`:

```xml
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="TU_GOOGLE_MAPS_API_KEY"/>
```

### Para iOS:
En `ios/EatVibe/AppDelegate.m`:

```objc
#import <GoogleMaps/GoogleMaps.h>

[GMSServices provideAPIKey:@"TU_GOOGLE_MAPS_API_KEY"];
```

## 🚀 Próximos Pasos

1. Instalar `react-native-maps`
2. Obtener API Key de Google Maps
3. Reemplazar el placeholder con MapView
4. Conectar con backend para obtener posición real del courier
5. Implementar WebSocket para actualizaciones en tiempo real
