//apps/web/src/app/kobita/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'কবিতা';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: { slug: string };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default async function OGImage({ params }: Props) {
  let title = 'কবিতা';
  let categoryName = '';

  try {
    const res = await fetch(
      `${API_URL}/api/v1/poems/${encodeURIComponent(params.slug)}`,
      { cache: 'no-store' },
    );
    const payload = await res.json();
    title = payload?.data?.title || title;
    categoryName = payload?.data?.category?.name || '';
  } catch {
    // fallback
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f3d2e 0%, #1a5540 100%)',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Top ornamental */}
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 80,
            right: 80,
            height: 1,
            background:
              'linear-gradient(90deg, transparent, #c9a961, transparent)',
          }}
        />

        {categoryName && (
          <div
            style={{
              fontSize: 24,
              color: '#c9a961',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: 30,
            }}
          >
            {categoryName}
          </div>
        )}

        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            color: '#fdfbf7',
            textAlign: 'center',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            maxWidth: 1000,
          }}
        >
          {title.length > 60 ? title.slice(0, 60) + '…' : title}
        </div>

        {/* Bottom ornamental */}
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <div style={{ width: 60, height: 1, background: '#c9a961' }} />
          <div style={{ color: '#c9a961', fontSize: 20 }}>◆</div>
          <div style={{ width: 60, height: 1, background: '#c9a961' }} />
        </div>
      </div>
    ),
    { ...size },
  );
}