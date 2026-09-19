// apps/admin/src/app/(dashboard)/settings/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save, Plus } from 'lucide-react';
import { toast } from 'sonner';

import type { SiteSettings } from '@kobi/types';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/form/FormField';
import { FormSection } from '@/components/form/FormSection';
import { RepeaterField } from '@/components/form/RepeaterField';

interface SocialLink {
  platform: string;
  url: string;
}

export default function SettingsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [siteName, setSiteName] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [metaKeywords, setMetaKeywords] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get<SiteSettings>('/admin/settings');
        setSiteName(res.siteName || '');
        setSiteDescription(res.siteDescription || '');
        setContactEmail(res.contactEmail || '');
        setContactPhone(res.contactPhone || '');
        setSocialLinks(res.socialLinks || []);
        setMetaKeywords((res.metaKeywords || []).join(', '));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    setSubmitting(true);
    try {
      await apiClient.patch('/admin/settings', {
        siteName,
        siteDescription,
        contactEmail,
        contactPhone,
        socialLinks,
        metaKeywords: metaKeywords
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean),
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
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bangla text-xl font-semibold text-[var(--color-admin-primary)]">
          সাইট সেটিংস
        </h1>
        <Button onClick={save} disabled={submitting}>
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          সংরক্ষণ
        </Button>
      </div>

      <FormSection title="মূল তথ্য">
        <FormField label="সাইটের নাম">
          <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="font-bangla" />
        </FormField>
        <FormField label="সাইটের বিবরণ">
          <Textarea
            value={siteDescription}
            onChange={(e) => setSiteDescription(e.target.value)}
            rows={3}
            className="font-bangla"
          />
        </FormField>
      </FormSection>

      <FormSection title="যোগাযোগ">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField label="যোগাযোগের ইমেইল">
            <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          </FormField>
          <FormField label="যোগাযোগের ফোন">
            <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
          </FormField>
        </div>
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

      <FormSection title="SEO" description="কমা দিয়ে আলাদা করা কীওয়ার্ড">
        <FormField label="মেটা কীওয়ার্ড">
          <Input
            value={metaKeywords}
            onChange={(e) => setMetaKeywords(e.target.value)}
            placeholder="বাংলা কবিতা, গজল, হামদ"
            className="font-bangla"
          />
        </FormField>
      </FormSection>
    </div>
  );
}