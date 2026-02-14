# 📜 Financial History - All Transactions

## ✅ Implementación Completada

Se ha implementado la pantalla de Financial History que muestra todas las transacciones del courier con búsqueda, filtros y agrupación por fecha.

---

## 🎨 Diseño Implementado

### 🌑 **Tema Oscuro Consistente**
- Fondo principal: `#0A0E27`
- Tarjetas: `#1A1F3A` con bordes `#2A2F4A`
- Íconos circulares con colores específicos por tipo

### 📋 **Header**

**Título:**
- "Financial History" (3xl bold blanco)

**Barra de búsqueda:**
- Fondo `#1A1F3A`, rounded-full
- Ícono de lupa gris
- Placeholder: "Search transactions..."
- Borde `#2A2F4A`

**Botón de calendario:**
- Círculo de 48px
- Fondo `#1A1F3A`
- Ícono de calendario blanco
- Borde `#2A2F4A`

### 🔘 **Filter Pills**

**3 filtros:**
- **All** (activo por defecto)
- **Earnings**
- **Withdrawals**

**Estados:**
- **Activo**: Fondo azul `#3B82F6`, texto blanco
- **Inactivo**: Fondo `#1A1F3A`, borde `#2A2F4A`, texto gris

**Diseño:**
- Rounded-full
- Padding: px-6 py-3
- Gap de 12px entre pills

### 📅 **Date Headers**

**Formato:**
- "TODAY, OCT 25"
- "YESTERDAY, OCT 24"
- "OCT 23, 2023"
- Texto gris `#6B7280`
- Tamaño xs, bold, tracking amplio

### 💳 **Transaction Cards**

**Diseño de tarjeta:**
- Fondo `#1A1F3A`
- Rounded-2xl
- Padding p-4
- Borde `#2A2F4A`
- Gap de 12px entre tarjetas

**Elementos de cada transacción:**

1. **Ícono** (48px circular):
   - **Delivery** (Order): Bicicleta azul `#3B82F6` en fondo `#1E3A8A`
   - **Payout**: Tarjeta roja `#EF4444` en fondo `#7F1D1D`
   - **Bonus**: Estrella naranja `#F59E0B` en fondo `#78350F`
   - **Tip**: Efectivo púrpura `#8B5CF6` en fondo `#4C1D95`

2. **Información**:
   - Título: "Order #4521" (base bold blanco)
   - Subtítulo: "12:30 PM • 3.2 miles" (xs gris)

3. **Monto**:
   - Verde `#10B981` para ingresos (+)
   - Rojo `#EF4444` para egresos (-)
   - Tamaño lg, bold
   - Formato: "+$8.50" o "-$120.00"

### 📱 **Bottom Navigation**

**4 tabs:**
1. **Dashboard** (Grid icon)
2. **Trips** (Time icon)
3. **Earnings** (Card icon) - **ACTIVO**
4. **Profile** (Person icon)

---

## 🎯 Funcionalidades Implementadas

### ✅ **Sistema de Filtros**

```typescript
type FilterType = 'all' | 'earnings' | 'withdrawals';
const [activeFilter, setActiveFilter] = useState<FilterType>('all');

const filterTransactions = (groups: TransactionGroup[]): TransactionGroup[] => {
    return groups.map(group => ({
        ...group,
        transactions: group.transactions.filter(t => {
            // Filter by type
            if (activeFilter === 'earnings' && t.amount < 0) return false;
            if (activeFilter === 'withdrawals' && t.amount > 0) return false;
            
            return true;
        }),
    })).filter(group => group.transactions.length > 0);
};
```

### ✅ **Búsqueda en Tiempo Real**

```typescript
const [searchQuery, setSearchQuery] = useState('');

// En el filtro
if (searchQuery) {
    const query = searchQuery.toLowerCase();
    return (
        t.title.toLowerCase().includes(query) ||
        t.subtitle.toLowerCase().includes(query)
    );
}
```

### ✅ **Agrupación por Fecha**

```typescript
interface TransactionGroup {
    date: string;
    label: string;
    transactions: Transaction[];
}

const allTransactions: TransactionGroup[] = [
    {
        date: '2024-10-25',
        label: 'TODAY, OCT 25',
        transactions: [...],
    },
    {
        date: '2024-10-24',
        label: 'YESTERDAY, OCT 24',
        transactions: [...],
    },
];
```

### ✅ **Tipos de Transacciones**

```typescript
type TransactionType = 'delivery' | 'payout' | 'bonus' | 'tip' | 'adjustment';

const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
        case 'delivery':
            return { name: 'bicycle', color: '#3B82F6', bg: '#1E3A8A' };
        case 'payout':
            return { name: 'card', color: '#EF4444', bg: '#7F1D1D' };
        case 'bonus':
            return { name: 'star', color: '#F59E0B', bg: '#78350F' };
        case 'tip':
            return { name: 'cash', color: '#8B5CF6', bg: '#4C1D95' };
        case 'adjustment':
            return { name: 'swap-horizontal', color: '#6B7280', bg: '#374151' };
    }
};
```

### ✅ **Empty State**

```typescript
{filteredData.length === 0 && (
    <View className="items-center justify-center py-20">
        <Ionicons name="receipt-outline" size={64} color="#374151" />
        <Text className="text-gray-500 text-lg mt-4">
            No transactions found
        </Text>
        <Text className="text-gray-600 text-sm mt-2">
            Try adjusting your filters
        </Text>
    </View>
)}
```

---

## 🚀 Próximos Pasos

### 1. **Selector de Rango de Fechas**

```typescript
import DateTimePicker from '@react-native-community/datetimepicker';

const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(),
});
const [showDatePicker, setShowDatePicker] = useState(false);

const handleDatePicker = () => {
    setShowDatePicker(true);
};

const handleDateChange = (start: Date, end: Date) => {
    setDateRange({ start, end });
    fetchTransactionsByDateRange(start, end);
};

// Modal de date picker
<Modal visible={showDatePicker}>
    <DateRangePicker
        startDate={dateRange.start}
        endDate={dateRange.end}
        onChange={handleDateChange}
        onClose={() => setShowDatePicker(false)}
    />
</Modal>
```

### 2. **Infinite Scroll / Paginación**

```typescript
const [page, setPage] = useState(1);
const [loading, setLoading] = useState(false);
const [hasMore, setHasMore] = useState(true);

const loadMoreTransactions = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    const newTransactions = await fetchTransactions(page + 1);
    
    if (newTransactions.length === 0) {
        setHasMore(false);
    } else {
        setAllTransactions([...allTransactions, ...newTransactions]);
        setPage(page + 1);
    }
    
    setLoading(false);
};

<FlatList
    data={filteredData}
    renderItem={({ item }) => <TransactionGroup group={item} />}
    onEndReached={loadMoreTransactions}
    onEndReachedThreshold={0.5}
    ListFooterComponent={loading ? <ActivityIndicator /> : null}
/>
```

### 3. **Exportar a CSV/PDF**

```typescript
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const exportTransactions = async (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
        const csv = generateCSV(filteredData);
        const fileUri = FileSystem.documentDirectory + 'transactions.csv';
        await FileSystem.writeAsStringAsync(fileUri, csv);
        await Sharing.shareAsync(fileUri);
    } else {
        // Generate PDF
        const pdfUri = await generatePDF(filteredData);
        await Sharing.shareAsync(pdfUri);
    }
};

const generateCSV = (groups: TransactionGroup[]) => {
    const header = 'Date,Time,Type,Description,Amount\n';
    const rows = groups.flatMap(g => 
        g.transactions.map(t => 
            `${t.date},${t.time},${t.type},${t.title},${t.amount}`
        )
    ).join('\n');
    
    return header + rows;
};

// Botón de exportar en el header
<TouchableOpacity onPress={() => exportTransactions('csv')}>
    <Ionicons name="download-outline" size={24} color="#3B82F6" />
</TouchableOpacity>
```

### 4. **Pull to Refresh**

```typescript
import { RefreshControl } from 'react-native';

const [refreshing, setRefreshing] = useState(false);

const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
};

<ScrollView
    refreshControl={
        <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
        />
    }
>
    {/* Content */}
</ScrollView>
```

### 5. **Detalles de Transacción**

```typescript
// earnings/transaction/[id].tsx
const TransactionDetailsScreen = () => {
    const { id } = useLocalSearchParams();
    const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
    
    useEffect(() => {
        fetchTransactionDetails(id).then(setTransaction);
    }, [id]);
    
    if (!transaction) return <LoadingSpinner />;
    
    return (
        <ScrollView>
            {/* Header con tipo y monto */}
            <TransactionHeader
                type={transaction.type}
                amount={transaction.amount}
                date={transaction.date}
            />
            
            {/* Detalles según tipo */}
            {transaction.type === 'delivery' && (
                <DeliveryDetails
                    orderId={transaction.orderId}
                    restaurant={transaction.restaurant}
                    customer={transaction.customer}
                    breakdown={transaction.breakdown}
                />
            )}
            
            {transaction.type === 'payout' && (
                <PayoutDetails
                    method={transaction.payoutMethod}
                    bankAccount={transaction.bankAccount}
                    status={transaction.status}
                />
            )}
            
            {/* Botones de acción */}
            <Button onPress={reportIssue}>Report Issue</Button>
            <Button onPress={downloadReceipt}>Download Receipt</Button>
        </ScrollView>
    );
};
```

### 6. **Filtros Avanzados**

```typescript
const [advancedFilters, setAdvancedFilters] = useState({
    minAmount: 0,
    maxAmount: 1000,
    types: ['delivery', 'payout', 'bonus', 'tip'],
    sortBy: 'date', // date, amount
    sortOrder: 'desc', // asc, desc
});

const applyAdvancedFilters = (transactions: Transaction[]) => {
    return transactions.filter(t => {
        // Amount range
        const amount = Math.abs(t.amount);
        if (amount < advancedFilters.minAmount || amount > advancedFilters.maxAmount) {
            return false;
        }
        
        // Type filter
        if (!advancedFilters.types.includes(t.type)) {
            return false;
        }
        
        return true;
    }).sort((a, b) => {
        if (advancedFilters.sortBy === 'date') {
            return advancedFilters.sortOrder === 'desc'
                ? new Date(b.date).getTime() - new Date(a.date).getTime()
                : new Date(a.date).getTime() - new Date(b.date).getTime();
        } else {
            return advancedFilters.sortOrder === 'desc'
                ? b.amount - a.amount
                : a.amount - b.amount;
        }
    });
};

// Modal de filtros avanzados
<Modal visible={showAdvancedFilters}>
    <AdvancedFiltersModal
        filters={advancedFilters}
        onChange={setAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
    />
</Modal>
```

### 7. **Estadísticas del Período**

```typescript
const calculateStats = (transactions: Transaction[]) => {
    const earnings = transactions.filter(t => t.amount > 0);
    const withdrawals = transactions.filter(t => t.amount < 0);
    
    return {
        totalEarnings: earnings.reduce((sum, t) => sum + t.amount, 0),
        totalWithdrawals: Math.abs(withdrawals.reduce((sum, t) => sum + t.amount, 0)),
        netBalance: transactions.reduce((sum, t) => sum + t.amount, 0),
        transactionCount: transactions.length,
        averageEarning: earnings.reduce((sum, t) => sum + t.amount, 0) / earnings.length,
    };
};

// Mostrar en header expandible
<TouchableOpacity onPress={() => setShowStats(!showStats)}>
    <View className="bg-[#1A1F3A] rounded-2xl p-4">
        <Text className="text-gray-400 text-xs">PERIOD SUMMARY</Text>
        {showStats && (
            <View>
                <StatRow label="Total Earnings" value={`$${stats.totalEarnings}`} />
                <StatRow label="Total Withdrawals" value={`$${stats.totalWithdrawals}`} />
                <StatRow label="Net Balance" value={`$${stats.netBalance}`} />
            </View>
        )}
    </View>
</TouchableOpacity>
```

### 8. **Integración con Backend**

```typescript
// Fetch transactions con filtros
const fetchTransactions = async (
    filter: FilterType,
    dateRange?: { start: Date; end: Date },
    page: number = 1
) => {
    const params = new URLSearchParams({
        filter,
        page: page.toString(),
        limit: '20',
    });
    
    if (dateRange) {
        params.append('startDate', dateRange.start.toISOString());
        params.append('endDate', dateRange.end.toISOString());
    }
    
    const response = await fetch(`/api/courier/transactions?${params}`);
    return response.json();
};

// Usar en useEffect
useEffect(() => {
    fetchTransactions(activeFilter, dateRange).then(setAllTransactions);
}, [activeFilter, dateRange]);
```

---

## 🎨 Detalles de Diseño

### Search Bar
- **Rounded-full**: Diseño moderno y limpio
- **Ícono de lupa**: Indica funcionalidad de búsqueda
- **Placeholder gris**: No distrae del contenido

### Filter Pills
- **3 opciones claras**: All, Earnings, Withdrawals
- **Estado activo destacado**: Azul brillante
- **Transición suave**: Cambio visual inmediato

### Transaction Cards
- **Íconos de colores**: Identificación rápida del tipo
- **Montos con colores**: Verde para ingresos, rojo para egresos
- **Información compacta**: Título + subtítulo en 2 líneas

### Date Headers
- **Agrupación clara**: Fácil de escanear por fecha
- **Formato inteligente**: TODAY, YESTERDAY, fecha completa

---

## 🧪 Cómo Probar

### 1. Navegar a la Pantalla
```typescript
// Desde Earnings Hub
router.push('/courier/earnings/transactions');

// Desde bottom navigation
setActiveTab('earnings');
```

### 2. Probar Búsqueda
1. Escribir en el campo de búsqueda
2. Ver filtrado en tiempo real
3. Probar con diferentes términos

### 3. Probar Filtros
1. Tocar "All" → Ver todas las transacciones
2. Tocar "Earnings" → Solo ingresos
3. Tocar "Withdrawals" → Solo egresos

### 4. Probar Navegación
1. Tocar una transacción
2. Navega a detalles (próximamente)

### 5. Probar Empty State
1. Buscar algo que no existe
2. Ver mensaje de "No transactions found"

---

¡La pantalla de Financial History está lista con búsqueda y filtros! 📜✨
