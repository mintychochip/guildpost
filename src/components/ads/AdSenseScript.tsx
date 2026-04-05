// src/components/ads/AdSenseScript.tsx
'use client';

import { useEffect } from 'react';

export function AdSenseScript() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }, []);

  return null;
}
