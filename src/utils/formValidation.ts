export function validateRequired(value: string, label: string): string | null {
  return value.trim() ? null : `${label} is required.`;
}

export function validateEmail(value: string): string | null {
  if (!value.trim()) return 'Email is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.';
  return null;
}

export function validatePhone(value: string): string | null {
  if (!value.trim()) return 'Phone number is required.';
  const digits = value.replace(/\D/g, '');
  if (digits.length < 7) return 'Enter a valid phone number.';
  return null;
}

export function validateNumber(value: string, label: string): string | null {
  if (!value.trim()) return `${label} is required.`;
  if (!/^\d+$/.test(value.trim())) return 'Enter a whole number.';
  return null;
}
