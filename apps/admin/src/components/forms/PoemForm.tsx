//apps/admin/src/components/forms/PoemForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Save, Eye, Upload, X, Loader2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

import type { Category, Poem } from '@kobi/types';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField } from '@/components/form/FormField';
import { FormSection } from '@/components/form/FormSection';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import { MediaPickerDialog } from '@/components/media/MediaPickerDialog';

const schema = z.object({
  title: z.string().min(1, 'শিরোনাম দিন').max(300),
  slug: z.string().max(300).optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, 'কবিতার কনটেন্ট দিন'),
  coverImage: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(), // comma-separated
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean(),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  initial?: Poem;
  categories: Category[];
}

export function PoemForm({ initial, categories }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [generatingPreview, setGeneratingPreview] = useState(false);
  const isEdit = !!initial;

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? '',
      slug: initial?.slug ?? '',
      excerpt: initial?.excerpt ?? '',
      content: initial?.content ?? '',
      coverImage: initial?.coverImage ?? '',
      category: (initial as any)?.category?._id ?? '',
      tags: initial?.tags?.join(', ') ?? '',
      status: initial?.status ?? 'draft',
      featured: initial?.featured ?? false,
      seoTitle: initial?.seoTitle ?? '',
      seoDescription: initial?.seoDescription ?? '',
    },
  });

  const coverImage = watch('coverImage');
  const status = watch('status');

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        tags: data.tags
          ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        category: data.category || undefined,
        slug: data.slug || undefined,
        excerpt: data.excerpt || undefined,
        coverImage: data.coverImage || undefined,
      };

      if (isEdit) {
        await apiClient.patch(`/admin/poems/${initial!._id}`, payload);
        toast.success('কবিতা আপডেট হয়েছে');
      } else {
        await apiClient.post('/admin/poems', payload);
        toast.success('কবিতা তৈরি হয়েছে');
      }
      router.push('/poems');
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || 'সংরক্ষণ করা যায়নি');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePreview = async () => {
    if (!isEdit) {
      toast.info('প্রথমে সংরক্ষণ করুন');
      return;
    }
    setGeneratingPreview(true);
    try {
      const res = await apiClient.post<{ token: string; expiresAt: string }>(
        `/admin/poems/${initial!._id}/preview-token`,
      );
      const previewUrl = `${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/preview/${res.token}`;
      window.open(previewUrl, '_blank', 'noopener,noreferrer');
      toast.success('প্রিভিউ নতুন ট্যাবে খোলা হয়েছে');
    } catch (err: any) {
      toast.error(err?.message || 'প্রিভিউ তৈরি করা যায়নি');
    } finally {
      setGeneratingPreview(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.push('/poems')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="font-bangla text-xl font-semibold text-[var(--color-admin-primary)]">
              {isEdit ? 'কবিতা সম্পাদনা' : 'নতুন কবিতা'}
            </h1>
            {isEdit && (
              <p className="text-xs text-[var(--color-admin-text-muted)] font-bangla">
                /{initial!.slug}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEdit && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePreview}
              disabled={generatingPreview}
            >
              {generatingPreview ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              প্রিভিউ
            </Button>
          )}
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            সংরক্ষণ
          </Button>
        </div>
      </div>

      {/* Main content */}
      <FormSection title="কবিতার মূল অংশ">
        <FormField label="শিরোনাম" required error={errors.title?.message}>
          <Input
            {...control.register('title')}
            placeholder="যেমন: বৃষ্টির দিনে"
            className="font-bangla text-base"
          />
        </FormField>

        <FormField
          label="Slug (ঐচ্ছিক)"
          hint="খালি রাখলে শিরোনাম থেকে অটো তৈরি হবে"
          error={errors.slug?.message}
        >
          <Input
            {...control.register('slug')}
            placeholder="brishtir-dine"
            className="font-english"
          />
        </FormField>

        <FormField
          label="সংক্ষিপ্ত অংশ (Excerpt)"
          hint="তালিকায় ও SEO-তে দেখানোর জন্য (সর্বোচ্চ ৫০০ অক্ষর)"
          error={errors.excerpt?.message}
        >
          <Textarea
            {...control.register('excerpt')}
            rows={2}
            placeholder="কবিতার সারমর্ম বা প্রথম কয়েক লাইন…"
            className="font-bangla"
          />
        </FormField>

        <FormField
          label="সম্পূর্ণ কবিতা"
          required
          error={errors.content?.message}
          hint="নিচে লিখুন বা পেস্ট করুন। এন্টার চাপলে প্যারাগ্রাফ হবে।"
        >
          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="এখানে আপনার কবিতা লিখুন…"
              />
            )}
          />
        </FormField>
      </FormSection>

      {/* Sidebar-ish sections in 2 columns */}
      <div className="grid md:grid-cols-2 gap-6">
        <FormSection title="প্রকাশনা">
          <FormField label="Status">
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">ড্রাফট</SelectItem>
                    <SelectItem value="published">প্রকাশিত</SelectItem>
                    <SelectItem value="archived">আর্কাইভড</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          <FormField label="নির্বাচিত (Featured)">
            <div className="flex items-center gap-3 pt-1">
              <Controller
                control={control}
                name="featured"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <span className="text-sm text-[var(--color-admin-text-muted)] font-bangla">
                হোমপেজে Featured হিসেবে দেখান
              </span>
            </div>
          </FormField>

          <FormField label="বিভাগ (Category)">
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select
                  value={field.value || 'none'}
                  onValueChange={(v) =>
                    field.onChange(v === 'none' ? '' : v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="বিভাগ নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">কোনো বিভাগ নেই</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          <FormField
            label="ট্যাগ"
            hint="কমা (,) দিয়ে আলাদা করুন — যেমন: বৃষ্টি, প্রকৃতি, প্রেম"
          >
            <Input
              {...control.register('tags')}
              placeholder="বৃষ্টি, প্রকৃতি"
              className="font-bangla"
            />
          </FormField>
        </FormSection>

        <FormSection title="কভার ও SEO">
          <FormField label="কভার ছবি">
            {coverImage ? (
              <div className="relative aspect-video rounded-md overflow-hidden bg-[var(--color-admin-bg)] border border-[var(--color-admin-border)]">
                <Image
                  src={coverImage}
                  alt="cover"
                  fill
                  sizes="400px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setValue('coverImage', '')}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                  aria-label="ছবি সরান"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setMediaPickerOpen(true)}
                className="w-full aspect-video rounded-md border-2 border-dashed border-[var(--color-admin-border)] hover:border-[var(--color-admin-accent)] transition-colors flex flex-col items-center justify-center gap-2 text-[var(--color-admin-text-muted)] font-bangla text-sm"
              >
                <Upload className="w-6 h-6" />
                ছবি নির্বাচন করুন
              </button>
            )}
          </FormField>

          <FormField label="SEO শিরোনাম" hint="খালি রাখলে শিরোনাম ব্যবহার হবে">
            <Input {...control.register('seoTitle')} />
          </FormField>

          <FormField label="SEO বিবরণ">
            <Textarea
              {...control.register('seoDescription')}
              rows={3}
            />
          </FormField>
        </FormSection>
      </div>

      {/* Media Picker */}
      <MediaPickerDialog
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={(url) => {
          setValue('coverImage', url, { shouldDirty: true });
          setMediaPickerOpen(false);
        }}
      />
    </form>
  );
}