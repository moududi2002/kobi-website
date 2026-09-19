// apps/web/src/components/home/HeroSection.tsx
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

import type { HeroSlide } from '@kobi/types';
import { IslamicDivider } from '@/components/shared/IslamicDivider';

interface Props {
  slides: HeroSlide[];
  poetName?: string;
}

export function HeroSection({ slides, poetName }: Props) {
  // Fallback if no slides yet
  if (!slides?.length) {
    return (
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[var(--color-green-deep)]">
        <div className="absolute inset-0 pattern-islamic-soft opacity-20" />
        <div className="relative text-center px-6 max-w-3xl">
          <p className="font-arabic text-4xl md:text-5xl text-[var(--color-gold-400)] mb-8">
            ﷽
          </p>
          <h1 className="font-display text-[var(--text-hero)] text-[var(--color-cream-50)] mb-6 leading-tight">
            {poetName || 'কবির নাম'}
          </h1>
          <IslamicDivider className="max-w-xs mx-auto" />
          <p className="mt-6 text-[var(--color-cream-200)] text-lg">
            শব্দেরা হয়ে উঠুক আলো
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[var(--color-ink-900)]">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 6500, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        loop
        speed={1400}
        className="h-full w-full hero-swiper"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx} className="relative">
            <div className="relative h-full w-full overflow-hidden">
              {/* Ken Burns effect on image */}
              <motion.div
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 8, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                <Image
                  src={slide.image}
                  alt={slide.title || 'Hero'}
                  fill
                  priority={idx === 0}
                  className="object-cover"
                  sizes="100vw"
                  quality={90}
                />
              </motion.div>

              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-ink-900)]/70 via-[var(--color-ink-900)]/35 to-[var(--color-ink-900)]/80" />

              {/* Vignette */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="container-literary max-w-4xl px-6 text-center">
                  {slide.quote && (
                    <motion.p
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                      className="font-bangla text-[var(--color-gold-300)] text-base md:text-lg mb-6 italic max-w-2xl mx-auto leading-relaxed"
                    >
                      “{slide.quote}”
                    </motion.p>
                  )}

                  {slide.title && (
                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                      className="font-display text-[var(--text-hero)] text-[var(--color-cream-50)] leading-[1.05] tracking-tight mb-6"
                    >
                      {slide.title}
                    </motion.h1>
                  )}

                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center justify-center gap-3 my-6"
                  >
                    <span className="h-px w-12 bg-[var(--color-gold-500)]" />
                    <span className="text-[var(--color-gold-500)] text-xs">◆</span>
                    <span className="h-px w-12 bg-[var(--color-gold-500)]" />
                  </motion.div>

                  {slide.subtitle && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      className="text-[var(--color-cream-200)] text-lg md:text-xl font-bangla max-w-2xl mx-auto leading-relaxed"
                    >
                      {slide.subtitle}
                    </motion.p>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[var(--color-cream-200)]"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-80">
          স্ক্রল করুন
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 opacity-70" />
        </motion.div>
      </motion.div>

      {/* Custom Swiper pagination style */}
      <style jsx global>{`
        .hero-swiper .swiper-pagination {
          bottom: 2rem !important;
          z-index: 20;
        }
        .hero-swiper .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: var(--color-cream-200);
          opacity: 0.5;
          transition: all 0.3s;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          background: var(--color-gold-400);
          opacity: 1;
          width: 24px;
          border-radius: 3px;
        }
      `}</style>
    </section>
  );
}