//apps/admin/src/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Music2,
  FolderTree,
  User as UserIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Image as ImageIcon,
  MessageSquare,
  ChevronLeft,
  Menu,
} from 'lucide-react';

import { cn } from '@kobi/ui';
import { apiClient } from '@/lib/api/client';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const mainNav: NavItem[] = [
  { href: '/', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
  { href: '/poems', label: 'কবিতা', icon: BookOpen },
  { href: '/lyrics', label: 'লিরিক্স', icon: Music2 },
  { href: '/categories', label: 'বিভাগ', icon: FolderTree },
];

const contentNav: NavItem[] = [
  { href: '/about', label: 'পরিচিতি', icon: UserIcon },
  { href: '/homepage', label: 'হোমপেজ', icon: HomeIcon },
];

const systemNav: NavItem[] = [
  { href: '/media', label: 'মিডিয়া', icon: ImageIcon },
  { href: '/messages', label: 'বার্তা', icon: MessageSquare },
  { href: '/settings', label: 'সেটিংস', icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newMessages, setNewMessages] = useState(0);

  // Fetch new message count
  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get<{ count: number }>(
          '/admin/contact/count-new',
        );
        setNewMessages(res.count);
      } catch {
        // ignore
      }
    })();
  }, [pathname]);


  // Listen for mobile toggle event (from Topbar)
  useEffect(() => {
  const handler = () => setMobileOpen((v) => !v);
  window.addEventListener('toggle-mobile-sidebar', handler);
  return () => window.removeEventListener('toggle-mobile-sidebar', handler);
    }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const sections: { items: NavItem[] }[] = [
    { items: mainNav },
    { items: contentNav },
    {
      items: systemNav.map((item) =>
        item.href === '/messages' ? { ...item, badge: newMessages } : item,
      ),
    },
  ];

  const SidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-[var(--color-admin-border)]">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-md bg-[var(--color-admin-primary)] flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">ক</span>
          </div>
          {!collapsed && (
            <span className="font-bangla font-semibold text-[var(--color-admin-primary)]">
              অ্যাডমিন
            </span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="mb-4">
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'mx-3 px-3 py-2.5 rounded-md flex items-center gap-3 transition-colors group relative',
                    isActive
                      ? 'bg-[var(--color-admin-primary)] text-white'
                      : 'text-[var(--color-admin-text-muted)] hover:bg-[var(--color-admin-surface-hover)] hover:text-[var(--color-admin-text)]',
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  {!collapsed && (
                    <span className="font-bangla text-sm font-medium flex-1">
                      {item.label}
                    </span>
                  )}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={cn(
                        'text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center',
                        isActive
                          ? 'bg-white text-[var(--color-admin-primary)]'
                          : 'bg-red-500 text-white',
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle (desktop only) */}
      <div className="hidden md:block border-t border-[var(--color-admin-border)] p-3">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-md text-[var(--color-admin-text-muted)] hover:bg-[var(--color-admin-surface-hover)] transition-colors text-xs"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            className={cn(
              'w-4 h-4 transition-transform',
              collapsed && 'rotate-180',
            )}
          />
          {!collapsed && <span className="font-bangla">সংকুচিত করুন</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className={cn(
          'hidden md:flex flex-col bg-[var(--color-admin-surface)] border-r border-[var(--color-admin-border)] transition-all duration-300 shrink-0',
          collapsed ? 'w-[72px]' : 'w-64',
        )}
      >
        {SidebarContent}
      </aside>

      {/* Mobile hamburger — topbar-এ থাকবে, তাই এখানে নেই */}

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed top-0 left-0 bottom-0 w-64 bg-[var(--color-admin-surface)] border-r border-[var(--color-admin-border)] z-50 md:hidden">
            {SidebarContent}
          </aside>
        </>
        
      )}
    </>
  );
}

/**
 * Export a hook for Topbar to trigger mobile sidebar
 */
let mobileToggle: (() => void) | null = null;
export function registerMobileToggle(cb: () => void) {
  mobileToggle = cb;
}