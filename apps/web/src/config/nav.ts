// apps/web/src/config/nav.ts

export interface NavItem {
  title: string;
  href: string;
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  { title: 'হোম', href: '/' },
  { title: 'কবিতা সমগ্র', href: '/kobita' },
  {
    title: 'লিরিক্স',
    href: '/lyrics',
    children: [
      { title: 'হামদ', href: '/lyrics/category/hamd' },
      { title: 'নাতে রাসুল', href: '/lyrics/category/nate-rasul' },
      { title: 'মায়ের গান', href: '/lyrics/category/mayer-gan' },
      { title: 'দেশাত্মবোধক', href: '/lyrics/category/deshatmobodhok' },
      { title: 'রম্য', href: '/lyrics/category/rommo' },
    ],
  },
  { title: 'পরিচিতি', href: '/porichiti' },
  { title: 'যোগাযোগ', href: '/jogajog' },
];

export const footerNav = {
  sections: [
    {
      title: 'সাহিত্য',
      links: [
        { title: 'কবিতা সমগ্র', href: '/kobita' },
        { title: 'সব লিরিক্স', href: '/lyrics' },
        { title: 'নির্বাচিত', href: '/featured' },
      ],
    },
    {
      title: 'লেখক',
      links: [
        { title: 'পরিচিতি', href: '/porichiti' },
        { title: 'যোগাযোগ', href: '/jogajog' },
      ],
    },
    {
      title: 'লিরিক্স ধরন',
      links: [
        { title: 'হামদ', href: '/lyrics/category/hamd' },
        { title: 'নাতে রাসুল', href: '/lyrics/category/nate-rasul' },
        { title: 'মায়ের গান', href: '/lyrics/category/mayer-gan' },
        { title: 'দেশাত্মবোধক', href: '/lyrics/category/deshatmobodhok' },
        { title: 'রম্য', href: '/lyrics/category/rommo' },
      ],
    },
  ],
};