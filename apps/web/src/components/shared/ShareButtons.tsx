//apps/web/src/components/shared/ShareButtons.tsx
'use client';

import { useState } from 'react';
import { Link2, Check } from 'lucide-react';
import { FaFacebookF, FaWhatsapp, FaXTwitter } from 'react-icons/fa6';
import { siteConfig } from '@/config/site';

interface Props {
  url: string;
  title: string;
  className?: string;
}

export function ShareButtons({ url, title, className }: Props) {
  const [copied, setCopied] = useState(false);
  const fullUrl = url.startsWith('http') ? url : `${siteConfig.url}${url}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const links = [
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      icon: FaFacebookF,
    },
    {
      name: 'Twitter',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
      icon: FaXTwitter,
    },
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(`${title}\n${fullUrl}`)}`,
      icon: FaWhatsapp ,
    },
  ];

  return (
    <div className={className}>
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-ink-400)] font-medium mb-3">
        শেয়ার করুন
      </p>
      <div className="flex items-center gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--color-border)] text-[var(--color-ink-500)] hover:border-[var(--color-gold-400)] hover:text-[var(--color-green-deep)] transition-colors"
              aria-label={`${link.name}-এ শেয়ার`}
            >
              <Icon className="w-4 h-4" />
            </a>
          );
        })}
        <button
          onClick={handleCopy}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--color-border)] text-[var(--color-ink-500)] hover:border-[var(--color-gold-400)] hover:text-[var(--color-green-deep)] transition-colors"
          aria-label="লিংক কপি"
        >
          {copied ? (
            <Check className="w-4 h-4 text-[var(--color-green-deep)]" />
          ) : (
            <Link2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}