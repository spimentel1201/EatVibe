# 🗺️ Configuración de Google Maps API

## ✅ Estado Actual

- ✅ `react-native-maps` instalado
- ✅ Mapa integrado en `tracking.tsx`
- ✅ Permisos de ubicación configurados en `app.json`
- ✅ Estilo de mapa oscuro aplicado
- ✅ Marcadores personalizados (restaurante, courier, destino)
- ✅ Polyline para mostrar la ruta
- ✅ Animación de seguimiento del courier
- ✅ Simulación de movimiento del courier

## 🔑 Próximo Paso: Configurar Google Maps API Key

Para que el mapa funcione en dispositivos reales (Android/iOS), necesitas una API Key de Google Maps.

### 1. Obtener la API Key

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita las siguientes APIs:
   - **Maps SDK for Android**
   - **Maps SDK for iOS**
4. Ve a "Credenciales" → "Crear credenciales" → "Clave de API"
5. Copia la API Key generada

### 2. Configurar para Android

Agrega la API Key en `app.json`:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "TU_GOOGLE_MAPS_API_KEY_AQUI"
        }
      }
    }
  }
}
```

### 3. Configurar para iOS

Agrega la API Key en `app.json`:

```json
{
  "expo": {
    "ios": {
      "config": {
        "googleMapsApiKey": "TU_GOOGLE_MAPS_API_KEY_AQUI"
      }
    }
  }
}
```

### 4. Variables de Entorno (Recomendado)

Para mayor seguridad, usa variables de entorno:

1. Crea un archivo `.env` en la raíz del proyecto mobile:

```env
GOOGLE_MAPS_API_KEY=TU_API_KEY_AQUI
```

2. Instala `expo-constants`:

```bash
npx expo install expo-constants
```

3. Actualiza `app.json` para usar la variable:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "${GOOGLE_MAPS_API_KEY}"
        }
      }
    },
    "ios": {
      "config": {
        "googleMapsApiKey": "${GOOGLE_MAPS_API_KEY}"
      }
    }
  }
}
```

## 🧪 Probar el Mapa

### En Expo Go (Limitado)

```bash
npx expo start
```

**Nota:** Expo Go tiene limitaciones con mapas nativos. Para una experiencia completa, usa un build de desarrollo.

### Build de Desarrollo (Recomendado)

```bash
# Android
npx expo run:android

# iOS
npx expo run:ios
```

## 🎨 Características Implementadas

### ✅ Mapa Interactivo
- Estilo oscuro personalizado
- Zoom funcional
- Gestos táctiles (pan, zoom, rotate)

### ✅ Marcadores Personalizados
- **Restaurante**: Círculo naranja con punto blanco
- **Courier**: Ícono de bicicleta con badge "COURIER"
- **Destino**: Círculo verde con ícono de casa

### ✅ Ruta Dinámica
- Polyline naranja conectando los puntos
- Se actualiza en tiempo real con el movimiento del courier

### ✅ Animaciones
- Seguimiento automático del courier
- Movimiento suave de la cámara
- Simulación de movimiento del courier cada 3 segundos

### ✅ Controles
- Botón de zoom (+)
- Header flotante con botones de navegación
- Panel inferior con información del pedido

## 🔄 Integración con Backend

Para conectar con datos reales del backend, reemplaza la simulación en `tracking.tsx`:

```tsx
// Reemplazar esto:
useEffect(() => {
    if (currentStatus === 'on_the_way') {
        const interval = setInterval(() => {
            setCourierLocation(prev => ({
                latitude: prev.latitude + (Math.random() - 0.5) * 0.0005,
                longitude: prev.longitude + (Math.random() - 0.5) * 0.0005,
            }));
        }, 3000);
        return () => clearInterval(interval);
    }
}, [currentStatus]);

// Por esto (WebSocket o polling):
useEffect(() => {
    const ws = new WebSocket('wss://tu-backend.com/tracking');
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setCourierLocation({
            latitude: data.latitude,
            longitude: data.longitude,
        });
    };

    return () => ws.close();
}, []);
```

## 📱 Funcionalidades Adicionales (Opcional)

### Calcular Distancia y Tiempo Real

```bash
npm install geolib
```

```tsx
import { getDistance } from 'geolib';

const distance = getDistance(
    courierLocation,
    destinationLocation
);

const estimatedMinutes = Math.ceil(distance / 250); // 250m/min promedio
```

### Direcciones con Google Directions API

```tsx
const getDirections = async () => {
    const origin = `${restaurantLocation.latitude},${restaurantLocation.longitude}`;
    const destination = `${destinationLocation.latitude},${destinationLocation.longitude}`;
    
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=YOUR_API_KEY`
    );
    
    const data = await response.json();
    // Procesar y mostrar la ruta
};
```

## 🐛 Troubleshooting

### El mapa no se muestra
- Verifica que la API Key esté correctamente configurada
- Asegúrate de haber habilitado las APIs necesarias en Google Cloud
- Revisa los logs de Expo para errores específicos

### Marcadores no aparecen
- Verifica que las coordenadas sean válidas
- Asegúrate de que los componentes View dentro de Marker tengan dimensiones

### Mapa en blanco en Android
- Verifica que el SHA-1 fingerprint esté registrado en Google Cloud Console
- Ejecuta: `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`

## 📚 Recursos

- [React Native Maps Docs](https://github.com/react-native-maps/react-native-maps)
- [Google Maps Platform](https://developers.google.com/maps)
- [Expo Location Docs](https://docs.expo.dev/versions/latest/sdk/location/)
