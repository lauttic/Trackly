# Trackly – Seguimiento de Hábitos

App desarrollada en React Native (Expo) para el seguimiento de hábitos diarios/semanales.

## Opción elegida
Seguimiento de Hábitos

## Cómo ejecutar la app
1. Clonar el repositorio
2. Ejecutar: `npm install`
3. Ejecutar: `npx expo start`
4. Escanear el QR con Expo Go o presionar 'a' para Android

## Cómo ejecutar los tests
```bash
npm test
```

## Nuevas funcionalidades (Parcial 2)

### 1. Permisos y Acceso a Recursos del Dispositivo
- Solicitud de permisos para cámara, galería, ubicación, contactos y calendario.
- Manejo de estados: concedido, denegado, pendiente.
- Mensaje claro al usuario si el permiso es rechazado.

### 2. Cámara y Galería (expo-image-picker)
- Tomar foto con la cámara o seleccionar imagen desde la galería.
- La imagen se asocia al hábito como evidencia.
- Se muestra la imagen en la lista de hábitos y en el detalle.

### 3. Ubicación (expo-location)
- Obtener ubicación actual del dispositivo (GPS).
- La ubicación se asocia al hábito (lugar donde se realizó).
- Muestra coordenadas y dirección aproximada (geocoding inverso).
- Al tocar la ubicación en el detalle, abre el mapa.

### 4. Contactos (expo-contacts)
- Seleccionar un contacto de la agenda del dispositivo.
- Se asocia al hábito como compañero/entrenador.
- Muestra nombre y teléfono del contacto.

### 5. Calendario (expo-calendar)
- Botón para crear un evento en el calendario del dispositivo.
- El evento se vincula al hábito con nombre, hora y ubicación.

### 6. Testing con Jest
- Configuración de Jest + React Native Testing Library.
- **Test de componente**: HabitItem (renderizado, interacciones).
- **Test de lógica de negocio**: validación de formulario y formato de hora (`utils/helpers.js`).
- **Test del store global**: Zustand (agregar, eliminar, toggle, actualizar hábitos).
- Todos los tests se ejecutan con: `npm test`

### 7. Estado Global con Zustand
- Migración del estado de hábitos y usuario de useState a Zustand.
- Store `useHabitStore`: acciones para agregar, eliminar, actualizar y toggle de hábitos.
- Store `useUserStore`: login, register, logout.
- Los componentes leen y modifican el estado a través de hooks del store.

### 8. Pantalla de Detalle
- Nueva pantalla `HabitDetailScreen` para ver la información completa del hábito.
- Muestra imagen, ubicación, contacto y opción de agregar al calendario.

## Tecnologías utilizadas
- React Native (Expo SDK 54)
- Zustand (estado global)
- Jest + React Native Testing Library (tests)
- expo-image-picker, expo-location, expo-contacts, expo-calendar
- expo-notifications
- AsyncStorage
- React Navigation

## Video DEMO
https://youtube.com/shorts/9S82tlmLRzw?feature=share
