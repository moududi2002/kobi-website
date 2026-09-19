//apps/web/src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { mainNav } from '@/config/nav';
import { siteConfig } from '@/config/site';
import { cn } from '@kobi/ui';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[var(--color-cream-50)]/95 backdrop-blur-md border-b border-[var(--color-border)]'
          : 'bg-transparent',
      )}
    >
      <div className="container-literary">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-baseline gap-2 group"
            aria-label={siteConfig.name}
          >
            <span className="font-display text-2xl md:text-3xl font-semibold text-[var(--color-green-deep)] tracking-tight">
              {siteConfig.name}
            </span>
            <span className="hidden md:inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-gold-500)] group-hover:scale-150 transition-transform" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {mainNav.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));

              if (item.children) {
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.href)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        isActive
                          ? 'text-[var(--color-green-deep)]'
                          : 'text-[var(--color-ink-600)] hover:text-[var(--color-green-deep)]',
                      )}
                    >
                      {item.title}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </Link>
                    <AnimatePresence>
                      {openDropdown === item.href && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18 }}
                          className="absolute top-full left-0 pt-2 min-w-[200px]"
                        >
                          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-cream-50)] shadow-[var(--shadow-elevated)] py-2">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="block px-4 py-2 text-sm text-[var(--color-ink-700)] hover:bg-[var(--color-cream-100)] hover:text-[var(--color-green-deep)] transition-colors"
                              >
                                {child.title}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'text-[var(--color-green-deep)]'
                      : 'text-[var(--color-ink-600)] hover:text-[var(--color-green-deep)]',
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 -mr-2 text-[var(--color-ink-700)]"
            aria-label="মেনু"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-[var(--color-cream-50)] overflow-y-auto"
          >
            <nav className="container-literary py-6">
              <ul className="space-y-1">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'block py-3 text-lg font-medium border-b border-[var(--color-border)]',
                        pathname === item.href
                          ? 'text-[var(--color-green-deep)]'
                          : 'text-[var(--color-ink-700)]',
                      )}
                    >
                      {item.title}
                    </Link>
                    {item.children && (
                      <ul className="pl-4 py-1">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block py-2 text-sm text-[var(--color-ink-500)]"
                            >
                              — {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}