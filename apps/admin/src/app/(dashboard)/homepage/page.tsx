// apps/admin/src/app/(dashboard)/homepage/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save, Upload, X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

import type { Homepage, Poem, Lyric } from '@kobi/types';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/form/FormField';
import { FormSection } from '@/components/form/FormSection';
import { MediaPickerDialog } from '@/components/media/MediaPickerDialog';

interface HeroSlide {
  image: string;
  title?: string;
  subtitle?: string;
  quote?: string;
}

export default function HomepageAdminPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [welcomeQuote, setWelcomeQuote] = useState('');
  const [featuredPoemId, setFeaturedPoemId] = useState('');
  const [featuredLyricId, setFeaturedLyricId] = useState('');

  const [poems, setPoems] = useState<Poem[]>([]);
  const [lyrics, setLyrics] = useState<Lyric[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [homepage, poemsRes, lyricsRes] = await Promise.all([
          apiClient.get<any>('/admin/homepage'),
          apiClient.get<any>('/admin/poems?limit=100&status=published'),
          apiClient.get<any>('/admin/lyrics?limit=100&status=published'),
        ]);
        setHeroSlides(homepage.heroSlides || []);
        setWelcomeQuote(homepage.welcomeQuote || '');
        setFeaturedPoemId(homepage.featuredPoemId?._id || homepage.featuredPoemId || '');
        setFeaturedLyricId(homepage.featuredLyricId?._id || homepage.featuredLyricId || '');
        setPoems(poemsRes.data || []);
        setLyrics(lyricsRes.data || []);
      } catch (err: any) {
        toast.error(err?.message || 'লোড ব্যর্থ');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    setSubmitting(true);
    try {
      await apiClient.patch('/admin/homepage', {
        heroSlides,
        welcomeQuote,
        featuredPoemId: featuredPoemId || undefined,
        featuredLyricId: featuredLyricId || undefined,
      });
      toast.success('সংরক্ষিত হয়েছে');
    } catch (err: any) {
      toast.error(err?.message || 'ব্যর্থ');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bangla text-xl font-semibold text-[var(--color-admin-primary)]">
            হোমপেজ সম্পাদনা
          </h1>
          <p className="text-xs text-[var(--color-admin-text-muted)] font-bangla">
            হিরো স্লাইড, নির্বাচিত কবিতা ও লিরিক, স্বাগত বার্তা
          </p>
        </div>
        <Button onClick={save} disabled={submitting}>
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          সংরক্ষণ
        </Button>
      </div>

      <FormSection
        title="হিরো স্লাইড"
        description="সর্বোচ্চ ৬টি স্লাইড। প্রথমটি সবচেয়ে গুরুত্বপূর্ণ।"
      >
        {heroSlides.length === 0 && (
          <p className="text-sm text-[var(--color-admin-text-subtle)] font-bangla text-center py-4">
            এখনো কোনো স্লাইড নেই
          </p>
        )}

        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className="border border-[var(--color-admin-border)] rounded-md p-4 space-y-4 bg-[var(--color-admin-bg)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-medium text-[var(--color-admin-text-muted)]">
                স্লাইড {idx + 1}
              </span>
              <button
                onClick={() => setHeroSlides(heroSlides.filter((_, i) => i !== idx))}
                className="w-8 h-8 rounded-md text-red-500 hover:bg-red-50 flex items-center justify-center"
                aria-label="মুছুন"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {slide.image ? (
              <div className="relative aspect-video rounded-md overflow-hidden border">
                <Image src={slide.image} alt="Slide" fill sizes="600px" className="object-cover" />
                <button
                  onClick={() => {
                    const next = [...heroSlides];
                    next[idx] = { ...slide, image: '' };
                    setHeroSlides(next);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center"
                  aria-label="সরান"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setPickerIndex(idx)}
                className="w-full aspect-video rounded-md border-2 border-dashed border-[var(--color-admin-border)] hover:border-[var(--color-admin-accent)] flex flex-col items-center justify-center gap-2 text-[var(--color-admin-text-muted)] font-bangla text-sm"
              >
                <Upload className="w-6 h-6" />
                ছবি নির্বাচন করুন
              </button>
            )}

            <div className="grid grid-cols-2 gap-3">
              <FormField label="শিরোনাম">
                <Input
                  value={slide.title || ''}
                  onChange={(e) => {
                    const next = [...heroSlides];
                    next[idx] = { ...slide, title: e.target.value };
                    setHeroSlides(next);
                  }}
                  className="font-bangla"
                />
              </FormField>
              <FormField label="সাবটাইটেল">
                <Input
                  value={slide.subtitle || ''}
                  onChange={(e) => {
                    const next = [...heroSlides];
                    next[idx] = { ...slide, subtitle: e.target.value };
                    setHeroSlides(next);
                  }}
                  className="font-bangla"
                />
              </FormField>
            </div>

            <FormField label="উদ্ধৃতি (Quote)">
              <Textarea
                value={slide.quote || ''}
                onChange={(e) => {
                  const next = [...heroSlides];
                  next[idx] = { ...slide, quote: e.target.value };
                  setHeroSlides(next);
                }}
                rows={2}
                className="font-bangla"
              />
            </FormField>
          </div>
        ))}

        {heroSlides.length < 6 && (
          <Button
            variant="outline"
            onClick={() => setHeroSlides([...heroSlides, { image: '' }])}
          >
            <Plus className="w-4 h-4" />
            স্লাইড যোগ করুন
          </Button>
        )}
      </FormSection>

      <FormSection title="স্বাগত বার্তা" description="পরিচিতি সেকশনে দেখানো হবে">
        <Textarea
          value={welcomeQuote}
          onChange={(e) => setWelcomeQuote(e.target.value)}
          rows={3}
          className="font-bangla"
          placeholder="যেমন: শব্দেরা হয়ে উঠুক আলো"
        />
      </FormSection>

      <div className="grid md:grid-cols-2 gap-6">
        <FormSection title="নির্বাচিত কবিতা (Featured)">
          <FormField label="কবিতা নির্বাচন করুন" hint="শুধু প্রকাশিত কবিতা দেখানো হচ্ছে">
            <select
              value={featuredPoemId}
              onChange={(e) => setFeaturedPoemId(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-[var(--color-admin-border)] bg-white text-sm font-bangla"
            >
              <option value="">— কোনোটি না —</option>
              {poems.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>
          </FormField>
        </FormSection>

        <FormSection title="নির্বাচিত লিরিক (Featured)">
          <FormField label="লিরিক নির্বাচন করুন" hint="শুধু প্রকাশিত লিরিক দেখানো হচ্ছে">
            <select
              value={featuredLyricId}
              onChange={(e) => setFeaturedLyricId(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-[var(--color-admin-border)] bg-white text-sm font-bangla"
            >
              <option value="">— কোনোটি না —</option>
              {lyrics.map((l) => (
                <option key={l._id} value={l._id}>
                  {l.title}
                </option>
              ))}
            </select>
          </FormField>
        </FormSection>
      </div>

      <MediaPickerDialog
        open={pickerIndex !== null}
        onOpenChange={(o) => !o && setPickerIndex(null)}
        onSelect={(url) => {
          if (pickerIndex === null) return;
          const next = [...heroSlides];
          next[pickerIndex] = { ...next[pickerIndex], image: url };
          setHeroSlides(next);
          setPickerIndex(null);
        }}
      />
    </div>
  );
}