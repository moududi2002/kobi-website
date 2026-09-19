//apps/admin/src/components/media/MediaPickerDialog.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface MediaAsset {
  _id: string;
  publicId: string;
  secureUrl: string;
  format: string;
  folder: string;
  createdAt: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}

export function MediaPickerDialog({ open, onOpenChange, onSelect }: Props) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<{ data: MediaAsset[]; meta: any }>(
        '/admin/media?limit=50',
      );
      setAssets(res.data);
    } catch (err: any) {
      toast.error(err?.message || 'মিডিয়া লোড করা যায়নি');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      // Use fetch directly for multipart
      const token = (await import('@/lib/api/client')).getAccessToken();
      const res = await fetch(
        `${API_URL}/api/v1/admin/media/upload?folder=kobi-website/poem-covers`,
        {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        },
      );

      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.message || 'Upload failed');

      const asset = payload.data;
      toast.success('ছবি আপলোড হয়েছে');
      // Add to list & auto-select
      setAssets((prev) => [asset, ...prev]);
      onSelect(asset.secureUrl);
    } catch (err: any) {
      toast.error(err?.message || 'আপলোড ব্যর্থ');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>মিডিয়া নির্বাচন</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="library">
          <TabsList>
            <TabsTrigger value="library">লাইব্রেরি</TabsTrigger>
            <TabsTrigger value="upload">নতুন আপলোড</TabsTrigger>
          </TabsList>

          <TabsContent value="library">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-[var(--color-admin-primary)]" />
              </div>
            ) : assets.length === 0 ? (
              <p className="text-center text-sm text-[var(--color-admin-text-muted)] py-12 font-bangla">
                এখনো কোনো ছবি নেই
              </p>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto">
                {assets.map((asset) => (
                  <button
                    key={asset._id}
                    type="button"
                    onClick={() => {
                      onSelect(asset.secureUrl);
                      onOpenChange(false);
                    }}
                    className="relative aspect-square rounded-md overflow-hidden border-2 border-transparent hover:border-[var(--color-admin-accent)] transition-colors"
                  >
                    <Image
                      src={asset.secureUrl}
                      alt={asset.publicId}
                      fill
                      sizes="150px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload">
            <div className="py-6">
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                    e.target.value = '';
                  }}
                />
                <div className="w-full aspect-video rounded-md border-2 border-dashed border-[var(--color-admin-border)] hover:border-[var(--color-admin-accent)] transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 text-[var(--color-admin-text-muted)] font-bangla">
                  {uploading ? (
                    <>
                      <Loader2 className="w-8 h-8 animate-spin" />
                      আপলোড হচ্ছে…
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8" />
                      ছবি নির্বাচন করুন (সর্বোচ্চ ৮ MB)
                    </>
                  )}
                </div>
              </label>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}