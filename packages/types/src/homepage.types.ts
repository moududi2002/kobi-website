// packages/types/src/homepage.types.ts
export interface HeroSlide {
  image: string;
  title?: string;
  subtitle?: string;
  quote?: string;
}

export interface Homepage {
  _id: string;
  heroSlides: HeroSlide[];
  featuredPoemId?: string;
  featuredLyricId?: string;
  updatedAt: string;
  welcomeQuote: string;

}