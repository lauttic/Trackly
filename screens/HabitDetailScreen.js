import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  Alert, Linking, Platform, ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import useHabitStore from '../store/useHabitStore';

export default function HabitDetailScreen({ route, navigation }) {
  const { habitId } = route.params;
  const habits = useHabitStore(s => s.habits);
  const toggleHabit = useHabitStore(s => s.toggleHabit);
  const updateHabit = useHabitStore(s => s.updateHabit);
  const habit = habits.find(h => h.id === habitId);

  const [image, setImage] = useState(habit?.image || null);
  const [location, setLocation] = useState(habit?.location || null);
  const [contact, setContact] = useState(habit?.contact || null);

  useEffect(() => {
    if (habit) {
      setImage(habit.image || null);
      setLocation(habit.location || null);
      setContact(habit.contact || null);
    }
  }, [habit?.image, habit?.location, habit?.contact]);

  if (!habit) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Hábito no encontrado</Text>
      </View>
    );
  }

  const canComplete = image || habit.done;

  const handleToggle = async () => {
    if (!image && !habit.done) {
      Alert.alert('Foto requerida', 'Subí una foto como evidencia antes de marcar el hábito como completado.');
      return;
    }
    await toggleHabit(habit.id);
  };

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la galería.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await updateHabit(habit.id, { image: uri });
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await updateHabit(habit.id, { image: uri });
    }
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la ubicación.');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    const address = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
    const addr = address[0];
    const locData = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      address: addr ? `${addr.street || ''}, ${addr.city || ''}` : null,
    };
    setLocation(locData);
    await updateHabit(habit.id, { location: locData });
    Alert.alert('Ubicación guardada', addr
      ? `${addr.street || ''}, ${addr.city || ''}`
      : `${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)}`
    );
  };

  const pickContact = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a los contactos.');
      return;
    }
    try {
      const contact = await Contacts.presentContactPickerAsync();
      if (contact) {
        const displayName = contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Sin nombre';
        const contactData = {
          name: displayName,
          phone: contact.phoneNumbers?.[0]?.digits || contact.phoneNumbers?.[0]?.number,
          email: contact.emails?.[0]?.email,
        };
        setContact(contactData);
        await updateHabit(habit.id, { contact: contactData });
      }
    } catch (e) {
      if (e.message !== 'User cancelled') {
        Alert.alert('Error', e.message);
      }
    }
  };

  const openMap = () => {
    if (!location) return;
    const { latitude, longitude } = location;
    const url = Platform.OS === 'ios'
      ? `maps://app?dll=${latitude},${longitude}`
      : `geo:${latitude},${longitude}?q=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{habit.name}</Text>
        <Text style={styles.freq}>{habit.frequency}</Text>
      </View>

      <TouchableOpacity
        style={[styles.toggleBtn, habit.done && styles.toggleDone, !canComplete && styles.toggleDisabled]}
        onPress={handleToggle}>
        <Text style={styles.toggleText}>
          {habit.done ? '✅ Completado' : !image ? '🔒 Subí una foto primero' : '⬜ Marcar como completado'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Evidencia (Foto)</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.mediaBtn} onPress={takePhoto}>
          <Text style={styles.mediaBtnText}>📷 Cámara</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mediaBtn} onPress={pickImage}>
          <Text style={styles.mediaBtnText}>🖼 Galería</Text>
        </TouchableOpacity>
      </View>
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <Text style={styles.sectionTitle}>Ubicación</Text>
      <TouchableOpacity style={styles.mediaBtn} onPress={getLocation}>
        <Text style={styles.mediaBtnText}>📍 Obtener ubicación</Text>
      </TouchableOpacity>
      {location && (
        <TouchableOpacity onPress={openMap}>
          <Text style={styles.linkText}>
            {location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
          </Text>
        </TouchableOpacity>
      )}

      <Text style={styles.sectionTitle}>Contacto (compañero/entrenador)</Text>
      <TouchableOpacity style={styles.mediaBtn} onPress={pickContact}>
        <Text style={styles.mediaBtnText}>👤 Seleccionar contacto</Text>
      </TouchableOpacity>
      {contact && (
        <Text style={styles.contactText}>
          {contact.name}{contact.phone ? ` - ${contact.phone}` : ''}
        </Text>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f8fafc' },
  empty: { textAlign: 'center', marginTop: 60, color: '#94a3b8', fontSize: 16 },
  header: { marginBottom: 20 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  freq: { fontSize: 14, color: '#64748b', marginTop: 2 },
  toggleBtn: {
    backgroundColor: '#1A56DB', padding: 14, borderRadius: 8,
    alignItems: 'center', marginBottom: 24,
  },
  toggleDone: { backgroundColor: '#16a34a' },
  toggleDisabled: { backgroundColor: '#94a3b8' },
  toggleText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  sectionTitle: {
    fontSize: 15, fontWeight: '700', color: '#1e293b',
    marginTop: 20, marginBottom: 8,
    borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 6
  },
  row: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  mediaBtn: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#cbd5e1',
    borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16,
  },
  mediaBtnText: { fontSize: 14, color: '#1e293b' },
  image: { width: '100%', height: 220, borderRadius: 8, marginTop: 8, backgroundColor: '#e2e8f0' },
  linkText: { fontSize: 14, color: '#1A56DB', marginTop: 6, textDecorationLine: 'underline' },
  contactText: { fontSize: 14, color: '#1e293b', marginTop: 6 },
});
