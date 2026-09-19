// apps/web/src/components/home/HeroSection.tsx
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

import type { HeroSlide } from '@kobi/types';

export function HeroSection({ slides }: { slides: HeroSlide[] }) {
  if (!slides?.length) {
    return (
      <section className="h-screen flex items-center justify-center pattern-islamic-soft">
        <p className="text-[var(--color-ink-400)]">Hero slides নেই</p>
      </section>
    );
  }

  return (
    <section className="relative h-screen w-full">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="h-full w-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative h-full w-full">
              <Image
                src={slide.image}
                alt={slide.title || 'Hero'}
                fill
                priority={idx === 0}
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-ink-900)]/60 via-[var(--color-ink-900)]/40 to-[var(--color-ink-900)]/70" />
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div className="container-literary max-w-3xl px-6">
                  {slide.quote && (
                    <p className="font-bangla text-[var(--color-gold-300)] text-lg md:text-xl mb-6 italic">
                      “{slide.quote}”
                    </p>
                  )}
                  {slide.title && (
                    <h1 className="font-display text-[var(--text-hero)] text-[var(--color-cream-50)] mb-4 leading-tight">
                      {slide.title}
                    </h1>
                  )}
                  {slide.subtitle && (
                    <p className="text-[var(--color-cream-200)] text-lg md:text-xl">
                      {slide.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}