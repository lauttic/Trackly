import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function HabitItem({ habit, onDelete, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.info}>
        <Text style={styles.check}>{habit.done ? '✅' : '⬜'}</Text>
        <View style={styles.textWrap}>
          <Text style={[styles.name, habit.done && styles.done]}>
            {habit.name}
          </Text>
          <Text style={styles.freq}>{habit.frequency}</Text>
          {habit.image && <Text style={styles.meta}>📷 Foto</Text>}
          {habit.location && <Text style={styles.meta}>📍 Ubicación</Text>}
          {habit.contact && <Text style={styles.meta}>👤 {habit.contact.name}</Text>}
        </View>
      </View>
      {habit.image && (
        <Image source={{ uri: habit.image }} style={styles.thumb} />
      )}
      <TouchableOpacity onPress={onDelete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={styles.delete}>🗑</Text>
      </TouchableOpacity>
    </TouchableOpacity>
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
  textWrap: { flex: 1 },
  check: { fontSize: 22, marginRight: 12 },
  name: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  done: { textDecorationLine: 'line-through', color: '#94a3b8' },
  freq: { fontSize: 12, color: '#64748b', marginTop: 2 },
  meta: { fontSize: 11, color: '#1A56DB', marginTop: 2 },
  thumb: { width: 40, height: 40, borderRadius: 6, marginRight: 8 },
  delete: { fontSize: 20, paddingLeft: 8 },
});
