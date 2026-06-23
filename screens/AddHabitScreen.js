import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView, Platform, Modal
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Calendar from 'expo-calendar';
import useHabitStore from '../store/useHabitStore';

export default function AddHabitScreen({ navigation }) {
  const addHabit = useHabitStore(s => s.addHabit);
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('Diario');
  const [time, setTime] = useState(() => {
    const d = new Date();
    d.setHours(9, 0, 0, 0);
    return d;
  });
  const [showPicker, setShowPicker] = useState(false);
  const [addToCalendar, setAddToCalendar] = useState(false);

  const formatTime = (date) => {
    const h = date.getHours();
    const m = date.getMinutes();
    return `${h}:${m < 10 ? '0' + m : m}`;
  };

  const onChangeTime = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selectedDate) setTime(selectedDate);
  };

  const addCalendarEvents = async (habitName) => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se pudieron agregar los eventos al calendario.');
        return [];
      }

      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      let calId;
      if (calendars.length > 0) {
        calId = (calendars.find(c => c.allowsModifications) || calendars[0]).id;
      } else {
        const { id } = await Calendar.createCalendarAsync({
          title: 'Trackly',
          color: '#1A56DB',
          entityType: Calendar.EntityTypes.EVENT,
          source: { name: 'Trackly', isLocalAccount: true },
          name: 'trackly-calendar',
          ownerAccount: 'trackly',
          accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });
        calId = id;
      }

      const h = time.getHours();
      const m = time.getMinutes();
      const eventIds = [];
      for (let i = 0; i < 7; i++) {
        const start = new Date();
        start.setDate(start.getDate() + i);
        start.setHours(h, m, 0, 0);
        const end = new Date(start);
        end.setHours(start.getHours() + 1);

        const eventId = await Calendar.createEventAsync(calId, {
          title: `Trackly: ${habitName}`,
          startDate: start,
          endDate: end,
          notes: `Hábito: ${habitName} - Frecuencia: ${frequency}`,
          timeZone: 'America/Argentina/Buenos_Aires',
        });
        eventIds.push(eventId);
      }
      return eventIds;
    } catch (e) {
      Alert.alert('Error', 'No se pudieron crear los eventos: ' + e.message);
      return [];
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Escribí el nombre del hábito');
      return;
    }

    let calendarEventIds = [];
    if (addToCalendar) {
      calendarEventIds = await addCalendarEvents(name.trim());
    }

    await addHabit({
      name: name.trim(),
      frequency,
      reminderHour: time.getHours(),
      reminderMinute: time.getMinutes(),
      calendarEventIds,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
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

      <Text style={styles.label}>Horario</Text>
      <TouchableOpacity style={styles.timeBtn} onPress={() => setShowPicker(true)}>
        <Text style={styles.timeBtnText}>⏰ {formatTime(time)}</Text>
      </TouchableOpacity>

      {showPicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={time}
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
              <Text style={styles.modalTitle}>Elegí el horario</Text>
              <DateTimePicker
                value={time}
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

      <Text style={styles.label}>Recordatorio en Calendario</Text>
      <TouchableOpacity
        style={[styles.calBtn, addToCalendar && styles.calBtnActive]}
        onPress={() => setAddToCalendar(!addToCalendar)}>
        <Text style={[styles.calBtnText, addToCalendar && styles.calBtnTextActive]}>
          {addToCalendar ? '✅ Próximos 7 días' : '📅 No agregar al calendario'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar Hábito</Text>
      </TouchableOpacity>
    </ScrollView>
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
  timeBtn: {
    alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 20,
    borderRadius: 20, borderWidth: 1, borderColor: '#1A56DB',
    backgroundColor: '#eff6ff', marginBottom: 8
  },
  timeBtnText: { fontSize: 15, color: '#1A56DB', fontWeight: '600' },
  calBtn: {
    paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12,
    borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#fff',
    alignItems: 'center', marginBottom: 8
  },
  calBtnActive: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  calBtnText: { fontSize: 15, color: '#475569', fontWeight: '600' },
  calBtnTextActive: { color: '#fff' },
  button: {
    backgroundColor: '#1A56DB', padding: 14, borderRadius: 8,
    alignItems: 'center', marginTop: 32
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalContent: {
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24, alignItems: 'center'
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 8 },
  modalButton: { backgroundColor: '#1A56DB', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 8, marginTop: 8 },
  modalButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
