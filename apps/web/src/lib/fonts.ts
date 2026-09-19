// apps/web/src/lib/fonts.ts
import {
  Noto_Serif_Bengali,
  Noto_Sans_Bengali,
  Cormorant_Garamond,
  Inter,
  Noto_Naskh_Arabic,
} from 'next/font/google';

export const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bangla-serif',
  display: 'swap',
  preload: true,
});

export const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bangla-sans',
  display: 'swap',
  preload: true,
});

export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-english-serif',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-english-sans',
  display: 'swap',
});

export const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

export const fontVariables = [
  notoSerifBengali.variable,
  notoSansBengali.variable,
  cormorant.variable,
  inter.variable,
  notoNaskhArabic.variable,
].join(' ');