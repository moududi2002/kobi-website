//apps/web/src/app/page.tsx
import { fetchHomepageFull } from '@/lib/api/endpoints';
import { HeroSection } from '@/components/home/HeroSection';
import { IntroSection } from '@/components/home/IntroSection';
import { LatestWorks } from '@/components/home/LatestWorks';
import { FeaturedWork } from '@/components/home/FeaturedWork';
import { LiteraryArchive } from '@/components/home/LiteraryArchive';
import { AboutCTA } from '@/components/home/AboutCTA';

export const revalidate = 60;

export default async function HomePage() {
  const data = await fetchHomepageFull();

  return (
    <>
      <HeroSection slides={data.homepage.heroSlides} />
      <IntroSection about={data.about} welcomeQuote={data.homepage.welcomeQuote} />
      <LatestWorks
        poems={data.latestPoems}
        lyrics={data.latestLyrics}
      />
      {data.homepage.featuredPoem && (
        <FeaturedWork poem={data.homepage.featuredPoem} />
      )}
      <LiteraryArchive />
      <AboutCTA />
    </>
  );
}