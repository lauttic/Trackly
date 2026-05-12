import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HabitItem({ habit, onToggle, onDelete }) {
  const formatTime = (h, m) => `${h}:${m < 10 ? '0' + m : m}`;

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.info} onPress={onToggle}>
        <Text style={styles.check}>{habit.done ? '✅' : '⬜'}</Text>
        <View>
          <Text style={[styles.name, habit.done && styles.done]}>
            {habit.name}
          </Text>
          <Text style={styles.freq}>
            {habit.frequency}
            {habit.reminderEnabled
              ? `  🔔 ${formatTime(habit.reminderHour, habit.reminderMinute)}`
              : ''}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete}>
        <Text style={styles.delete}>🗑</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', marginHorizontal: 16, marginVertical: 6,
    padding: 14, borderRadius: 10, elevation: 1,
    borderWidth: 1, borderColor: '#e2e8f0'
  },
  info: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  check: { fontSize: 22, marginRight: 12 },
  name: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  done: { textDecorationLine: 'line-through', color: '#94a3b8' },
  freq: { fontSize: 12, color: '#64748b', marginTop: 2 },
  delete: { fontSize: 20, paddingLeft: 8 },
});