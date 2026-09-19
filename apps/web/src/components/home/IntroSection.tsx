//apps/web/src/components/home/IntroSection.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowRight, Feather } from 'lucide-react';

import type { About } from '@kobi/types';
import { IslamicDivider } from '@/components/shared/IslamicDivider';

interface Props {
  about: Pick<About, 'shortBio' | 'portraitImage' | 'literaryIdentity'> | null;
  welcomeQuote?: string;
  poetName?: string;
}

export function IntroSection({ about, welcomeQuote, poetName }: Props) {
  const name = poetName || 'কবির নাম';

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Soft background pattern */}
      <div
        className="absolute inset-0 pattern-islamic-soft opacity-[0.15] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative container-literary">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-5 flex justify-center md:justify-start"
          >
            <div className="relative w-full max-w-sm">
              {/* Ornamental frame */}
              <div className="absolute -inset-3 border border-[var(--color-gold-400)]/40 rounded-sm" />
              <div className="absolute -inset-6 border border-[var(--color-gold-400)]/20 rounded-sm" />

              <div className="relative aspect-[4/5] rounded-sm overflow-hidden bg-[var(--color-cream-100)]">
                {about?.portraitImage ? (
                  <Image
                    src={about.portraitImage}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 pattern-islamic-soft flex items-center justify-center">
                    <Feather className="w-16 h-16 text-[var(--color-gold-400)] opacity-50" />
                  </div>
                )}
              </div>

              {/* Corner ornaments */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-[var(--color-gold-500)]" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-[var(--color-gold-500)]" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="md:col-span-7"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-gold-600)] font-medium mb-4">
              পরিচিতি
            </p>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--color-green-deep)] leading-tight mb-6">
              {name}
            </h2>

            <IslamicDivider className="max-w-[8rem] !py-2" />

            {about?.literaryIdentity && (
              <p className="mt-5 text-sm md:text-base uppercase tracking-wider text-[var(--color-ink-500)]">
                {about.literaryIdentity}
              </p>
            )}

            {welcomeQuote && (
              <p className="mt-6 font-bangla text-lg md:text-xl italic text-[var(--color-ink-600)] leading-relaxed border-l-2 border-[var(--color-gold-400)] pl-5">
                “{welcomeQuote}”
              </p>
            )}

            {about?.shortBio && (
              <p className="mt-6 text-base md:text-lg text-[var(--color-ink-600)] leading-[1.9] font-bangla">
                {about.shortBio}
              </p>
            )}

            <div className="mt-10">
              <Link
                href="/porichiti"
                className="group inline-flex items-center gap-2 text-[var(--color-green-deep)] font-medium hover:text-[var(--color-gold-600)] transition-colors"
              >
                <span className="border-b border-current pb-1">
                  সম্পূর্ণ পরিচিতি পড়ুন
                </span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}