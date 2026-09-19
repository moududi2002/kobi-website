//apps/web/src/components/home/AboutCTA.tsx
'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Feather } from 'lucide-react';

import { IslamicDivider } from '@/components/shared/IslamicDivider';

interface Props {
  poetName?: string;
}

export function AboutCTA({ poetName }: Props) {
  const name = poetName || 'কবির নাম';

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Soft pattern */}
      <div className="absolute inset-0 pattern-islamic-soft opacity-[0.12]" />

      <div className="relative container-literary max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-[var(--color-gold-400)] mb-8"
        >
          <Feather className="w-8 h-8 text-[var(--color-gold-600)]" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--color-green-deep)] leading-tight mb-6"
        >
          জানুন <span className="italic text-[var(--color-gold-600)]">{name}</span>-কে
        </motion.h2>

        <IslamicDivider className="max-w-xs mx-auto" />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-[var(--color-ink-600)] text-lg md:text-xl leading-relaxed font-bangla max-w-2xl mx-auto"
        >
          তাঁর জীবন, সাহিত্যিক পরিচয়, অর্জন ও সৃজনশীলতার দীর্ঘ পথচলা।
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-10"
        >
          <Link
            href="/porichiti"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[var(--color-green-deep)] text-[var(--color-cream-50)] hover:bg-[var(--color-green-deep-soft)] transition-all duration-300 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)]"
          >
            <span className="font-medium">সম্পূর্ণ পরিচিতি</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}