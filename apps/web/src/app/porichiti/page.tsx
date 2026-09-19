//apps/web/src/app/porichiti/page.tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import { Award, Mail, Phone, Globe, Feather } from 'lucide-react';
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaXTwitter,
} from 'react-icons/fa6';

import { fetchAbout } from '@/lib/api/endpoints';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { IslamicDivider } from '@/components/shared/IslamicDivider';
import { siteConfig } from '@/config/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'পরিচিতি',
  description: `${siteConfig.name}-এর জীবন, সাহিত্যিক পরিচয়, অর্জন ও কর্ম।`,
  openGraph: {
    title: 'পরিচিতি',
    description: `${siteConfig.name}-এর জীবন ও সাহিত্যিক পরিচয়।`,
  },
};

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  youtube: FaYoutube,
  twitter: FaXTwitter,
  website: Globe,
};

export default async function AboutPage() {
  let about: any = null;
  try {
    about = await fetchAbout();
  } catch {
    about = null;
  }

  return (
    <>
      {/* Hero header */}
      <section className="relative pt-32 md:pt-40 pb-16 bg-[var(--color-cream-100)] overflow-hidden">
        <div className="absolute inset-0 pattern-islamic-soft opacity-[0.15]" />
        <div className="relative container-literary">
          <Breadcrumb
            items={[{ label: 'হোম', href: '/' }, { label: 'পরিচিতি' }]}
            className="mb-8"
          />

          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-gold-600)] font-medium mb-4">
              লেখক পরিচিতি
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-[var(--color-green-deep)] leading-tight mb-6">
              {siteConfig.name}
            </h1>
            {about?.literaryIdentity && (
              <p className="text-sm uppercase tracking-wider text-[var(--color-ink-500)] mb-6">
                {about.literaryIdentity}
              </p>
            )}
            <IslamicDivider className="max-w-xs mx-auto" />
          </div>
        </div>
      </section>

      {/* Portrait + Bio */}
      <section className="py-16 md:py-20">
        <div className="container-literary">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-start">
            {/* Portrait */}
            <div className="md:col-span-5 md:sticky md:top-32">
              <div className="relative max-w-sm mx-auto md:mx-0">
                <div className="absolute -inset-3 border border-[var(--color-gold-400)]/40 rounded-sm" />
                <div className="absolute -inset-6 border border-[var(--color-gold-400)]/20 rounded-sm" />

                <div className="relative aspect-[4/5] rounded-sm overflow-hidden bg-[var(--color-cream-100)]">
                  {about?.portraitImage ? (
                    <Image
                      src={about.portraitImage}
                      alt={siteConfig.name}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 pattern-islamic-soft flex items-center justify-center">
                      <Feather className="w-16 h-16 text-[var(--color-gold-400)] opacity-50" />
                    </div>
                  )}
                </div>

                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-[var(--color-gold-500)]" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-[var(--color-gold-500)]" />
              </div>

              {/* Contact quick */}
              <div className="mt-10 space-y-3 max-w-sm mx-auto md:mx-0">
                {about?.contactEmail && (
                  <a
                    href={`mailto:${about.contactEmail}`}
                    className="flex items-center gap-3 text-sm text-[var(--color-ink-600)] hover:text-[var(--color-green-deep)] transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[var(--color-gold-600)]" />
                    {about.contactEmail}
                  </a>
                )}
                {about?.contactPhone && (
                  <a
                    href={`tel:${about.contactPhone}`}
                    className="flex items-center gap-3 text-sm text-[var(--color-ink-600)] hover:text-[var(--color-green-deep)] transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[var(--color-gold-600)]" />
                    {about.contactPhone}
                  </a>
                )}

                {about?.socialLinks?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-3">
                    {about.socialLinks.map((s: any) => {
                      const Icon = SOCIAL_ICONS[s.platform.toLowerCase()] || Globe;
                      return (
                        <a
                          key={s.platform}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--color-border)] text-[var(--color-ink-500)] hover:border-[var(--color-gold-400)] hover:text-[var(--color-green-deep)] transition-colors"
                          aria-label={s.platform}
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Bio + Timeline */}
            <div className="md:col-span-7">
              {about?.shortBio && (
                <div className="mb-10">
                  <p className="font-bangla text-xl md:text-2xl italic text-[var(--color-ink-700)] leading-relaxed border-l-2 border-[var(--color-gold-400)] pl-5">
                    {about.shortBio}
                  </p>
                </div>
              )}

              {about?.fullBio && (
                <div
                  className="prose-reading"
                  dangerouslySetInnerHTML={{ __html: about.fullBio }}
                />
              )}

              {/* Achievements */}
              {about?.achievements?.length > 0 && (
                <div className="mt-14">
                  <div className="flex items-center gap-3 mb-6">
                    <Award className="w-5 h-5 text-[var(--color-gold-600)]" />
                    <h2 className="font-bangla text-2xl font-semibold text-[var(--color-green-deep)]">
                      অর্জন ও সম্মাননা
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {about.achievements.map((ach: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-[var(--color-ink-700)] font-bangla"
                      >
                        <span className="text-[var(--color-gold-500)] mt-1.5 shrink-0">
                          ◆
                        </span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Timeline */}
              {about?.timeline?.length > 0 && (
                <div className="mt-14">
                  <h2 className="font-bangla text-2xl font-semibold text-[var(--color-green-deep)] mb-8">
                    জীবন-পথচলা
                  </h2>
                  <div className="relative pl-6 border-l-2 border-[var(--color-gold-400)]/40">
                    {about.timeline.map((entry: any, idx: number) => (
                      <div key={idx} className="relative pb-8 last:pb-0">
                        <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[var(--color-gold-500)] border-2 border-[var(--color-cream-50)]" />
                        <p className="text-sm font-medium text-[var(--color-gold-600)] mb-1">
                          {entry.year}
                        </p>
                        <h3 className="font-bangla text-lg font-semibold text-[var(--color-ink-800)] mb-1">
                          {entry.title}
                        </h3>
                        {entry.description && (
                          <p className="text-sm text-[var(--color-ink-600)] font-bangla leading-relaxed">
                            {entry.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!about?.fullBio && !about?.shortBio && (
                <div className="text-center py-16">
                  <p className="font-bangla text-[var(--color-ink-500)]">
                    পরিচিতি এখনো যোগ করা হয়নি।
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}