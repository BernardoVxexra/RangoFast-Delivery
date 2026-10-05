export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidCEP(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length === 8;
}

export function isStrongPassword(value: string): boolean {
  return value.length >= 6;
}

export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}
