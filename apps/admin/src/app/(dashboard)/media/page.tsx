// apps/admin/src/app/(dashboard)/media/page.tsx
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Copy, Loader2, ImageIcon, Check } from 'lucide-react';
import { toast } from 'sonner';

import { apiClient, getAccessToken } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
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
import { cn } from '@kobi/ui';

interface MediaAsset {
  _id: string;
  publicId: string;
  secureUrl: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  folder: string;
  createdAt: string;
}

const FOLDERS = [
  { value: 'kobi-website/hero', label: 'হিরো স্লাইড' },
  { value: 'kobi-website/poem-covers', label: 'কবিতার কভার' },
  { value: 'kobi-website/lyric-covers', label: 'লিরিকের কভার' },
  { value: 'kobi-website/portraits', label: 'পোর্ট্রেট' },
  { value: 'kobi-website/misc', label: 'অন্যান্য' },
];

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [folder, setFolder] = useState(FOLDERS[0].value);
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<{ data: MediaAsset[]; meta: any }>(
        '/admin/media?limit=100',
      );
      setAssets(res.data);
    } catch (err: any) {
      toast.error(err?.message || 'লোড ব্যর্থ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const uploadFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    if (arr.length === 0) return;
    if (arr.length > 20) {
      toast.error('একবারে সর্বোচ্চ ২০টি ফাইল');
      return;
    }

    setUploading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const token = getAccessToken();
      const formData = new FormData();
      arr.forEach((f) => formData.append('files', f));

      const res = await fetch(
        `${API_URL}/api/v1/admin/media/upload-many?folder=${encodeURIComponent(folder)}`,
        {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        },
      );

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.message || 'Upload failed');
      }

      toast.success(`${arr.length}টি ফাইল আপলোড হয়েছে`);
      load();
    } catch (err: any) {
      toast.error(err?.message || 'আপলোড ব্যর্থ');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
  };

  const copyUrl = async (asset: MediaAsset) => {
    try {
      await navigator.clipboard.writeText(asset.secureUrl);
      setCopiedId(asset._id);
      toast.success('URL কপি হয়েছে');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('কপি ব্যর্থ');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient.delete(`/admin/media/${deleteTarget._id}`);
      toast.success('মুছে ফেলা হয়েছে');
      setDeleteTarget(null);
      load();
    } catch (err: any) {
      toast.error(err?.message || 'ব্যর্থ');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${toBengaliDigits(bytes)} B`;
    if (bytes < 1024 * 1024) return `${toBengaliDigits((bytes / 1024).toFixed(1))} KB`;
    return `${toBengaliDigits((bytes / 1024 / 1024).toFixed(1))} MB`;
  };

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-bangla text-xl font-semibold text-[var(--color-admin-primary)]">
            মিডিয়া লাইব্রেরি
          </h1>
          <p className="text-xs text-[var(--color-admin-text-muted)] font-bangla">
            {toBengaliDigits(assets.length)}টি ছবি
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="h-10 px-3 rounded-md border border-[var(--color-admin-border)] bg-white text-sm font-bangla"
          >
            {FOLDERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            আপলোড
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) uploadFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'rounded-lg border-2 border-dashed p-12 text-center transition-colors',
          dragging
            ? 'border-[var(--color-admin-accent)] bg-[var(--color-admin-accent)]/5'
            : 'border-[var(--color-admin-border)] bg-[var(--color-admin-surface)]',
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-admin-primary)] mx-auto mb-3" />
            <p className="font-bangla text-[var(--color-admin-text-muted)]">
              আপলোড হচ্ছে…
            </p>
          </>
        ) : (
          <>
            <Upload className="w-8 h-8 text-[var(--color-admin-text-subtle)] mx-auto mb-3" />
            <p className="font-bangla text-[var(--color-admin-text-muted)]">
              এখানে ছবি টেনে আনুন অথবা "আপলোড" বাটনে ক্লিক করুন
            </p>
            <p className="text-xs text-[var(--color-admin-text-subtle)] mt-1">
              JPG, PNG, WebP, GIF, SVG · সর্বোচ্চ ৮ MB · একবারে ২০টি পর্যন্ত
            </p>
          </>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : assets.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <ImageIcon className="w-10 h-10 text-[var(--color-admin-text-subtle)] mx-auto mb-3" />
          <p className="font-bangla text-[var(--color-admin-text-muted)]">
            এখনো কোনো ছবি নেই
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map((asset) => (
            <div
              key={asset._id}
              className="group bg-white rounded-lg border border-[var(--color-admin-border)] overflow-hidden hover:shadow-md transition-all"
            >
              <div className="relative aspect-square bg-[var(--color-admin-bg)]">
                <Image
                  src={asset.secureUrl}
                  alt={asset.publicId}
                  fill
                  sizes="250px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => copyUrl(asset)}
                    className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                    title="URL কপি"
                  >
                    {copiedId === asset._id ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(asset)}
                    className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors text-red-600"
                    title="মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-[var(--color-admin-text)] truncate">
                  {asset.publicId.split('/').pop()}
                </p>
                <div className="flex items-center justify-between text-[10px] text-[var(--color-admin-text-muted)] mt-1">
                  <span>{formatBytes(asset.bytes)}</span>
                  <span>{asset.format.toUpperCase()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ছবি মুছবেন?</AlertDialogTitle>
            <AlertDialogDescription>
              Cloudinary ও ডাটাবেজ থেকে স্থায়ীভাবে মুছে যাবে। যদি কোথাও ব্যবহার হয়ে থাকে, সেটি আর কাজ করবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>মুছুন</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}