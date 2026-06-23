import { validateHabitName, formatTimeDisplay } from '../../utils/helpers';

describe('validateHabitName', () => {
  it('devuelve error si el nombre está vacío', () => {
    expect(validateHabitName('')).toBe('El nombre del hábito es obligatorio');
    expect(validateHabitName('   ')).toBe('El nombre del hábito es obligatorio');
    expect(validateHabitName(null)).toBe('El nombre del hábito es obligatorio');
  });

  it('devuelve error si el nombre es muy corto', () => {
    expect(validateHabitName('a')).toBe('El nombre debe tener al menos 2 caracteres');
  });

  it('devuelve error si el nombre es muy largo', () => {
    expect(validateHabitName('a'.repeat(51))).toBe('El nombre no puede superar los 50 caracteres');
  });

  it('devuelve null para un nombre válido', () => {
    expect(validateHabitName('Hacer ejercicio')).toBeNull();
    expect(validateHabitName('Leer')).toBeNull();
  });
});

describe('formatTimeDisplay', () => {
  it('formatea hora y minuto correctamente', () => {
    expect(formatTimeDisplay(9, 5)).toBe('9:05');
    expect(formatTimeDisplay(14, 30)).toBe('14:30');
    expect(formatTimeDisplay(0, 0)).toBe('0:00');
  });

  it('maneja valores undefined como 0', () => {
    expect(formatTimeDisplay()).toBe('0:00');
  });
});
