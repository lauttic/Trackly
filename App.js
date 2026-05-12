import React, { useEffect, useRef } from 'react';
import { Alert, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AddHabitScreen from './screens/AddHabitScreen';
import { registerForNotificationsAsync } from './utils/notifications';

const Stack = createStackNavigator();

export default function App() {
  const navigationRef = useRef(null);
  const receivedListenerRef = useRef(null);
  const responseListenerRef = useRef(null);

  useEffect(() => {
    registerForNotificationsAsync();

    // App abierta: muestra Alert
    receivedListenerRef.current = Notifications.addNotificationReceivedListener(
      notification => {
        const { title, body } = notification.request.content;
        Alert.alert(title ?? '¡Recordatorio!', body ?? '');
      }
    );

    // Usuario toca la notificación: navega a Home
    responseListenerRef.current = Notifications.addNotificationResponseReceivedListener(
      response => {
        const data = response.notification.request.content.data;
        if (data?.habitId && navigationRef.current) {
          navigationRef.current.navigate('Home');
        }
      }
    );

    return () => {
      receivedListenerRef.current?.remove();
      responseListenerRef.current?.remove();
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={LoginScreen}
          options={{ title: 'Iniciar Sesión' }} />
        <Stack.Screen name='Register' component={RegisterScreen}
          options={{ title: 'Registro' }} />
        <Stack.Screen name='Home' component={HomeScreen}
          options={({ navigation }) => ({
            title: 'Trackly',
            headerLeft: null,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.replace('Login')}
                style={{ marginRight: 16 }}>
                <Text style={{ color: '#e53e3e', fontWeight: '600' }}>Salir</Text>
              </TouchableOpacity>
            ),
          })} />
        <Stack.Screen name='AddHabit' component={AddHabitScreen}
          options={{ title: 'Agregar Hábito' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}