// apps/admin/src/app/(dashboard)/poems/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Star,
  Loader2,
  BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';

import type { Poem } from '@kobi/types';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { formatBengaliDateTime, toBengaliDigits } from '@kobi/utils';

interface ListResponse {
  data: Poem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function PoemsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Poem[]>([]);
  const [meta, setMeta] = useState<ListResponse['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [deleteTarget, setDeleteTarget] = useState<Poem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      qs.set('page', String(page));
      qs.set('limit', '20');
      if (search) qs.set('search', search);
      if (status) qs.set('status', status);

      const res = await apiClient.get<ListResponse>(
        `/admin/poems?${qs.toString()}`,
      );
      setItems(res.data);
      setMeta(res.meta);
    } catch (err: any) {
      toast.error(err?.message || 'লোড করা যায়নি');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    load();
  }, [load]);

  const updateUrl = () => {
    const qs = new URLSearchParams();
    if (search) qs.set('search', search);
    if (status) qs.set('status', status);
    if (page > 1) qs.set('page', String(page));
    const str = qs.toString();
    router.replace(str ? `/poems?${str}` : '/poems');
  };

  useEffect(() => {
    updateUrl();
  }, [search, status, page]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient.delete(`/admin/poems/${deleteTarget._id}`);
      toast.success('কবিতা আর্কাইভ করা হয়েছে');
      setDeleteTarget(null);
      load();
    } catch (err: any) {
      toast.error(err?.message || 'মুছতে ব্যর্থ');
    }
  };

  const togglePublish = async (poem: Poem) => {
    const newStatus = poem.status === 'published' ? 'draft' : 'published';
    try {
      await apiClient.patch(`/admin/poems/${poem._id}/status`, {
        status: newStatus,
      });
      toast.success(
        newStatus === 'published' ? 'প্রকাশিত হয়েছে' : 'ড্রাফটে সরানো হয়েছে',
      );
      load();
    } catch (err: any) {
      toast.error(err?.message || 'পরিবর্তন ব্যর্থ');
    }
  };

  const toggleFeatured = async (poem: Poem) => {
    try {
      await apiClient.patch(`/admin/poems/${poem._id}/featured`, {
        featured: !poem.featured,
      });
      toast.success('আপডেট হয়েছে');
      load();
    } catch (err: any) {
      toast.error(err?.message || 'পরিবর্তন ব্যর্থ');
    }
  };

  const preview = async (poem: Poem) => {
    try {
      const res = await apiClient.post<{ token: string }>(
        `/admin/poems/${poem._id}/preview-token`,
      );
      window.open(
        `${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/preview/${res.token}`,
        '_blank',
      );
    } catch (err: any) {
      toast.error(err?.message || 'প্রিভিউ ব্যর্থ');
    }
  };

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-bangla text-xl font-semibold text-[var(--color-admin-primary)]">
            কবিতা
          </h1>
          <p className="text-xs text-[var(--color-admin-text-muted)] font-bangla">
            {meta ? `মোট ${toBengaliDigits(meta.total)}টি কবিতা` : ' '}
          </p>
        </div>
        <Link href="/poems/new">
          <Button>
            <Plus className="w-4 h-4" />
            নতুন কবিতা
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-[var(--color-admin-surface)] rounded-lg border border-[var(--color-admin-border)] p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-admin-text-muted)]" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="শিরোনাম দিয়ে খুঁজুন…"
            className="pl-9 font-bangla"
          />
        </div>
        <Select
          value={status || 'all'}
          onValueChange={(v) => {
            setStatus(v === 'all' ? '' : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="সব status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">সব status</SelectItem>
            <SelectItem value="draft">ড্রাফট</SelectItem>
            <SelectItem value="published">প্রকাশিত</SelectItem>
            <SelectItem value="archived">আর্কাইভড</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-[var(--color-admin-surface)] rounded-lg border border-[var(--color-admin-border)] overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--color-admin-primary)]" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-10 h-10 text-[var(--color-admin-text-subtle)] mx-auto mb-3" />
            <p className="font-bangla text-[var(--color-admin-text-muted)]">
              কোনো কবিতা নেই
            </p>
            <Link href="/poems/new" className="mt-4 inline-block">
              <Button size="sm">
                <Plus className="w-4 h-4" />
                প্রথম কবিতা লিখুন
              </Button>
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--color-admin-border)]">
            {items.map((poem) => (
              <li
                key={poem._id}
                className="p-4 flex items-center gap-4 hover:bg-[var(--color-admin-surface-hover)] transition-colors"
              >
                {/* Cover thumb */}
                <div className="w-16 h-16 rounded-md bg-[var(--color-admin-bg)] shrink-0 overflow-hidden relative">
                  {poem.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={poem.coverImage}
                      alt={poem.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-[var(--color-admin-text-subtle)]" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/poems/${poem._id}`}
                      className="font-bangla font-medium text-[var(--color-admin-text)] hover:text-[var(--color-admin-primary)] transition-colors truncate"
                    >
                      {poem.title}
                    </Link>
                    <StatusBadge status={poem.status} />
                    {poem.featured && (
                      <Badge variant="accent">
                        <Star className="w-3 h-3 mr-0.5 fill-current" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-[var(--color-admin-text-muted)] mt-1 font-bangla">
                    /{poem.slug} · আপডেট: {formatBengaliDateTime(poem.updatedAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <ActionBtn
                    onClick={() => preview(poem)}
                    title="প্রিভিউ"
                    icon={Eye}
                  />
                  <ActionBtn
                    onClick={() => toggleFeatured(poem)}
                    title={poem.featured ? 'Featured সরান' : 'Featured করুন'}
                    icon={Star}
                    active={poem.featured}
                  />
                  <ActionBtn
                    onClick={() => togglePublish(poem)}
                    title={
                      poem.status === 'published' ? 'ড্রাফটে' : 'প্রকাশ করুন'
                    }
                    icon={poem.status === 'published' ? Eye : Edit}
                  />
                  <Link href={`/poems/${poem._id}`}>
                    <ActionBtn
                      onClick={() => {}}
                      title="সম্পাদনা"
                      icon={Edit}
                    />
                  </Link>
                  <ActionBtn
                    onClick={() => setDeleteTarget(poem)}
                    title="আর্কাইভ করুন"
                    icon={Trash2}
                    destructive
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--color-admin-text-muted)] font-bangla">
            পৃষ্ঠা {toBengaliDigits(meta.page)} / {toBengaliDigits(meta.totalPages)}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              আগের
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              পরের
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>কবিতা আর্কাইভ করবেন?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.title}" আর্কাইভড হিসেবে চিহ্নিত হবে। পরে পুনরুদ্ধার করা যাবে।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>আর্কাইভ</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ---------------- Helpers ----------------

function ActionBtn({
  onClick,
  title,
  icon: Icon,
  active,
  destructive,
}: {
  onClick: () => void;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
        active
          ? 'bg-[var(--color-admin-accent)]/15 text-[var(--color-admin-accent)]'
          : destructive
            ? 'text-[var(--color-admin-text-muted)] hover:bg-red-50 hover:text-red-600'
            : 'text-[var(--color-admin-text-muted)] hover:bg-[var(--color-admin-surface-hover)] hover:text-[var(--color-admin-text)]'
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

function StatusBadge({
  status,
}: {
  status: 'draft' | 'published' | 'archived';
}) {
  const variant = status as 'draft' | 'published' | 'archived';
  const label = { draft: 'ড্রাফট', published: 'প্রকাশিত', archived: 'আর্কাইভড' }[
    status
  ];
  return <Badge variant={variant}>{label}</Badge>;
}