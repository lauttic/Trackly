import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HabitItem from '../components/HabitItem';
import { registerForNotificationsAsync } from '../utils/notifications';

export default function HomeScreen({ navigation }) {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    loadHabits();
    registerForNotificationsAsync(); // solo pide permisos
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadHabits);
    return unsubscribe;
  }, [navigation]);

  const loadHabits = async () => {
    const data = await AsyncStorage.getItem('habits');
    setHabits(data ? JSON.parse(data) : []);
  };

  const toggleHabit = async (id) => {
    const updated = habits.map(h =>
      h.id === id ? { ...h, done: !h.done } : h
    );
    setHabits(updated);
    await AsyncStorage.setItem('habits', JSON.stringify(updated));
  };

  const deleteHabit = async (id) => {
    Alert.alert('Eliminar', '¿Seguro que querés eliminar este hábito?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          const updated = habits.filter(h => h.id !== id);
          setHabits(updated);
          await AsyncStorage.setItem('habits', JSON.stringify(updated));
        }
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitItem
            habit={item}
            onToggle={() => toggleHabit(item.id)}
            onDelete={() => deleteHabit(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No tenés hábitos aún.{`\n`}¡Agregá uno!</Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <TouchableOpacity style={styles.fab}
        onPress={() => navigation.navigate('AddHabit')}>
        <Text style={styles.fabText}>+ Nuevo Hábito</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  empty: {
    textAlign: 'center', marginTop: 60,
    color: '#94a3b8', fontSize: 16, lineHeight: 26
  },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    backgroundColor: '#1A56DB', paddingVertical: 14,
    paddingHorizontal: 24, borderRadius: 30, elevation: 4
  },
  fabText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});