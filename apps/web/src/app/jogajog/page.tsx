//apps/web/src/app/jogajog/page.tsx
import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaXTwitter,
} from 'react-icons/fa6';

import { fetchAbout, fetchSettings } from '@/lib/api/endpoints';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { IslamicDivider } from '@/components/shared/IslamicDivider';
import { ContactForm } from '@/components/contact/ContactForm';
import { siteConfig } from '@/config/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'যোগাযোগ',
  description: `${siteConfig.name}-এর সাথে যোগাযোগ করুন।`,
};

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  youtube: FaYoutube,
  twitter: FaXTwitter,
  website: Globe,
};

export default async function ContactPage() {
  const [about, settings] = await Promise.all([
    fetchAbout().catch(() => null),
    fetchSettings().catch(() => null),
  ]);

  const email = settings?.contactEmail || about?.contactEmail || '';
  const phone = settings?.contactPhone || about?.contactPhone || '';
  const socials = settings?.socialLinks || about?.socialLinks || [];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 md:pt-40 pb-16 bg-[var(--color-cream-100)] overflow-hidden">
        <div className="absolute inset-0 pattern-islamic-soft opacity-[0.15]" />
        <div className="relative container-literary">
          <Breadcrumb
            items={[{ label: 'হোম', href: '/' }, { label: 'যোগাযোগ' }]}
            className="mb-8"
          />

          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-gold-600)] font-medium mb-4">
              যোগাযোগ
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-[var(--color-green-deep)] leading-tight mb-6">
              কথা বলুন
            </h1>
            <IslamicDivider className="max-w-xs mx-auto" />
            <p className="mt-6 text-[var(--color-ink-600)] font-bangla text-base md:text-lg leading-relaxed">
              প্রশংসা, পরামর্শ, প্রশ্ন বা যেকোনো মতামত — সবকিছুর জন্য আপনাকে স্বাগতম।
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <div className="container-literary">
          <div className="grid md:grid-cols-12 gap-12">
            {/* Info */}
            <div className="md:col-span-5">
              <h2 className="font-bangla text-2xl font-semibold text-[var(--color-green-deep)] mb-6">
                সরাসরি যোগাযোগ
              </h2>

              <div className="space-y-5">
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="group flex items-start gap-4 p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-gold-400)] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--color-cream-100)] group-hover:bg-[var(--color-gold-400)] flex items-center justify-center shrink-0 transition-colors">
                      <Mail className="w-4 h-4 text-[var(--color-green-deep)]" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[var(--color-ink-400)] mb-1">
                        ইমেইল
                      </p>
                      <p className="text-sm text-[var(--color-ink-700)] font-bangla">
                        {email}
                      </p>
                    </div>
                  </a>
                )}

                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="group flex items-start gap-4 p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-gold-400)] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--color-cream-100)] group-hover:bg-[var(--color-gold-400)] flex items-center justify-center shrink-0 transition-colors">
                      <Phone className="w-4 h-4 text-[var(--color-green-deep)]" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[var(--color-ink-400)] mb-1">
                        ফোন
                      </p>
                      <p className="text-sm text-[var(--color-ink-700)] font-bangla">
                        {phone}
                      </p>
                    </div>
                  </a>
                )}
              </div>

              {socials.length > 0 && (
                <div className="mt-10">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-ink-400)] font-medium mb-4">
                    সামাজিক মাধ্যম
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {socials.map((s: any) => {
                      const Icon = SOCIAL_ICONS[s.platform.toLowerCase()] || Globe;
                      return (
                        <a
                          key={s.platform}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[var(--color-border)] text-[var(--color-ink-500)] hover:border-[var(--color-gold-400)] hover:text-[var(--color-green-deep)] transition-colors"
                          aria-label={s.platform}
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Form */}
            <div className="md:col-span-7">
              <div className="p-8 md:p-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-cream-50)] shadow-[var(--shadow-soft)]">
                <h2 className="font-bangla text-2xl font-semibold text-[var(--color-green-deep)] mb-2">
                  বার্তা পাঠান
                </h2>
                <p className="text-sm text-[var(--color-ink-500)] font-bangla mb-8">
                  নিচের ফর্ম পূরণ করুন — যত দ্রুত সম্ভব উত্তর দেওয়ার চেষ্টা করব।
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}