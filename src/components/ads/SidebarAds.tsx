// src/components/ads/SidebarAds.tsx
import { AdBanner } from './AdBanner';

export function SidebarAds() {
  return (
    <div className="flex flex-col gap-4">
      <AdBanner slot="rectangle" />
      <AdBanner slot="skyscraper" />
    </div>
  );
}
