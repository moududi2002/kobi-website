//apps/web/src/components/shared/YouTubeEmbed.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { getYouTubeThumbnail, getYouTubeEmbedUrl } from '@kobi/utils';

interface Props {
  videoId: string;
  title: string;
  className?: string;
}

export function YouTubeEmbed({ videoId, title, className }: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={className}>
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black shadow-[var(--shadow-elevated)]">
        {playing ? (
          <iframe
            src={`${getYouTubeEmbedUrl(videoId)}&autoplay=1`}
            title={title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 w-full h-full"
            aria-label={`${title} — ভিডিও চালান`}
          >
            <Image
              src={getYouTubeThumbnail(videoId, 'max')}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                // Fallback to hq thumbnail
                const img = e.currentTarget as HTMLImageElement;
                img.src = getYouTubeThumbnail(videoId, 'hq');
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-[var(--color-cream-50)]/95 flex items-center justify-center shadow-[var(--shadow-elevated)] transition-transform duration-300 group-hover:scale-110">
                <Play className="w-8 h-8 text-[var(--color-green-deep)] fill-[var(--color-green-deep)] ml-1" />
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}