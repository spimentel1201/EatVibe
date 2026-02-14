# 📸 Funcionalidad de Cámara - Registro de Vehículo Courier

## ✅ Implementación Completada

Se ha implementado la funcionalidad completa de cámara para la pantalla de registro de vehículo del courier.

---

## 🎯 Características Implementadas

### 1. 📷 Captura de Foto de Licencia de Conducir

**Opciones disponibles:**
- **Tomar foto** con la cámara del dispositivo
- **Seleccionar desde galería** de fotos existentes

**Flujo de usuario:**
1. Usuario toca el área de upload de licencia
2. Se muestra un diálogo con 3 opciones:
   - "Take Photo" → Abre la cámara
   - "Choose from Gallery" → Abre la galería
   - "Cancel" → Cierra el diálogo
3. Usuario captura/selecciona la foto
4. La foto se muestra con overlay de confirmación
5. Usuario puede tocar nuevamente para cambiar la foto

**Características de la imagen:**
- Aspect ratio: 16:10 (formato licencia)
- Edición permitida antes de confirmar
- Calidad: 80% (balance entre calidad y tamaño)
- Formato: Imagen optimizada

**Visualización:**
- **Sin foto**: Ícono de cámara azul con texto instructivo
- **Con foto**: 
  - Imagen de fondo a pantalla completa
  - Overlay oscuro semi-transparente
  - Checkmark verde de confirmación
  - Texto "License uploaded"
  - Indicación "Tap to change"

### 2. 🚗 Escaneo de Placa del Vehículo

**Funcionalidad actual:**
- Botón de cámara en el campo de placa
- Abre la cámara para capturar foto de la placa
- Aspect ratio: 4:3 (formato estándar)
- Edición permitida antes de confirmar

**Próxima implementación (OCR):**
```typescript
// TODO: Integrar servicio OCR
// Opciones sugeridas:
// - Google ML Kit Vision API
// - Tesseract.js
// - AWS Textract
// - Azure Computer Vision

const extractPlateFromImage = async (imageUri: string) => {
    // Implementar extracción de texto de la imagen
    // Retornar número de placa extraído
    return extractedPlateNumber;
};
```

**Mensaje actual:**
- "OCR functionality will be implemented soon"
- Usuario debe ingresar la placa manualmente por ahora

---

## 📦 Dependencias Instaladas

```json
{
  "expo-camera": "^16.x.x",
  "expo-image-picker": "^16.x.x"
}
```

---

## 🔐 Permisos Configurados

### iOS (`app.json`)
```json
{
  "NSCameraUsageDescription": "FoodRush necesita acceso a la cámara para tomar fotos de tu licencia de conducir y placa del vehículo.",
  "NSPhotoLibraryUsageDescription": "FoodRush necesita acceso a tu galería para seleccionar fotos de tu licencia de conducir."
}
```

### Android (`app.json`)
```json
{
  "permissions": [
    "CAMERA",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE"
  ]
}
```

---

## 🎨 Experiencia de Usuario

### Solicitud de Permisos
- **Primera vez**: Se solicita permiso de cámara al intentar tomar foto
- **Permiso denegado**: Se muestra alerta explicativa
- **Permiso concedido**: Se abre la cámara/galería inmediatamente

### Validación del Formulario
El botón "Submit Application" se habilita solo cuando:
- ✅ Tipo de vehículo seleccionado
- ✅ Número de placa ingresado
- ✅ Foto de licencia capturada

### Feedback Visual
- **Botón deshabilitado**: Fondo gris, texto gris
- **Botón habilitado**: Fondo azul brillante, texto blanco
- **Foto capturada**: Checkmark verde, overlay con blur

---

## 🧪 Cómo Probar

### En Expo Go (Limitado)
```bash
npx expo start
```
**Nota**: Expo Go tiene limitaciones con permisos de cámara en algunos dispositivos.

### Build de Desarrollo (Recomendado)
```bash
# Android
npx expo run:android

# iOS
npx expo run:ios
```

### Flujo de Prueba
1. Navega a la pantalla de registro de vehículo
2. Selecciona un tipo de vehículo (Moto/Bicycle/Car)
3. Ingresa un número de placa (ej: "ABC-1234")
4. Toca el botón de cámara junto al campo de placa
   - Verifica que se abre la cámara
   - Captura una foto
   - Verifica el mensaje de OCR pendiente
5. Toca el área de "Driver's License"
   - Selecciona "Take Photo" o "Choose from Gallery"
   - Captura/selecciona una foto
   - Verifica que la imagen se muestra correctamente
6. Verifica que el botón "Submit Application" se habilita
7. Presiona "Submit" y verifica el mensaje de éxito

---

## 🔄 Próximos Pasos

### 1. Implementar OCR para Placa
```bash
# Opción 1: Google ML Kit
npx expo install expo-ml-kit

# Opción 2: Tesseract
npm install tesseract.js
```

### 2. Validación de Licencia
- Verificar que la foto sea clara y legible
- Detectar bordes de la licencia
- Validar que sea una licencia válida

### 3. Compresión de Imágenes
```bash
npm install expo-image-manipulator
```
- Reducir tamaño de archivo antes de upload
- Mantener calidad visual aceptable

### 4. Upload al Backend
```typescript
const uploadLicensePhoto = async (uri: string) => {
    const formData = new FormData();
    formData.append('license', {
        uri,
        type: 'image/jpeg',
        name: 'license.jpg',
    });

    const response = await fetch('API_ENDPOINT/courier/vehicle/license', {
        method: 'POST',
        body: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.json();
};
```

---

## 🐛 Troubleshooting

### La cámara no se abre
- Verifica que los permisos estén configurados en `app.json`
- Asegúrate de estar usando un build de desarrollo, no Expo Go
- Revisa los logs de Expo para errores de permisos

### La imagen no se muestra
- Verifica que `licensePhoto` contenga una URI válida
- Revisa que el componente `Image` tenga dimensiones definidas
- Comprueba que la imagen no sea demasiado grande

### Permiso denegado
- En iOS: Settings → FoodRush → Camera → Allow
- En Android: Settings → Apps → FoodRush → Permissions → Camera → Allow

---

## 📱 Capturas de Pantalla Esperadas

### Estado Inicial
- Área de upload con ícono de cámara azul
- Texto "Tap to upload or take a photo"
- Botón submit deshabilitado (gris)

### Con Foto Capturada
- Imagen de licencia visible de fondo
- Overlay oscuro semi-transparente
- Checkmark verde grande
- Texto "License uploaded"
- Botón submit habilitado (azul)

---

¡La funcionalidad de cámara está lista para usar! 📸✨
