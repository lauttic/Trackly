import React, { useEffect, useRef } from 'react';
import { Alert, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AddHabitScreen from './screens/AddHabitScreen';
import HabitDetailScreen from './screens/HabitDetailScreen';
import { registerForNotificationsAsync } from './utils/notifications';

const Stack = createStackNavigator();

export default function App() {
  const navigationRef = useRef(null);

  useEffect(() => {
    registerForNotificationsAsync();

    const receivedListener = Notifications.addNotificationReceivedListener(
      notification => {
        const { title, body } = notification.request.content;
        Alert.alert(title ?? 'Recordatorio!', body ?? '');
      }
    );

    const responseListener = Notifications.addNotificationResponseReceivedListener(
      response => {
        if (navigationRef.current) {
          navigationRef.current.navigate('Home');
        }
      }
    );

    return () => {
      receivedListener.remove();
      responseListener.remove();
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
        <Stack.Screen name='HabitDetail' component={HabitDetailScreen}
          options={{ title: 'Detalle del Hábito' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
