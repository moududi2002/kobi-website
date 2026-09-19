//apps/web/src/config/site.ts
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'কবির নাম',
  description:
    'একজন কবি, লেখক ও গীতিকারের সাহিত্যকর্ম, সৃজনশীলতা ও চিন্তাধারার ডিজিটাল সংগ্রহ।',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  locale: 'bn-BD',
  author: 'কবির নাম',
  keywords: [
    'বাংলা কবিতা',
    'গজল',
    'হামদ',
    'নাতে রাসুল',
    'লিরিক্স',
    'বাংলা সাহিত্য',
    'কবি',
  ],
  ogImage: '/images/og-default.jpg',
  twitter: '@handle',
} as const;