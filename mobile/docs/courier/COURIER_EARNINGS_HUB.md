# 💰 Earnings Hub & Payouts - Financial Dashboard

## ✅ Implementación Completada

Se ha implementado la pantalla de Earnings Hub que permite a los couriers ver sus ganancias semanales, balance disponible, realizar retiros y revisar el historial de transacciones.

---

## 🎨 Diseño Implementado

### 🌑 **Tema Oscuro Consistente**
- Fondo principal: `#0A0E27` (igual que dashboard)
- Tarjetas: `#1A1F3A` con bordes `#2A2F4A`
- Tarjeta de retiro: `#1E3A8A` (azul oscuro)

### 📋 **Header**

**Elementos:**
- **Título**: "Earnings Hub" (3xl bold blanco)
- **Período**: "Oct 16 - Oct 22" (sm gris)
- **Botón calendario**: Círculo con ícono (esquina superior derecha)

### 📊 **Gráfico de Barras Semanal**

**Diseño:**
- Tarjeta con fondo `#1A1F3A`
- Bordes redondeados (rounded-3xl)
- Padding generoso (p-6)

**Elementos:**
- **7 barras** (M-S) representando cada día
- **Altura dinámica** basada en el monto del día
- **Color de barras**: Gris oscuro `#2A2F4A`
- **Labels de días**: Gris `#6B7280`, xs, semibold
- **Altura del gráfico**: 120px

**Weekly Total:**
- Separador superior (border-t)
- Label "Weekly Total" en gris
- Monto en verde `#10B981` (xl bold)
- Formato: "+$642.50"

### 💵 **Available for Withdrawal Card**

**Diseño:**
- Fondo azul oscuro `#1E3A8A`
- Borde azul semi-transparente `#3B82F6/30`
- Rounded-3xl, padding p-6

**Elementos:**

1. **Label superior**:
   - "AVAILABLE FOR WITHDRAWAL"
   - Color azul `#3B82F6`
   - Tamaño xs, bold, tracking extra amplio
   - Centrado

2. **Monto**:
   - Texto blanco, 5xl (48px), bold
   - Centrado
   - Formato: "$250.00"

3. **Botón Cash Out**:
   - Fondo azul `#3B82F6`
   - Rounded-full
   - Ícono de tarjeta + texto "Cash Out Now"
   - Padding py-4

4. **Info de disponibilidad**:
   - Ícono de información + texto
   - Color gris `#9CA3AF`
   - Tamaño xs
   - "Funds are typically available within 15 minutes"

### 📜 **Recent Transactions**

**Header:**
- Título "Recent Transactions" (xl bold)
- Link "See All" en azul `#3B82F6`
- Flex-row con justify-between

**Tarjetas de transacción:**
- Fondo `#1A1F3A`
- Rounded-2xl
- Padding p-4
- Borde `#2A2F4A`
- Gap de 12px entre tarjetas

**Elementos de cada transacción:**

1. **Ícono** (48px circular):
   - **Delivery**: Bicicleta verde en fondo verde oscuro
   - **Payout**: Tarjeta azul en fondo azul oscuro
   - **Bonus**: Estrella naranja en fondo naranja oscuro
   - **Tip**: Efectivo púrpura en fondo púrpura oscuro

2. **Información**:
   - Título en blanco semibold
   - Fecha/hora en gris xs

3. **Monto**:
   - Verde `#10B981` para ingresos (+)
   - Gris `#9CA3AF` para egresos (-)
   - Tamaño lg, bold
   - Formato: "+$12.50" o "-$100.00"

### 📱 **Bottom Navigation**

**4 tabs:**
1. **Dashboard** (Grid icon)
2. **Trips** (List icon)
3. **Earnings** (Card icon) - **ACTIVO**
4. **Profile** (Person icon)

**Características:**
- Tab activo: Azul `#3B82F6` con dot indicador
- Tab inactivo: Gris `#64748B`
- Borde superior sutil

---

## 🎯 Funcionalidades Implementadas

### ✅ **Gráfico de Barras Dinámico**

```typescript
const weeklyEarnings = {
    period: 'Oct 16 - Oct 22',
    days: [
        { day: 'M', amount: 45.50 },
        { day: 'T', amount: 78.20 },
        // ... más días
    ],
    total: 642.50,
};

const maxEarning = Math.max(...weeklyEarnings.days.map(d => d.amount));

// Altura de cada barra basada en el máximo
const heightPercentage = (day.amount / maxEarning) * 100;
```

### ✅ **Tipos de Transacciones**

```typescript
type TransactionType = 'delivery' | 'payout' | 'bonus' | 'tip';

const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
        case 'delivery':
            return { name: 'bicycle', color: '#10B981', bg: '#065F46' };
        case 'payout':
            return { name: 'card-outline', color: '#3B82F6', bg: '#1E3A8A' };
        case 'bonus':
            return { name: 'star', color: '#F59E0B', bg: '#78350F' };
        case 'tip':
            return { name: 'cash-outline', color: '#8B5CF6', bg: '#4C1D95' };
    }
};
```

### ✅ **Navegación**

```typescript
const handleCashOut = () => {
    router.push('/courier/earnings/cash-out');
};

const handleSeeAllTransactions = () => {
    router.push('/courier/earnings/transactions');
};
```

### ✅ **Bottom Navigation Funcional**

- Navegación entre secciones
- Indicador visual de tab activo
- Dot indicador en Earnings

---

## 📊 Datos Mock

```typescript
const weeklyEarnings = {
    period: 'Oct 16 - Oct 22',
    days: [
        { day: 'M', amount: 45.50 },
        { day: 'T', amount: 78.20 },
        { day: 'W', amount: 92.30 },
        { day: 'T', amount: 65.80 },
        { day: 'F', amount: 120.50 },
        { day: 'S', amount: 150.70 },
        { day: 'S', amount: 89.50 },
    ],
    total: 642.50,
};

const availableBalance = 250.00;

const recentTransactions = [
    {
        type: 'delivery',
        title: 'Delivery #4920',
        date: 'Oct 20, 14:32',
        amount: 12.50,
    },
    {
        type: 'payout',
        title: 'Payout to Bank',
        date: 'Oct 19, 09:15',
        amount: -100.00,
    },
    // ... más transacciones
];
```

---

## 🚀 Próximos Pasos

### 1. **Integración con Backend**

```typescript
// Obtener ganancias semanales
const fetchWeeklyEarnings = async (startDate: string, endDate: string) => {
    const response = await fetch(
        `/api/courier/earnings/weekly?start=${startDate}&end=${endDate}`
    );
    return response.json();
};

// Obtener balance disponible
const fetchAvailableBalance = async () => {
    const response = await fetch('/api/courier/earnings/balance');
    const data = await response.json();
    return data.availableBalance;
};

// Obtener transacciones
const fetchTransactions = async (limit: number = 5) => {
    const response = await fetch(`/api/courier/transactions?limit=${limit}`);
    return response.json();
};
```

### 2. **Selector de Rango de Fechas**

```typescript
import DateTimePicker from '@react-native-community/datetimepicker';

const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(),
});

const handleDateRangeChange = (start: Date, end: Date) => {
    setDateRange({ start, end });
    fetchWeeklyEarnings(start.toISOString(), end.toISOString());
};
```

### 3. **Pantalla de Cash Out**

```typescript
// cash-out.tsx
const CashOutScreen = () => {
    const [amount, setAmount] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('instant');
    
    const payoutMethods = [
        {
            id: 'instant',
            name: 'Instant Payout',
            fee: 1.50,
            time: '15 minutes',
        },
        {
            id: 'standard',
            name: 'Standard Payout',
            fee: 0,
            time: '1-3 business days',
        },
    ];
    
    const handleCashOut = async () => {
        const response = await fetch('/api/courier/payout', {
            method: 'POST',
            body: JSON.stringify({
                amount: parseFloat(amount),
                method: selectedMethod,
            }),
        });
        
        if (response.ok) {
            Alert.alert('Success', 'Payout initiated successfully!');
            router.back();
        }
    };
    
    return (
        // UI para seleccionar monto y método de pago
    );
};
```

### 4. **Pantalla de Todas las Transacciones**

```typescript
// transactions.tsx
const AllTransactionsScreen = () => {
    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState('all'); // all, delivery, payout, bonus, tip
    const [page, setPage] = useState(1);
    
    const loadMore = async () => {
        const newTransactions = await fetchTransactions(page + 1);
        setTransactions([...transactions, ...newTransactions]);
        setPage(page + 1);
    };
    
    return (
        <FlatList
            data={transactions.filter(t => filter === 'all' || t.type === filter)}
            renderItem={({ item }) => <TransactionCard transaction={item} />}
            onEndReached={loadMore}
            ListHeaderComponent={<FilterTabs />}
        />
    );
};
```

### 5. **Gráfico Interactivo**

```bash
npm install react-native-chart-kit
```

```typescript
import { BarChart } from 'react-native-chart-kit';

<BarChart
    data={{
        labels: weeklyEarnings.days.map(d => d.day),
        datasets: [{
            data: weeklyEarnings.days.map(d => d.amount),
        }],
    }}
    width={width - 48}
    height={220}
    chartConfig={{
        backgroundColor: '#1A1F3A',
        backgroundGradientFrom: '#1A1F3A',
        backgroundGradientTo: '#1A1F3A',
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        style: {
            borderRadius: 16,
        },
    }}
    style={{
        marginVertical: 8,
        borderRadius: 16,
    }}
/>
```

### 6. **Notificaciones de Pago**

```typescript
import * as Notifications from 'expo-notifications';

const notifyPayoutComplete = async (amount: number) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Payout Complete! 💰',
            body: `$${amount.toFixed(2)} has been sent to your bank account`,
            sound: true,
        },
        trigger: null,
    });
};
```

### 7. **Exportar Reporte**

```typescript
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const exportEarningsReport = async (startDate: Date, endDate: Date) => {
    const transactions = await fetchTransactions(startDate, endDate);
    
    // Generar CSV
    const csv = generateCSV(transactions);
    
    // Guardar archivo
    const fileUri = FileSystem.documentDirectory + 'earnings_report.csv';
    await FileSystem.writeAsStringAsync(fileUri, csv);
    
    // Compartir
    await Sharing.shareAsync(fileUri);
};

const generateCSV = (transactions: Transaction[]) => {
    const header = 'Date,Type,Description,Amount\n';
    const rows = transactions.map(t => 
        `${t.date},${t.type},${t.title},${t.amount}`
    ).join('\n');
    
    return header + rows;
};
```

### 8. **Estadísticas Adicionales**

```typescript
const EarningsStats = () => {
    const stats = {
        averagePerDelivery: 12.50,
        totalDeliveries: 52,
        totalTips: 45.50,
        totalBonuses: 30.00,
        peakEarningDay: 'Saturday',
    };
    
    return (
        <View>
            <StatCard
                label="Average per Delivery"
                value={`$${stats.averagePerDelivery.toFixed(2)}`}
                icon="trending-up"
            />
            <StatCard
                label="Total Deliveries"
                value={stats.totalDeliveries}
                icon="bicycle"
            />
            {/* Más stats */}
        </View>
    );
};
```

---

## 🎨 Detalles de Diseño

### Gráfico de Barras
- **Altura mínima**: 10% para días con pocas ganancias
- **Altura máxima**: 100% para el día con más ganancias
- **Ancho de barras**: 32px (8 en Tailwind)
- **Espaciado**: Distribuido equitativamente

### Tarjeta de Retiro
- **Fondo azul oscuro**: Destaca del resto de la UI
- **Borde azul brillante**: Llama la atención
- **Botón prominente**: Acción principal clara
- **Info de tiempo**: Tranquiliza al usuario

### Transacciones
- **Íconos de colores**: Identificación rápida del tipo
- **Montos verdes/grises**: Ingresos vs egresos
- **Fecha/hora**: Contexto temporal
- **Diseño consistente**: Fácil de escanear

---

## 🧪 Cómo Probar

### 1. Navegar a la Pantalla
```typescript
// Desde dashboard
router.push('/courier/earnings');

// Desde bottom navigation
setActiveTab('earnings');
```

### 2. Probar Gráfico
1. Ver barras de diferentes alturas
2. Verificar labels de días (M-S)
3. Ver total semanal en verde

### 3. Probar Cash Out
1. Presionar "Cash Out Now"
2. Navega a pantalla de retiro (próximamente)

### 4. Probar Transacciones
1. Ver lista de transacciones
2. Verificar íconos de colores
3. Ver montos positivos/negativos
4. Presionar "See All"

### 5. Probar Bottom Navigation
1. Tocar cada tab
2. Verificar cambio de color
3. Ver dot indicador en Earnings

---

¡La pantalla de Earnings Hub está lista con gráficos y transacciones! 💰✨
