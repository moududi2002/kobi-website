//packages/utils/src/reading-time.ts
import { toBengaliDigits } from './date';

export function formatReadingTime(minutes: number): string {
  if (!minutes || minutes < 1) return '১ মিনিট';
  return `${toBengaliDigits(minutes)} মিনিট পাঠ`;
}