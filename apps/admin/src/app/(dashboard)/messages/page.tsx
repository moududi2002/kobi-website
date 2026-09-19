// apps/admin/src/app/(dashboard)/messages/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Loader2,
  Mail,
  MailOpen,
  Trash2,
  MessageSquare,
  Phone,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
  readAt?: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      qs.set('page', String(page));
      qs.set('limit', '20');
      if (status) qs.set('status', status);
      const res = await apiClient.get<{ data: ContactMessage[]; meta: any }>(
        `/admin/contact?${qs.toString()}`,
      );
      setMessages(res.data);
      setMeta(res.meta);
    } catch (err: any) {
      toast.error(err?.message || 'লোড ব্যর্থ');
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    load();
  }, [load]);

  const openMessage = async (msg: ContactMessage) => {
    setSelected(msg);
    if (msg.status === 'new') {
      try {
        await apiClient.patch(`/admin/contact/${msg._id}/status`, {
          status: 'read',
        });
        load();
      } catch {
        // ignore
      }
    }
  };

  const updateStatus = async (
    id: string,
    newStatus: 'new' | 'read' | 'replied' | 'archived',
  ) => {
    try {
      await apiClient.patch(`/admin/contact/${id}/status`, { status: newStatus });
      toast.success('আপডেট হয়েছে');
      setSelected(null);
      load();
    } catch (err: any) {
      toast.error(err?.message || 'ব্যর্থ');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient.delete(`/admin/contact/${deleteTarget._id}`);
      toast.success('মুছে ফেলা হয়েছে');
      setDeleteTarget(null);
      setSelected(null);
      load();
    } catch (err: any) {
      toast.error(err?.message || 'ব্যর্থ');
    }
  };

  const statusBadge = (s: ContactMessage['status']) => {
    const config = {
      new: { label: 'নতুন', cls: 'bg-red-100 text-red-700' },
      read: { label: 'পঠিত', cls: 'bg-blue-100 text-blue-700' },
      replied: { label: 'উত্তর দেওয়া', cls: 'bg-green-100 text-green-700' },
      archived: { label: 'আর্কাইভড', cls: 'bg-gray-100 text-gray-700' },
    }[s];
    return <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full font-bangla ${config.cls}`}>{config.label}</span>;
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-bangla text-xl font-semibold text-[var(--color-admin-primary)]">
            বার্তা
          </h1>
          <p className="text-xs text-[var(--color-admin-text-muted)] font-bangla">
            {meta ? `মোট ${toBengaliDigits(meta.total)}টি` : ' '}
          </p>
        </div>
        <Select
          value={status || 'all'}
          onValueChange={(v) => {
            setStatus(v === 'all' ? '' : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">সব</SelectItem>
            <SelectItem value="new">নতুন</SelectItem>
            <SelectItem value="read">পঠিত</SelectItem>
            <SelectItem value="replied">উত্তর দেওয়া</SelectItem>
            <SelectItem value="archived">আর্কাইভড</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg border border-[var(--color-admin-border)] overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-10 h-10 text-[var(--color-admin-text-subtle)] mx-auto mb-3" />
            <p className="font-bangla text-[var(--color-admin-text-muted)]">
              কোনো বার্তা নেই
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--color-admin-border)]">
            {messages.map((msg) => (
              <li
                key={msg._id}
                onClick={() => openMessage(msg)}
                className={`p-4 cursor-pointer hover:bg-[var(--color-admin-surface-hover)] transition-colors flex items-center gap-4 ${
                  msg.status === 'new' ? 'bg-red-50/40' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[var(--color-admin-primary)]/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-[var(--color-admin-primary)]">
                    {msg.name[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-[var(--color-admin-text)] font-bangla">
                      {msg.name}
                    </span>
                    {statusBadge(msg.status)}
                  </div>
                  <p className="text-sm text-[var(--color-admin-text-muted)] truncate mt-0.5 font-bangla">
                    {msg.subject}
                  </p>
                  <p className="text-xs text-[var(--color-admin-text-subtle)] mt-0.5">
                    {msg.email}
                  </p>
                </div>
                <span className="text-xs text-[var(--color-admin-text-subtle)] whitespace-nowrap shrink-0">
                  {formatBengaliDateTime(msg.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-bangla">
                  {selected.subject}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-admin-primary)]/10 flex items-center justify-center">
                    <span className="font-semibold text-[var(--color-admin-primary)]">
                      {selected.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-admin-text)] font-bangla">
                      {selected.name}
                    </p>
                    <p className="text-xs text-[var(--color-admin-text-muted)]">
                      {selected.email}
                      {selected.phone && ` · ${selected.phone}`}
                    </p>
                  </div>
                  <div className="ml-auto">{statusBadge(selected.status)}</div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[var(--color-admin-text-muted)]">
                  <Clock className="w-3.5 h-3.5" />
                  {formatBengaliDateTime(selected.createdAt)}
                </div>

                <div className="p-4 rounded-md bg-[var(--color-admin-bg)] border border-[var(--color-admin-border)]">
                  <p className="font-bangla text-[var(--color-admin-text)] whitespace-pre-wrap leading-relaxed">
                    {selected.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-4 border-t">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                    className="flex-1"
                  >
                    <Button className="w-full">
                      <Mail className="w-4 h-4" />
                      উত্তর দিন
                    </Button>
                  </a>
                  <Select
                    value={selected.status}
                    onValueChange={(v) => updateStatus(selected._id, v as any)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">নতুন</SelectItem>
                      <SelectItem value="read">পঠিত</SelectItem>
                      <SelectItem value="replied">উত্তর দেওয়া</SelectItem>
                      <SelectItem value="archived">আর্কাইভড</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteTarget(selected)}
                    className="text-red-600 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>বার্তা মুছবেন?</AlertDialogTitle>
            <AlertDialogDescription>
              স্থায়ীভাবে মুছে যাবে।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>মুছুন</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
    </div>
  );
}