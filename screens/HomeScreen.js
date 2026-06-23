import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Calendar from 'expo-calendar';
import useHabitStore from '../store/useHabitStore';
import HabitItem from '../components/HabitItem';

export default function HomeScreen({ navigation }) {
  const habits = useHabitStore(s => s.habits);
  const loadHabits = useHabitStore(s => s.loadHabits);
  const deleteHabit = useHabitStore(s => s.deleteHabit);

  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadHabits);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = async (id) => {
    const habit = habits.find(h => h.id === id);
    Alert.alert('Eliminar', 'Seguro que querés eliminar este hábito?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          if (habit?.calendarEventIds?.length > 0) {
            for (const eventId of habit.calendarEventIds) {
              try {
                await Calendar.deleteEventAsync(eventId);
              } catch (_) {}
            }
          }
          await deleteHabit(id);
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
            onPress={() => navigation.navigate('HabitDetail', { habitId: item.id })}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No tenés hábitos aún.{'\n'}Agregá uno!</Text>
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
  empty: { textAlign: 'center', marginTop: 60, color: '#94a3b8', fontSize: 16, lineHeight: 26 },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    backgroundColor: '#1A56DB', paddingVertical: 14,
    paddingHorizontal: 24, borderRadius: 30, elevation: 4
  },
  fabText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
