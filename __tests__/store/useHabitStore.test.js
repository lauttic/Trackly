import useHabitStore from '../../store/useHabitStore';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

describe('useHabitStore', () => {
  beforeEach(() => {
    useHabitStore.setState({ habits: [], loading: false });
  });

  it('inicia con lista vacía', () => {
    const { habits } = useHabitStore.getState();
    expect(habits).toEqual([]);
  });

  it('agrega un hábito correctamente', async () => {
    const habit = { name: 'Test', frequency: 'Diario' };
    const added = await useHabitStore.getState().addHabit(habit);
    expect(added.name).toBe('Test');
    expect(added.id).toBeDefined();
    expect(added.done).toBe(false);

    const { habits } = useHabitStore.getState();
    expect(habits).toHaveLength(1);
    expect(habits[0].name).toBe('Test');
  });

  it('elimina un hábito por id', async () => {
    const habit = await useHabitStore.getState().addHabit({ name: 'Test' });
    await useHabitStore.getState().deleteHabit(habit.id);
    const { habits } = useHabitStore.getState();
    expect(habits).toHaveLength(0);
  });

  it('toggle cambia el estado done', async () => {
    const habit = await useHabitStore.getState().addHabit({ name: 'Test' });
    expect(habit.done).toBe(false);
    await useHabitStore.getState().toggleHabit(habit.id);
    const { habits } = useHabitStore.getState();
    expect(habits[0].done).toBe(true);
    await useHabitStore.getState().toggleHabit(habit.id);
    expect(useHabitStore.getState().habits[0].done).toBe(false);
  });

  it('actualiza un hábito existente', async () => {
    const habit = await useHabitStore.getState().addHabit({ name: 'Original' });
    await useHabitStore.getState().updateHabit(habit.id, { name: 'Actualizado' });
    const { habits } = useHabitStore.getState();
    expect(habits[0].name).toBe('Actualizado');
  });
});
