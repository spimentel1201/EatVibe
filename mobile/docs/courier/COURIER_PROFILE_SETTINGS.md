# 👤 Profile & Settings - Courier Account Management

## ✅ Implementación Completada

Se ha implementado la pantalla de Profile & Settings que permite a los couriers gestionar su cuenta, vehículo, documentos, información bancaria y preferencias de la aplicación.

---

## 🎨 Diseño Implementado

### 🌑 **Tema Oscuro Consistente**
- Fondo principal: `#0A0E27`
- Tarjetas: `#1A1F3A` con bordes `#2A2F4A`
- Íconos circulares: Fondo `#1E3A8A`, ícono azul `#3B82F6`

### 👤 **Profile Header**

**Foto de perfil:**
- Tamaño: 128px (32 en Tailwind)
- Forma: Circular
- Borde: 4px azul `#3B82F6`
- Imagen: URL placeholder o foto del usuario

**Rating Badge:**
- Posición: Esquina inferior derecha de la foto
- Fondo: Azul `#3B82F6`
- Contenido: Estrella + rating (⭐ 4.9)
- Rounded-full, padding px-3 py-1

**Información:**
- **Nombre**: "Alex Thompson" (2xl bold blanco)
- **Partner Info**: 
  - "Partner since 2022" (azul)
  - Dot separator (azul)
  - "E-Bike" (azul)
  - Flex-row con dot de 4px entre textos

### 📋 **Account Management Section**

**Header:**
- "ACCOUNT MANAGEMENT" (xs bold gris, tracking amplio)

**3 opciones de tarjeta:**

1. **My Vehicle**
   - Ícono: Bicicleta azul en círculo azul oscuro
   - Título: "My Vehicle" (base bold blanco)
   - Subtítulo: "RadRunner 2 • FR-9921" (xs gris)
   - Chevron derecho

2. **Documents**
   - Ícono: Documento azul en círculo azul oscuro
   - Título: "Documents" (base bold blanco)
   - Subtítulo: "License expires in 12 days" (xs **naranja** `#F59E0B`)
   - **Warning dot**: Naranja (2px) si hay advertencia
   - Chevron derecho

3. **Bank Details**
   - Ícono: Tarjeta azul en círculo azul oscuro
   - Título: "Bank Details" (base bold blanco)
   - Subtítulo: "Payouts to Chase ****4920" (xs gris)
   - Chevron derecho

**Diseño de tarjetas:**
- Fondo `#1A1F3A`
- Rounded-2xl
- Padding p-4
- Borde `#2A2F4A`
- Gap de 12px entre tarjetas

### ⚙️ **Preferences Section**

**Header:**
- "PREFERENCES" (xs bold gris, tracking amplio)

**2 opciones:**

1. **App Settings**
   - Ícono: Engranaje azul en círculo azul oscuro
   - Título: "App Settings" (base bold blanco)
   - Subtítulo: "Navigation, Dark Mode, Units" (xs gris)
   - Chevron derecho

2. **Preferred Navigation**
   - Ícono: Navegación azul en círculo azul oscuro
   - Título: "Preferred Navigation" (base bold blanco)
   - **Toggle de 2 opciones**:
     - **Google Maps** (activo por defecto)
     - **Waze**
   - Diseño de toggle:
     - Flex-row con gap de 12px
     - Botones rounded-full
     - Activo: Fondo azul `#3B82F6`, texto blanco
     - Inactivo: Fondo `#2A2F4A`, texto gris

### 🚪 **Logout Button**

**Diseño:**
- Texto rojo `#EF4444`
- Ícono de salida rojo
- Font bold, base
- Centrado
- Padding py-4

### 📱 **App Version**

**Texto:**
- "FoodRush Courier v4.12.0 (Night Rider Edition)"
- Color: Gris oscuro `#6B7280`
- Tamaño: xs
- Centrado en la parte inferior

### 📱 **Bottom Navigation**

**4 tabs:**
1. **Dashboard** (Grid icon)
2. **Trips** (Time icon)
3. **Earnings** (Card icon)
4. **Profile** (Person icon) - **ACTIVO**

---

## 🎯 Funcionalidades Implementadas

### ✅ **Navegación a Secciones**

```typescript
const handleMyVehicle = () => {
    router.push('/courier/profile/vehicle');
};

const handleDocuments = () => {
    router.push('/courier/profile/documents');
};

const handleBankDetails = () => {
    router.push('/courier/profile/bank');
};

const handleAppSettings = () => {
    router.push('/courier/profile/settings');
};
```

### ✅ **Toggle de Navegación Preferida**

```typescript
type NavigationApp = 'google' | 'waze';
const [preferredNavigation, setPreferredNavigation] = useState<NavigationApp>('google');

// Guardar preferencia
const saveNavigationPreference = async (app: NavigationApp) => {
    setPreferredNavigation(app);
    // TODO: Guardar en AsyncStorage o backend
    await AsyncStorage.setItem('preferredNavigation', app);
};
```

### ✅ **Logout con Confirmación**

```typescript
const handleLogout = () => {
    Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    // Limpiar tokens
                    await AsyncStorage.removeItem('authToken');
                    await AsyncStorage.removeItem('refreshToken');
                    
                    // Navegar a login
                    router.replace('/auth/login');
                },
            },
        ]
    );
};
```

### ✅ **Warning Indicator**

```typescript
const courierProfile = {
    documents: {
        licenseExpiry: '12 days',
        hasWarning: true, // Muestra dot naranja
    },
};

// En el JSX
{courierProfile.documents.hasWarning && (
    <View className="w-2 h-2 rounded-full bg-[#F59E0B]" />
)}
```

---

## 📊 Estructura de Datos

```typescript
interface CourierProfile {
    name: string;
    photo: string;
    rating: number;
    partnerSince: string;
    vehicleType: string;
    vehicle: {
        type: string;
        plate: string;
    };
    documents: {
        licenseExpiry: string;
        hasWarning: boolean;
    };
    bankDetails: {
        lastFour: string;
        bank: string;
    };
}

const courierProfile: CourierProfile = {
    name: 'Alex Thompson',
    photo: 'https://i.pravatar.cc/300?img=47',
    rating: 4.9,
    partnerSince: '2022',
    vehicleType: 'E-Bike',
    vehicle: {
        type: 'RadRunner 2',
        plate: 'FR-9921',
    },
    documents: {
        licenseExpiry: '12 days',
        hasWarning: true,
    },
    bankDetails: {
        lastFour: '4920',
        bank: 'Chase',
    },
};
```

---

## 🚀 Próximos Pasos

### 1. **Editar Foto de Perfil**

```typescript
import * as ImagePicker from 'expo-image-picker';

const handleEditPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant photo library access');
        return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
    });
    
    if (!result.canceled) {
        // Subir foto al servidor
        await uploadProfilePhoto(result.assets[0].uri);
    }
};
```

### 2. **Pantalla de My Vehicle**

```typescript
// profile/vehicle.tsx
const MyVehicleScreen = () => {
    const [vehicle, setVehicle] = useState({
        type: 'RadRunner 2',
        plate: 'FR-9921',
        color: 'Black',
        year: 2023,
        insurance: {
            provider: 'State Farm',
            policyNumber: 'SF-123456',
            expiryDate: '2025-06-15',
        },
    });
    
    return (
        <ScrollView>
            <VehiclePhoto uri={vehicle.photo} />
            <VehicleInfo vehicle={vehicle} />
            <InsuranceInfo insurance={vehicle.insurance} />
            <Button onPress={editVehicle}>Edit Vehicle</Button>
            <Button onPress={addNewVehicle}>Add New Vehicle</Button>
        </ScrollView>
    );
};
```

### 3. **Pantalla de Documents**

```typescript
// profile/documents.tsx
const DocumentsScreen = () => {
    const [documents, setDocuments] = useState({
        driverLicense: {
            number: 'DL-123456',
            expiryDate: '2024-11-05',
            status: 'expiring_soon', // valid, expiring_soon, expired
            photo: 'url',
        },
        backgroundCheck: {
            completedDate: '2022-01-15',
            status: 'valid',
            expiryDate: '2025-01-15',
        },
        insurance: {
            provider: 'State Farm',
            expiryDate: '2025-06-15',
            status: 'valid',
        },
    });
    
    return (
        <ScrollView>
            <DocumentCard
                title="Driver's License"
                status={documents.driverLicense.status}
                expiryDate={documents.driverLicense.expiryDate}
                onUpload={uploadLicense}
            />
            <DocumentCard
                title="Background Check"
                status={documents.backgroundCheck.status}
                expiryDate={documents.backgroundCheck.expiryDate}
            />
            <DocumentCard
                title="Insurance"
                status={documents.insurance.status}
                expiryDate={documents.insurance.expiryDate}
                onUpload={uploadInsurance}
            />
        </ScrollView>
    );
};
```

### 4. **Pantalla de Bank Details**

```typescript
// profile/bank.tsx
const BankDetailsScreen = () => {
    const [bankAccount, setBankAccount] = useState({
        accountHolderName: 'Alex Thompson',
        bankName: 'Chase',
        accountNumber: '****4920',
        routingNumber: '****1234',
        accountType: 'checking', // checking, savings
    });
    
    const handleAddBankAccount = () => {
        // Usar Stripe Connect o Plaid para agregar cuenta
        router.push('/courier/profile/bank/add');
    };
    
    const handleRemoveBankAccount = () => {
        Alert.alert(
            'Remove Bank Account',
            'Are you sure? You won\'t be able to receive payouts.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: removeBankAccount,
                },
            ]
        );
    };
    
    return (
        <ScrollView>
            <BankAccountCard account={bankAccount} />
            <Button onPress={handleAddBankAccount}>Add Bank Account</Button>
            <Button onPress={handleRemoveBankAccount} variant="danger">
                Remove Bank Account
            </Button>
        </ScrollView>
    );
};
```

### 5. **Pantalla de App Settings**

```typescript
// profile/settings.tsx
const AppSettingsScreen = () => {
    const [settings, setSettings] = useState({
        darkMode: true,
        notifications: {
            orderAlerts: true,
            earningsUpdates: true,
            promotions: false,
        },
        units: {
            distance: 'miles', // miles, kilometers
            currency: 'USD',
        },
        language: 'en',
        autoAcceptOrders: false,
        soundEffects: true,
        hapticFeedback: true,
    });
    
    return (
        <ScrollView>
            <SettingSection title="Appearance">
                <SettingToggle
                    label="Dark Mode"
                    value={settings.darkMode}
                    onChange={(value) => updateSetting('darkMode', value)}
                />
            </SettingSection>
            
            <SettingSection title="Notifications">
                <SettingToggle
                    label="Order Alerts"
                    value={settings.notifications.orderAlerts}
                    onChange={(value) => updateNotification('orderAlerts', value)}
                />
                <SettingToggle
                    label="Earnings Updates"
                    value={settings.notifications.earningsUpdates}
                    onChange={(value) => updateNotification('earningsUpdates', value)}
                />
            </SettingSection>
            
            <SettingSection title="Units">
                <SettingPicker
                    label="Distance"
                    value={settings.units.distance}
                    options={['miles', 'kilometers']}
                    onChange={(value) => updateUnit('distance', value)}
                />
            </SettingSection>
        </ScrollView>
    );
};
```

### 6. **Integración con Backend**

```typescript
// Obtener perfil del courier
const fetchCourierProfile = async () => {
    const response = await fetch('/api/courier/profile');
    const data = await response.json();
    return data;
};

// Actualizar perfil
const updateCourierProfile = async (updates: Partial<CourierProfile>) => {
    const response = await fetch('/api/courier/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    return response.json();
};

// Subir foto de perfil
const uploadProfilePhoto = async (uri: string) => {
    const formData = new FormData();
    formData.append('photo', {
        uri,
        type: 'image/jpeg',
        name: 'profile.jpg',
    } as any);
    
    const response = await fetch('/api/courier/profile/photo', {
        method: 'POST',
        body: formData,
    });
    
    return response.json();
};
```

### 7. **Persistencia de Preferencias**

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Guardar preferencia de navegación
const saveNavigationPreference = async (app: NavigationApp) => {
    await AsyncStorage.setItem('preferredNavigation', app);
};

// Cargar preferencias al iniciar
useEffect(() => {
    const loadPreferences = async () => {
        const nav = await AsyncStorage.getItem('preferredNavigation');
        if (nav) {
            setPreferredNavigation(nav as NavigationApp);
        }
    };
    
    loadPreferences();
}, []);
```

### 8. **Rating y Reviews**

```typescript
const ViewRatingsScreen = () => {
    const [ratings, setRatings] = useState({
        overall: 4.9,
        totalReviews: 1247,
        breakdown: {
            5: 1100,
            4: 120,
            3: 20,
            2: 5,
            1: 2,
        },
        recentReviews: [
            {
                id: '1',
                customer: 'John D.',
                rating: 5,
                comment: 'Fast and friendly!',
                date: '2024-10-20',
            },
            // más reviews...
        ],
    });
    
    return (
        <ScrollView>
            <RatingOverview
                overall={ratings.overall}
                total={ratings.totalReviews}
                breakdown={ratings.breakdown}
            />
            <ReviewsList reviews={ratings.recentReviews} />
        </ScrollView>
    );
};
```

---

## 🎨 Detalles de Diseño

### Profile Header
- **Foto circular**: Borde azul de 4px para destacar
- **Rating badge**: Posicionado en esquina con z-index
- **Info del partner**: Separadores con dots azules

### Account Management
- **Íconos consistentes**: Todos en círculos azules
- **Warning indicator**: Dot naranja para documentos que expiran
- **Chevrons**: Indican que son clickeables

### Preferences
- **Toggle de navegación**: Botones tipo pill con estado activo/inactivo
- **Diseño inline**: Preferencia de navegación muestra opciones directamente

### Logout
- **Color rojo**: Indica acción destructiva
- **Confirmación**: Alert antes de ejecutar

---

## 🧪 Cómo Probar

### 1. Navegar a la Pantalla
```typescript
// Desde bottom navigation
setActiveTab('profile');

// Directo
router.push('/courier/profile');
```

### 2. Probar Navegación
1. Tocar "My Vehicle" → Navega a vehículo
2. Tocar "Documents" → Navega a documentos
3. Tocar "Bank Details" → Navega a banco
4. Tocar "App Settings" → Navega a configuración

### 3. Probar Toggle de Navegación
1. Tocar "Google Maps" → Se activa
2. Tocar "Waze" → Se activa
3. Verificar cambio visual

### 4. Probar Logout
1. Tocar "Logout"
2. Ver alert de confirmación
3. Tocar "Cancel" → No hace nada
4. Tocar "Logout" → Navega a login

---

¡La pantalla de Profile & Settings está lista! 👤✨
