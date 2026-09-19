// apps/admin/src/components/layout/Topbar.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import {
  Menu,
  ExternalLink,
  LogOut,
  User as UserIcon,
  ChevronDown,
} from 'lucide-react';

import { useAuth } from '@/components/providers/AuthProvider';

const PAGE_TITLES: Record<string, string> = {
  '/': 'ড্যাশবোর্ড',
  '/poems': 'কবিতা',
  '/lyrics': 'লিরিক্স',
  '/categories': 'বিভাগ',
  '/about': 'পরিচিতি',
  '/homepage': 'হোমপেজ',
  '/media': 'মিডিয়া',
  '/messages': 'বার্তা',
  '/settings': 'সেটিংস',
};

export function Topbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const title =
    Object.entries(PAGE_TITLES).find(([key]) =>
      key === '/' ? pathname === '/' : pathname.startsWith(key),
    )?.[1] || 'Admin';

  const publicUrl =
    process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000';

  return (
    <header className="h-16 bg-[var(--color-admin-surface)] border-b border-[var(--color-admin-border)] flex items-center px-4 md:px-6 gap-4 shrink-0">
      {/* Mobile hamburger */}
      <button
        onClick={() =>
          window.dispatchEvent(new Event('toggle-mobile-sidebar'))
        }
        className="md:hidden p-2 -ml-2 rounded-md hover:bg-[var(--color-admin-surface-hover)] transition-colors"
        aria-label="মেনু"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <h1 className="font-bangla text-base md:text-lg font-semibold text-[var(--color-admin-text)]">
        {title}
      </h1>

      <div className="flex-1" />

      {/* Public site link */}
      <Link
        href={publicUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-[var(--color-admin-text-muted)] hover:bg-[var(--color-admin-surface-hover)] transition-colors"
      >
        সাইট দেখুন
        <ExternalLink className="w-3 h-3" />
      </Link>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-md hover:bg-[var(--color-admin-surface-hover)] transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-[var(--color-admin-primary)] flex items-center justify-center text-white text-sm font-semibold shrink-0">
            {user?.name?.[0] || 'A'}
          </div>
          <span className="hidden md:block text-sm font-medium text-[var(--color-admin-text)] font-bangla">
            {user?.name || 'Admin'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[var(--color-admin-text-muted)]" />
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg border border-[var(--color-admin-border)] shadow-lg z-40 py-1.5 overflow-hidden">
              <div className="px-3 py-2 border-b border-[var(--color-admin-border)]">
                <p className="text-sm font-medium text-[var(--color-admin-text)] truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-[var(--color-admin-text-muted)] truncate">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={async () => {
                  setMenuOpen(false);
                  await logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-admin-text-muted)] hover:bg-[var(--color-admin-surface-hover)] hover:text-[var(--color-admin-text)] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-bangla">লগআউট</span>
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}