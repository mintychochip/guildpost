// src/components/ads/AdBanner.tsx
'use client';

import { useEffect, useRef } from 'react';

type AdSlot = 'leaderboard' | 'rectangle' | 'skyscraper' | 'footer';

interface AdBannerProps {
  slot: AdSlot;
  className?: string;
}

const SLOT_IDS: Record<AdSlot, string | undefined> = {
  leaderboard: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD,
  rectangle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE,
  skyscraper: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
  footer: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
};

const SIZES: Record<AdSlot, string> = {
  leaderboard: '728x90',
  rectangle: '300x250',
  skyscraper: '160x600',
  footer: '728x90',
};

export function AdBanner({ slot, className = '' }: AdBannerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) return;
    if (!SLOT_IDS[slot]) return;

    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, [slot]);

  if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) {
    return (
      <div
        className={`bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center ${className}`}
        style={{ minHeight: slot === 'skyscraper' ? '300px' : slot === 'rectangle' ? '250px' : '90px' }}
      >
        <span className="text-zinc-700 text-sm">Ad placement</span>
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          minHeight: slot === 'skyscraper' ? '300px' : slot === 'rectangle' ? '250px' : '90px',
        }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={SLOT_IDS[slot]}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
