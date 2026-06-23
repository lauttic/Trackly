export function validateHabitName(name) {
  if (!name || !name.trim()) return 'El nombre del hábito es obligatorio';
  if (name.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
  if (name.trim().length > 50) return 'El nombre no puede superar los 50 caracteres';
  return null;
}

export function formatTimeDisplay(hour, minute) {
  const h = hour ?? 0;
  const m = minute ?? 0;
  return `${h}:${m < 10 ? '0' + m : m}`;
}
