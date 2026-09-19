//apps/admin/src/lib/fonts.ts
import { Noto_Serif_Bengali, Inter } from 'next/font/google';

export const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bangla',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-english',
  display: 'swap',
});

export const fontVariables = [notoSerifBengali.variable, inter.variable].join(' ');