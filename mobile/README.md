# FoodRush Mobile - Consumer App

Aplicación móvil de FoodRush para consumidores, construida con React Native (Expo) y TypeScript.

## 🚀 Stack Tecnológico

- **Framework**: React Native vía Expo SDK 54+
- **Lenguaje**: TypeScript (Strict Mode)
- **Navegación**: Expo Router (File-based routing)
- **Estado del Servidor**: TanStack Query (React Query)
- **Estado Local**: Zustand
- **Estilos**: NativeWind (Tailwind CSS para móvil)
- **Cliente HTTP**: Axios con interceptores JWT
- **Mapas**: react-native-maps
- **Almacenamiento Seguro**: Expo SecureStore

## 📱 Características Implementadas (Sprint 1)

### Autenticación
- ✅ Login con email y contraseña
- ✅ Registro de nuevos usuarios
- ✅ Validación de formularios
- ✅ Manejo de sesión con JWT
- ✅ Refresh token automático
- 🔄 Social login (UI implementada, funcionalidad pendiente)

### Descubrimiento de Restaurantes
- ✅ Geolocalización del usuario
- ✅ Lista de restaurantes cercanos
- ✅ Filtrado por categorías
- ✅ Búsqueda por nombre
- ✅ Ordenamiento por distancia/rating
- ✅ Pull-to-refresh

### Detalle de Restaurante
- ✅ Información del restaurante
- ✅ Menú con items disponibles
- ✅ Header animado al hacer scroll
- ✅ Botón "Agregar al carrito" (UI)

## 🏗️ Arquitectura

El proyecto sigue una arquitectura **Feature-First** con Clean Architecture:

```
src/
├── app/                    # Expo Router (Pantallas)
│   ├── (auth)/            # Grupo de autenticación
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (consumer)/        # Grupo de consumidor
│   │   ├── index.tsx      # Home
│   │   └── restaurant/
│   │       └── [id].tsx   # Detalle
│   ├── _layout.tsx        # Layout raíz
│   └── index.tsx          # Redirect inicial
├── components/
│   ├── ui/                # Componentes UI base
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── LoadingSpinner.tsx
│   └── business/          # Componentes de negocio
│       ├── RestaurantCard.tsx
│       ├── CategoryChip.tsx
│       └── MenuItemCard.tsx
├── core/                  # Lógica transversal
│   ├── api/
│   │   ├── client.ts      # Axios con interceptores
│   │   └── types.ts
│   ├── location/
│   │   └── useLocation.ts
│   └── storage/
│       └── tokenStorage.ts
└── features/              # Módulos de negocio
    ├── auth/
    │   ├── api/
    │   ├── hooks/
    │   └── types/
    └── restaurant/
        ├── api/
        ├── hooks/
        └── types/
```

## 🛠️ Desarrollo

### Instalación

```bash
cd mobile
npm install
```

### Ejecutar en desarrollo

```bash
# Iniciar Expo Dev Server
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS (requiere macOS)
npm run ios

# Ejecutar en Web
npm run web
```

### Scripts disponibles

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Formateo de código
npm run format
```

## 🎨 Diseño

El diseño está basado en el proyecto de Stitch:
- **Proyecto ID**: 17003972511056142404
- **Paleta de colores**: 
  - Primario: `#FF5722`
  - Secundario: `#FFC107`
  - Éxito: `#4CAF50`
  - Error: `#F44336`

### Pantallas implementadas

1. **Login** - Autenticación con email/password
2. **Register** - Registro de nuevos usuarios
3. **Home** - Lista de restaurantes con filtros
4. **Restaurant Detail** - Menú y detalles del restaurante

## 🔐 Credenciales de Prueba

Para probar la aplicación, usa las siguientes credenciales:

```
Email: user@foodrush.com
Password: password
```

## 📡 API

Actualmente la app usa **datos mock** para desarrollo. Los endpoints reales se integrarán cuando el backend esté disponible.

### Endpoints planificados

- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Registro
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/restaurants` - Lista de restaurantes
- `GET /api/v1/restaurants/:id` - Detalle de restaurante
- `GET /api/v1/restaurants/:id/menu` - Menú del restaurante

## 🔄 Estado de Implementación

### ✅ Completado
- Configuración inicial del proyecto
- Infraestructura core (API client, storage, location)
- Módulo de autenticación
- Módulo de restaurantes
- Componentes UI y de negocio
- Navegación con Expo Router
- Pantallas principales

### 🔄 En Progreso
- Carrito de compras
- Proceso de checkout
- Integración con API real

### 📋 Pendiente
- WebSocket para tracking en tiempo real
- Notificaciones push
- Pagos
- Perfil de usuario
- Historial de pedidos

## 📝 Convenciones de Código

- **TypeScript estricto**: Todos los archivos usan tipos estrictos
- **Componentes funcionales**: Solo hooks, no class components
- **Imports con alias**: Usar `@/` para imports desde `src/`
- **NativeWind**: Usar clases de Tailwind para estilos
- **Commits semánticos**: `feat:`, `fix:`, `refactor:`, etc.

## 🐛 Debugging

### Ver logs
```bash
npx expo start
# Presiona 'j' para abrir el debugger
```

### Limpiar caché
```bash
npx expo start -c
```

## 📦 Build

### Development Build
```bash
npx expo prebuild
npx expo run:android
npx expo run:ios
```

### Production Build
```bash
eas build --platform android
eas build --platform ios
```

## 🤝 Contribución

1. Crear una rama desde `develop`: `git checkout -b feature/nueva-funcionalidad`
2. Hacer commits semánticos
3. Ejecutar `npm run type-check` y `npm run lint`
4. Crear Pull Request

## 📄 Licencia

Propietario - FoodRush © 2026
