import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HabitItem from '../../components/HabitItem';

const baseHabit = {
  id: '1',
  name: 'Hacer ejercicio',
  frequency: 'Diario',
  done: false,
  reminderEnabled: false,
};

describe('HabitItem', () => {
  it('renderiza el nombre del hábito', () => {
    const { getByText } = render(
      <HabitItem habit={baseHabit} onDelete={() => {}} onPress={() => {}} />
    );
    expect(getByText('Hacer ejercicio')).toBeTruthy();
  });

  it('muestra el estado completado con tachado', () => {
    const doneHabit = { ...baseHabit, done: true };
    const { getByText } = render(
      <HabitItem habit={doneHabit} onDelete={() => {}} onPress={() => {}} />
    );
    const name = getByText('Hacer ejercicio');
    expect(name.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ textDecorationLine: 'line-through' })])
    );
  });

  it('llama a onPress al presionar el item', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <HabitItem habit={baseHabit} onDelete={() => {}} onPress={onPress} />
    );
    fireEvent.press(getByText('Hacer ejercicio'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('llama a onDelete al presionar el botón eliminar', () => {
    const onDelete = jest.fn();
    const { getByText } = render(
      <HabitItem habit={baseHabit} onDelete={onDelete} onPress={() => {}} />
    );
    fireEvent.press(getByText('🗑'));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
