import { describe, it, expect } from 'vitest';
import { formatPhoneNumber } from './phoneFormatter';

describe('formatPhoneNumber', () => {
  it('возвращает +7 для пустой строки', () => {
    expect(formatPhoneNumber('')).toBe('+7');
  });

  it('форматирует 10 цифр', () => {
    expect(formatPhoneNumber('9123456789')).toBe('+7 (912) 345-67-89');
  });

  it('обрезает лишние цифры', () => {
    expect(formatPhoneNumber('9123456789012')).toBe('+7 (912) 345-67-89');
  });

  it('обрабатывает ввод с 7 или 8 в начале', () => {
    expect(formatPhoneNumber('79123456789')).toBe('+7 (912) 345-67-89');
    expect(formatPhoneNumber('89123456789')).toBe('+7 (912) 345-67-89');
  });
});