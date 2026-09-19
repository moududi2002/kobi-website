//apps/web/src/components/layout/Footer.tsx
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { footerNav } from '@/config/nav';
import { IslamicDivider } from '@/components/shared/IslamicDivider';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const bnYear = currentYear
    .toString()
    .replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);

  return (
    <footer className="relative mt-24 border-t border-[var(--color-border)] bg-[var(--color-cream-100)]">
      {/* Islamic pattern overlay */}
      <div
        className="absolute inset-0 pattern-islamic-soft opacity-40 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative container-literary py-16">
        {/* Top row — name + bismillah */}
        <div className="text-center mb-12">
          <p className="font-arabic text-2xl text-[var(--color-green-deep)] mb-2">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <IslamicDivider />
        </div>

        {/* Nav grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="font-display text-2xl font-semibold text-[var(--color-green-deep)]"
            >
              {siteConfig.name}
            </Link>
            <p className="mt-3 text-sm text-[var(--color-ink-500)] leading-relaxed">
              {siteConfig.description}
            </p>
          </div>

          {footerNav.sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-ink-700)] mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-ink-500)] hover:text-[var(--color-green-deep)] transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-ink-400)]">
            © {bnYear} {siteConfig.name}। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p className="text-xs text-[var(--color-ink-400)]">
            ভালোবাসা ও শ্রদ্ধায় নির্মিত
          </p>
        </div>
      </div>
    </footer>
  );
}