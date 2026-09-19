//apps/admin/src/app/(dashboard)/about/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

import type { About } from '@kobi/types';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/form/FormField';
import { FormSection } from '@/components/form/FormSection';
import { RepeaterField } from '@/components/form/RepeaterField';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import { MediaPickerDialog } from '@/components/media/MediaPickerDialog';

interface TimelineEntry {
  year: string;
  title: string;
  description?: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

export default function AboutAdminPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const [shortBio, setShortBio] = useState('');
  const [fullBio, setFullBio] = useState('');
  const [portraitImage, setPortraitImage] = useState('');
  const [literaryIdentity, setLiteraryIdentity] = useState('');
  const [achievements, setAchievements] = useState<string[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get<About>('/admin/about');
        setShortBio(res.shortBio || '');
        setFullBio(res.fullBio || '');
        setPortraitImage(res.portraitImage || '');
        setLiteraryIdentity(res.literaryIdentity || '');
        setAchievements(res.achievements || []);
        setTimeline(res.timeline || []);
        setContactEmail(res.contactEmail || '');
        setContactPhone(res.contactPhone || '');
        setSocialLinks(res.socialLinks || []);
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
      await apiClient.patch('/admin/about', {
        shortBio,
        fullBio,
        portraitImage: portraitImage || undefined,
        literaryIdentity,
        achievements,
        timeline,
        contactEmail,
        contactPhone,
        socialLinks,
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
            পরিচিতি সম্পাদনা
          </h1>
          <p className="text-xs text-[var(--color-admin-text-muted)] font-bangla">
            পাবলিক "পরিচিতি" পৃষ্ঠার তথ্য
          </p>
        </div>
        <Button onClick={save} disabled={submitting}>
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          সংরক্ষণ
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <FormSection title="পোর্ট্রেট ছবি" description="তিন-চতুর্থাংশ (4:5) রেশিও">
          {portraitImage ? (
            <div className="relative aspect-[4/5] rounded-md overflow-hidden border border-[var(--color-admin-border)]">
              <Image src={portraitImage} alt="Portrait" fill sizes="300px" className="object-cover" />
              <button
                onClick={() => setPortraitImage('')}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center"
                aria-label="সরান"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setPickerOpen(true)}
              className="w-full aspect-[4/5] rounded-md border-2 border-dashed border-[var(--color-admin-border)] hover:border-[var(--color-admin-accent)] flex flex-col items-center justify-center gap-2 text-[var(--color-admin-text-muted)] font-bangla text-sm transition-colors"
            >
              <Upload className="w-6 h-6" />
              ছবি নির্বাচন করুন
            </button>
          )}
          {portraitImage && (
            <Button variant="outline" size="sm" onClick={() => setPickerOpen(true)} className="w-full mt-3">
              পরিবর্তন করুন
            </Button>
          )}
        </FormSection>

        <div className="md:col-span-2 space-y-6">
          <FormSection title="সংক্ষিপ্ত পরিচিতি">
            <FormField label="Short Bio" hint="এক-দুই লাইনে পরিচয়">
              <Textarea
                value={shortBio}
                onChange={(e) => setShortBio(e.target.value)}
                rows={3}
                className="font-bangla"
                placeholder="যেমন: কবি ও গীতিকার..."
              />
            </FormField>

            <FormField label="সাহিত্যিক পরিচয়">
              <Input
                value={literaryIdentity}
                onChange={(e) => setLiteraryIdentity(e.target.value)}
                placeholder="যেমন: কবি, গীতিকার, প্রাবন্ধিক"
                className="font-bangla"
              />
            </FormField>
          </FormSection>

          <FormSection title="যোগাযোগ তথ্য">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField label="ইমেইল">
                <Input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </FormField>
              <FormField label="ফোন">
                <Input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </FormField>
            </div>
          </FormSection>
        </div>
      </div>

      <FormSection title="সম্পূর্ণ পরিচিতি">
        <RichTextEditor
          value={fullBio}
          onChange={setFullBio}
          placeholder="বিস্তারিত জীবনী লিখুন…"
        />
      </FormSection>

      <FormSection title="অর্জন ও সম্মাননা">
        <RepeaterField<string>
          items={achievements}
          onChange={setAchievements}
          newItem={() => ''}
          addLabel="অর্জন যোগ করুন"
          emptyLabel="এখনো কোনো অর্জন যোগ করা হয়নি"
          render={(item, idx, update) => (
            <Input
              value={item}
              onChange={(e) => update(e.target.value)}
              placeholder="যেমন: একুশে পদক ২০১৯"
              className="font-bangla"
            />
          )}
        />
      </FormSection>

      <FormSection title="জীবন-পথচলা">
        <RepeaterField<TimelineEntry>
          items={timeline}
          onChange={setTimeline}
          newItem={() => ({ year: '', title: '', description: '' })}
          addLabel="নতুন ঘটনা যোগ করুন"
          emptyLabel="টাইমলাইন খালি"
          render={(item, idx, update) => (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <Input
                  value={item.year}
                  onChange={(e) => update({ ...item, year: e.target.value })}
                  placeholder="২০১০"
                  className="col-span-1"
                />
                <Input
                  value={item.title}
                  onChange={(e) => update({ ...item, title: e.target.value })}
                  placeholder="ঘটনার শিরোনাম"
                  className="col-span-2 font-bangla"
                />
              </div>
              <Textarea
                value={item.description || ''}
                onChange={(e) => update({ ...item, description: e.target.value })}
                rows={2}
                placeholder="বিবরণ (ঐচ্ছিক)"
                className="font-bangla"
              />
            </div>
          )}
        />
      </FormSection>

      <FormSection title="সামাজিক মাধ্যম">
        <RepeaterField<SocialLink>
          items={socialLinks}
          onChange={setSocialLinks}
          newItem={() => ({ platform: 'facebook', url: '' })}
          addLabel="সামাজিক লিংক যোগ করুন"
          emptyLabel="কোনো লিংক নেই"
          render={(item, idx, update) => (
            <div className="grid grid-cols-3 gap-3">
              <select
                value={item.platform}
                onChange={(e) => update({ ...item, platform: e.target.value })}
                className="col-span-1 h-10 px-3 rounded-md border border-[var(--color-admin-border)] bg-white text-sm"
              >
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="twitter">Twitter</option>
                <option value="website">Website</option>
              </select>
              <Input
                value={item.url}
                onChange={(e) => update({ ...item, url: e.target.value })}
                placeholder="https://..."
                className="col-span-2"
              />
            </div>
          )}
        />
      </FormSection>

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={(url) => {
          setPortraitImage(url);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}