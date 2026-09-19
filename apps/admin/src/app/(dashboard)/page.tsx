//apps/admin/src/app/(dashboard)/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Music2,
  FolderTree,
  MessageSquare,
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/components/providers/AuthProvider';
import {
  fetchDashboardStats,
  fetchRecentActivity,
  type DashboardStats,
  type RecentItem,
} from '@/lib/api/endpoints';
import { formatBengaliDateTime, toBengaliDigits } from '@kobi/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, r] = await Promise.all([
          fetchDashboardStats(),
          fetchRecentActivity(),
        ]);
        setStats(s);
        setRecent(r);
      } catch (err: any) {
        toast.error(err?.message || 'ডেটা লোড করা যায়নি');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Greeting */}
      <div>
        <h2 className="font-bangla text-2xl font-semibold text-[var(--color-admin-primary)] mb-1">
          আসসালামু আলাইকুম, {user?.name?.split(' ')[0] || 'Admin'}
        </h2>
        <p className="text-sm text-[var(--color-admin-text-muted)] font-bangla">
          আপনার সাহিত্যকর্মের সংক্ষিপ্ত অবস্থা দেখে নিন
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label="মোট কবিতা"
          value={stats?.totalPoems}
          sub={`${stats?.publishedPoems ?? 0} প্রকাশিত`}
          href="/poems"
          loading={loading}
          tone="primary"
        />
        <StatCard
          icon={Music2}
          label="মোট লিরিক"
          value={stats?.totalLyrics}
          sub={`${stats?.publishedLyrics ?? 0} প্রকাশিত`}
          href="/lyrics"
          loading={loading}
          tone="accent"
        />
        <StatCard
          icon={FileText}
          label="ড্রাফট"
          value={
            (stats?.draftPoems ?? 0) + (stats?.draftLyrics ?? 0)
          }
          sub="প্রকাশের অপেক্ষায়"
          href="/poems?status=draft"
          loading={loading}
          tone="warning"
        />
        <StatCard
          icon={MessageSquare}
          label="নতুন বার্তা"
          value={stats?.newMessages}
          sub="উত্তরের অপেক্ষায়"
          href="/messages?status=new"
          loading={loading}
          tone="danger"
        />
      </div>

      {/* Two-column grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent activity */}
        <div className="lg:col-span-2 bg-[var(--color-admin-surface)] rounded-lg border border-[var(--color-admin-border)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-admin-border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--color-admin-text-muted)]" />
              <h3 className="font-bangla text-sm font-semibold text-[var(--color-admin-text)]">
                সাম্প্রতিক কার্যক্রম
              </h3>
            </div>
            <Link
              href="/poems"
              className="text-xs text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-primary)] flex items-center gap-1 transition-colors"
            >
              সব দেখুন
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-[var(--color-admin-border)]">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="px-5 py-3.5">
                  <div className="h-4 bg-[var(--color-admin-surface-hover)] rounded animate-pulse" />
                </div>
              ))
            ) : recent.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-[var(--color-admin-text-muted)] font-bangla">
                এখনো কোনো কার্যক্রম নেই
              </div>
            ) : (
              recent.map((item) => (
                <Link
                  key={`${item.type}-${item._id}`}
                  href={
                    item.type === 'poem'
                      ? `/poems/${item._id}`
                      : `/lyrics/${item._id}`
                  }
                  className="px-5 py-3.5 flex items-center gap-3 hover:bg-[var(--color-admin-surface-hover)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-md bg-[var(--color-admin-surface-hover)] flex items-center justify-center shrink-0">
                    {item.type === 'poem' ? (
                      <BookOpen className="w-3.5 h-3.5 text-[var(--color-admin-text-muted)]" />
                    ) : (
                      <Music2 className="w-3.5 h-3.5 text-[var(--color-admin-text-muted)]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-admin-text)] font-bangla truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-[var(--color-admin-text-muted)]">
                      {formatBengaliDateTime(item.updatedAt)}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-[var(--color-admin-surface)] rounded-lg border border-[var(--color-admin-border)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-admin-border)]">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[var(--color-admin-text-muted)]" />
              <h3 className="font-bangla text-sm font-semibold text-[var(--color-admin-text)]">
                দ্রুত কার্যক্রম
              </h3>
            </div>
          </div>

          <div className="p-3 space-y-1">
            <QuickAction
              href="/poems/new"
              icon={BookOpen}
              label="নতুন কবিতা"
            />
            <QuickAction
              href="/lyrics/new"
              icon={Music2}
              label="নতুন লিরিক"
            />
            <QuickAction
              href="/media"
              icon={FolderTree}
              label="মিডিয়া আপলোড"
            />
            <QuickAction
              href="/messages"
              icon={MessageSquare}
              label="বার্তা দেখুন"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------- Sub components ----------------

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  href,
  loading,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: number;
  sub: string;
  href: string;
  loading: boolean;
  tone: 'primary' | 'accent' | 'warning' | 'danger';
}) {
  const toneClasses = {
    primary: 'bg-[var(--color-admin-primary)]/10 text-[var(--color-admin-primary)]',
    accent: 'bg-[var(--color-admin-accent)]/15 text-[var(--color-admin-accent)]',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
  }[tone];

  return (
    <Link
      href={href}
      className="bg-[var(--color-admin-surface)] rounded-lg border border-[var(--color-admin-border)] p-5 hover:border-[var(--color-admin-accent)] hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${toneClasses}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <ArrowRight className="w-4 h-4 text-[var(--color-admin-text-subtle)] opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="text-3xl font-bold text-[var(--color-admin-text)] tabular-nums">
        {loading ? (
          <span className="inline-block w-12 h-8 bg-[var(--color-admin-surface-hover)] rounded animate-pulse" />
        ) : (
          toBengaliDigits(value ?? 0)
        )}
      </div>
      <p className="text-sm font-medium text-[var(--color-admin-text)] mt-1 font-bangla">
        {label}
      </p>
      <p className="text-xs text-[var(--color-admin-text-muted)] mt-0.5 font-bangla">
        {sub}
      </p>
    </Link>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-[var(--color-admin-text-muted)] hover:bg-[var(--color-admin-surface-hover)] hover:text-[var(--color-admin-primary)] transition-colors group"
    >
      <div className="w-8 h-8 rounded-md bg-[var(--color-admin-surface-hover)] group-hover:bg-[var(--color-admin-accent)]/15 flex items-center justify-center transition-colors">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span className="font-bangla font-medium flex-1">{label}</span>
      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}

function StatusBadge({ status }: { status: 'draft' | 'published' | 'archived' }) {
  const config = {
    draft: { label: 'ড্রাফট', cls: 'bg-[var(--color-status-draft-bg)] text-[var(--color-status-draft-fg)]' },
    published: { label: 'প্রকাশিত', cls: 'bg-[var(--color-status-published-bg)] text-[var(--color-status-published-fg)]' },
    archived: { label: 'আর্কাইভড', cls: 'bg-[var(--color-status-archived-bg)] text-[var(--color-status-archived-fg)]' },
  }[status];

  return (
    <span
      className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 font-bangla ${config.cls}`}
    >
      {config.label}
    </span>
  );
}