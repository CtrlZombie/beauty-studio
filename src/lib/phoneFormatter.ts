export const formatPhoneNumber = (value: string): string => {
  let digits = value.replace(/\D/g, '');
  if (digits.length === 0) return '+7';
  if (digits.startsWith('7') || digits.startsWith('8')) {
    digits = digits.slice(1);
  }
  const limitedDigits = digits.slice(0, 10);
  if (limitedDigits.length === 0) return '+7';
  if (limitedDigits.length <= 3) return `+7 (${limitedDigits}`;
  if (limitedDigits.length <= 6)
    return `+7 (${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3)}`;
  if (limitedDigits.length <= 8)
    return `+7 (${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6)}`;
  return `+7 (${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6, 8)}-${limitedDigits.slice(8, 10)}`;
};