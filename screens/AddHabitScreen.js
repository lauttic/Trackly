import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, Platform, Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { registerForNotificationsAsync, scheduleHabitReminder } from '../utils/notifications';

export default function AddHabitScreen({ navigation }) {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('Diario');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(() => {
    const d = new Date();
    d.setHours(9, 0, 0, 0);
    return d;
  });
  const [showPicker, setShowPicker] = useState(false);

  const formatTime = (date) => {
    const h = date.getHours();
    const m = date.getMinutes();
    return `${h}:${m < 10 ? '0' + m : m}`;
  };

  const onChangeTime = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selectedDate) setReminderTime(selectedDate);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Escribí el nombre del hábito');
      return;
    }

    let notificationId = null;

    if (reminderEnabled) {
      const granted = await registerForNotificationsAsync();
      if (granted) {
        notificationId = await scheduleHabitReminder(
          Date.now().toString(),
          name.trim(),
          reminderTime.getHours(),
          reminderTime.getMinutes()
        );
      }
    }

    const data = await AsyncStorage.getItem('habits');
    const habits = data ? JSON.parse(data) : [];
    const newHabit = {
      id: Date.now().toString(),
      name: name.trim(),
      frequency,
      done: false,
      reminderEnabled,
      reminderHour: reminderTime.getHours(),
      reminderMinute: reminderTime.getMinutes(),
      notificationId,
    };
    habits.push(newHabit);
    await AsyncStorage.setItem('habits', JSON.stringify(habits));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre del hábito</Text>
      <TextInput
        style={styles.input}
        placeholder='Ej: Hacer ejercicio'
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Frecuencia</Text>
      <View style={styles.row}>
        {['Diario', 'Semanal'].map(opt => (
          <TouchableOpacity key={opt}
            style={[styles.chip, frequency === opt && styles.chipActive]}
            onPress={() => setFrequency(opt)}>
            <Text style={[styles.chipText, frequency === opt && styles.chipTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Toggle recordatorio */}
      <Text style={styles.label}>Recordatorio</Text>
      <View style={styles.reminderRow}>
        <TouchableOpacity
          style={[styles.chip, reminderEnabled && styles.chipActive]}
          onPress={() => setReminderEnabled(!reminderEnabled)}>
          <Text style={[styles.chipText, reminderEnabled && styles.chipTextActive]}>
            {reminderEnabled ? '🔔 Activado' : '🔕 Desactivado'}
          </Text>
        </TouchableOpacity>

        {reminderEnabled && (
          <TouchableOpacity style={styles.timeButton} onPress={() => setShowPicker(true)}>
            <Text style={styles.timeButtonText}>⏰ {formatTime(reminderTime)}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Picker — iOS: modal, Android: nativo directo */}
      {showPicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={reminderTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeTime}
        />
      )}

      {showPicker && Platform.OS === 'ios' && (
        <Modal transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Elegí la hora</Text>
              <DateTimePicker
                value={reminderTime}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={onChangeTime}
                style={{ width: '100%' }}
                themeVariant="light"
              />
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowPicker(false)}>
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar Hábito</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f8fafc' },
  label: { fontSize: 15, fontWeight: '600', color: '#475569', marginBottom: 8, marginTop: 16 },
  input: {
    borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8,
    padding: 12, fontSize: 16, backgroundColor: '#fff', marginBottom: 8
  },
  row: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  chip: {
    paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20,
    borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#fff'
  },
  chipActive: { backgroundColor: '#1A56DB', borderColor: '#1A56DB' },
  chipText: { fontSize: 14, color: '#475569' },
  chipTextActive: { color: '#fff', fontWeight: 'bold' },
  reminderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  timeButton: {
    paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20,
    borderWidth: 1, borderColor: '#1A56DB', backgroundColor: '#eff6ff'
  },
  timeButtonText: { fontSize: 14, color: '#1A56DB', fontWeight: '600' },
  button: {
    backgroundColor: '#1A56DB', padding: 14, borderRadius: 8,
    alignItems: 'center', marginTop: 32
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  // Modal iOS
  modalOverlay: {
    flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)'
  },
  modalContent: {
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24, alignItems: 'center'
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 8 },
  modalButton: {
    backgroundColor: '#1A56DB', paddingVertical: 12, paddingHorizontal: 40,
    borderRadius: 8, marginTop: 8
  },
  modalButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});