//apps/admin/src/app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock, Mail, AlertCircle } from 'lucide-react';

import { useAuth } from '@/components/providers/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, go home
  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('ইমেইল ও পাসওয়ার্ড দুটোই দিন');
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      setError(err?.message || 'লগইন করা যায়নি');
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-admin-primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' stroke='%230f3d2e' stroke-width='1'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3Cpath d='M30 10l20 20-20 20-20-20z'/%3E%3Ccircle cx='30' cy='30' r='6'/%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-[var(--color-admin-surface)] rounded-lg border border-[var(--color-admin-border)] shadow-xl overflow-hidden">
          {/* Top ornament */}
          <div className="h-1.5 bg-gradient-to-r from-[var(--color-admin-primary)] via-[var(--color-admin-accent)] to-[var(--color-admin-primary)]" />

          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border-2 border-[var(--color-admin-accent)] mb-5">
                <Lock className="w-6 h-6 text-[var(--color-admin-primary)]" />
              </div>
              <h1 className="text-2xl font-semibold text-[var(--color-admin-primary)] font-bangla mb-2">
                অ্যাডমিন প্রবেশ
              </h1>
              <p className="text-sm text-[var(--color-admin-text-muted)] font-bangla">
                শুধুমাত্র অনুমোদিত ব্যবহারকারীর জন্য
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="block text-xs uppercase tracking-wider text-[var(--color-admin-text-muted)] font-medium mb-2">
                  ইমেইল
                </span>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-admin-text-subtle)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    autoFocus
                    disabled={submitting}
                    className="w-full h-11 pl-10 pr-4 rounded-md border border-[var(--color-admin-border)] bg-white text-sm focus:border-[var(--color-admin-accent)] focus:outline-none transition-colors disabled:opacity-60"
                    placeholder="admin@example.com"
                  />
                </div>
              </label>

              <label className="block">
                <span className="block text-xs uppercase tracking-wider text-[var(--color-admin-text-muted)] font-medium mb-2">
                  পাসওয়ার্ড
                </span>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-admin-text-subtle)]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    disabled={submitting}
                    className="w-full h-11 pl-10 pr-4 rounded-md border border-[var(--color-admin-border)] bg-white text-sm focus:border-[var(--color-admin-accent)] focus:outline-none transition-colors disabled:opacity-60"
                    placeholder="••••••••"
                  />
                </div>
              </label>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="font-bangla">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-md bg-[var(--color-admin-primary)] text-white font-medium text-sm hover:bg-[var(--color-admin-primary-hover)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    প্রবেশ করা হচ্ছে…
                  </>
                ) : (
                  'প্রবেশ করুন'
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-[var(--color-admin-text-subtle)]">
              © {new Date().getFullYear()} — শুধুমাত্র লেখক ব্যবহারের জন্য
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}