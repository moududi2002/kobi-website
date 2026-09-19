//packages/utils/src/date.ts
const BN_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => BN_DIGITS[parseInt(d, 10)]);
}

/**
 * Format date as "১৫ জানুয়ারি, ২০২৫"
 */
export function formatBengaliDate(input: string | Date): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  if (isNaN(d.getTime())) return '';
  const day = toBengaliDigits(d.getDate());
  const month = BN_MONTHS[d.getMonth()];
  const year = toBengaliDigits(d.getFullYear());
  return `${day} ${month}, ${year}`;
}

export function formatBengaliDateTime(input: string | Date): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  if (isNaN(d.getTime())) return '';
  const date = formatBengaliDate(d);
  const hh = toBengaliDigits(d.getHours().toString().padStart(2, '0'));
  const mm = toBengaliDigits(d.getMinutes().toString().padStart(2, '0'));
  return `${date} • ${hh}:${mm}`;
}