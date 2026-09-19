//apps/web/src/components/contact/ContactForm.tsx
'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@kobi/ui';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  website: string; // honeypot
}

const initial: FormState = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  website: '',
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof FormState, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side checks
    if (!form.name.trim() || form.name.trim().length < 2) {
      setError('দয়া করে আপনার নাম দিন (অন্তত ২ অক্ষর)');
      return;
    }
    if (!form.email.includes('@')) {
      setError('সঠিক ইমেইল ঠিকানা দিন');
      return;
    }
    if (!form.subject.trim() || form.subject.trim().length < 2) {
      setError('বিষয় লিখুন');
      return;
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      setError('বার্তা অন্তত ১০ অক্ষরের হতে হবে');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          payload?.message ||
          'বার্তা পাঠানো যায়নি। আবার চেষ্টা করুন।';
        throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
      }

      setSuccess(true);
      setForm(initial);
    } catch (err: any) {
      setError(err.message || 'কিছু ভুল হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="w-14 h-14 text-[var(--color-green-deep)] mx-auto mb-5" />
        <h3 className="font-bangla text-xl font-semibold text-[var(--color-green-deep)] mb-2">
          জাযাকাল্লাহু খাইরান
        </h3>
        <p className="text-[var(--color-ink-600)] font-bangla mb-6">
          আপনার বার্তা পাঠানো হয়েছে। ইনশাআল্লাহ, যত দ্রুত সম্ভব উত্তর দেব।
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="text-sm text-[var(--color-green-deep)] border-b border-current pb-0.5"
        >
          আরেকটি বার্তা পাঠান
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Honeypot — hidden */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={form.website}
        onChange={(e) => update('website', e.target.value)}
        className="absolute opacity-0 pointer-events-none h-0 w-0"
        aria-hidden="true"
      />

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="নাম *">
          <input
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            required
            maxLength={120}
            className={inputClass}
            placeholder="আপনার নাম"
          />
        </Field>
        <Field label="ইমেইল *">
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            required
            maxLength={200}
            className={inputClass}
            placeholder="you@example.com"
          />
        </Field>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="ফোন (ঐচ্ছিক)">
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            maxLength={30}
            className={inputClass}
            placeholder="+৮৮০ ১XXX XXXXXX"
          />
        </Field>
        <Field label="বিষয় *">
          <input
            type="text"
            value={form.subject}
            onChange={(e) => update('subject', e.target.value)}
            required
            maxLength={200}
            className={inputClass}
            placeholder="কী নিয়ে কথা বলতে চান"
          />
        </Field>
      </div>

      <Field label="বার্তা *">
        <textarea
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          required
          maxLength={5000}
          rows={6}
          className={`${inputClass} resize-y min-h-[120px]`}
          placeholder="আপনার বার্তা লিখুন..."
        />
      </Field>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="font-bangla">{error}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={submitting}
        size="lg"
        className="w-full md:w-auto"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            পাঠানো হচ্ছে…
          </>
        ) : (
          'বার্তা পাঠান'
        )}
      </Button>

      <p className="text-xs text-[var(--color-ink-400)] font-bangla">
        * চিহ্নিত ঘরগুলো পূরণ করা আবশ্যক। আপনার তথ্য গোপন রাখা হবে।
      </p>
    </form>
  );
}

const inputClass =
  'w-full h-11 px-4 rounded-md border border-[var(--color-border)] bg-[var(--color-cream-50)] text-[var(--color-ink-800)] placeholder:text-[var(--color-ink-400)] font-bangla text-sm focus:border-[var(--color-gold-400)] focus:outline-none transition-colors';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-[var(--color-ink-500)] font-medium mb-2 font-bangla">
        {label}
      </span>
      {children}
    </label>
  );
}