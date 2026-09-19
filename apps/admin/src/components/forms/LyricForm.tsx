// apps/admin/src/components/forms/LyricForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Save, Eye, Upload, X, Loader2, ArrowLeft} from 'lucide-react';
import Image from 'next/image';
import {FaYoutube as Youtube} from 'react-icons/fa';

import type { Category, Lyric } from '@kobi/types';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import { getYouTubeThumbnail } from '@kobi/utils';

const schema = z.object({
  title: z.string().min(1, 'শিরোনাম দিন').max(300),
  slug: z.string().max(300).optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, 'লিরিকের কনটেন্ট দিন'),
  youtubeUrl: z.string().optional(),
  category: z.string().min(1, 'বিভাগ নির্বাচন করুন'),
  tags: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean(),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  initial?: Lyric;
  categories: Category[];
}

export function LyricForm({ initial, categories }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [generatingPreview, setGeneratingPreview] = useState(false);
  const isEdit = !!initial;

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? '',
      slug: initial?.slug ?? '',
      excerpt: initial?.excerpt ?? '',
      content: initial?.content ?? '',
      youtubeUrl: initial?.youtubeUrl ?? '',
      category: (initial as any)?.category?._id ?? '',
      tags: initial?.tags?.join(', ') ?? '',
      status: initial?.status ?? 'draft',
      featured: initial?.featured ?? false,
      seoTitle: initial?.seoTitle ?? '',
      seoDescription: initial?.seoDescription ?? '',
    },
  });

  const youtubeUrl = watch('youtubeUrl');
  const youtubeId = youtubeUrl
    ? youtubeUrl.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      )?.[1]
    : null;

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        tags: data.tags
          ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        slug: data.slug || undefined,
        excerpt: data.excerpt || undefined,
        youtubeUrl: data.youtubeUrl || undefined,
      };

      if (isEdit) {
        await apiClient.patch(`/admin/lyrics/${initial!._id}`, payload);
        toast.success('লিরিক আপডেট হয়েছে');
      } else {
        await apiClient.post('/admin/lyrics', payload);
        toast.success('লিরিক তৈরি হয়েছে');
      }
      router.push('/lyrics');
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
      const res = await apiClient.post<{ token: string }>(
        `/admin/lyrics/${initial!._id}/preview-token`,
      );
      window.open(
        `${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/preview/${res.token}`,
        '_blank',
      );
    } catch (err: any) {
      toast.error(err?.message || 'প্রিভিউ ব্যর্থ');
    } finally {
      setGeneratingPreview(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.push('/lyrics')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="font-bangla text-xl font-semibold text-[var(--color-admin-primary)]">
              {isEdit ? 'লিরিক সম্পাদনা' : 'নতুন লিরিক'}
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

      <FormSection title="লিরিকের মূল অংশ">
        <FormField label="শিরোনাম" required error={errors.title?.message}>
          <Input
            {...control.register('title')}
            placeholder="যেমন: মায়ের দুআ"
            className="font-bangla text-base"
          />
        </FormField>

        <FormField label="Slug (ঐচ্ছিক)" error={errors.slug?.message}>
          <Input {...control.register('slug')} placeholder="mayer-dua" />
        </FormField>

        <FormField
          label="সংক্ষিপ্ত অংশ"
          error={errors.excerpt?.message}
        >
          <Textarea
            {...control.register('excerpt')}
            rows={2}
            placeholder="লিরিকের সারমর্ম বা প্রথম লাইন…"
            className="font-bangla"
          />
        </FormField>

        <FormField
          label="YouTube ভিডিও URL (ঐচ্ছিক)"
          hint="যেমন: https://youtu.be/dQw4w9WgXcQ — পাঠকেরা লিরিক পড়ার আগে ভিডিও দেখতে পারবেন"
        >
          <div className="space-y-3">
            <div className="relative">
              <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
              <Input
                {...control.register('youtubeUrl')}
                placeholder="https://youtube.com/watch?v=..."
                className="pl-10"
              />
            </div>
            {youtubeId && (
              <div className="relative aspect-video max-w-xs rounded-md overflow-hidden border border-[var(--color-admin-border)]">
                <Image
                  src={getYouTubeThumbnail(youtubeId, 'hq')}
                  alt="YouTube preview"
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </FormField>

        <FormField
          label="সম্পূর্ণ লিরিক"
          required
          error={errors.content?.message}
        >
          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="লিরিকের কথা লিখুন…"
              />
            )}
          />
        </FormField>
      </FormSection>

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

          <FormField label="বিভাগ" required error={errors.category?.message}>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="বিভাগ নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
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
                Featured হিসেবে দেখান
              </span>
            </div>
          </FormField>

          <FormField label="ট্যাগ">
            <Input {...control.register('tags')} className="font-bangla" />
          </FormField>
        </FormSection>

        <FormSection title="SEO">
          <FormField label="SEO শিরোনাম">
            <Input {...control.register('seoTitle')} />
          </FormField>
          <FormField label="SEO বিবরণ">
            <Textarea {...control.register('seoDescription')} rows={3} />
          </FormField>
        </FormSection>
      </div>
    </form>
  );
}