import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Server Detail Page - Open Graph Meta Tags', () => {
  const serverPagePath = path.join(process.cwd(), 'src', 'pages', 'servers', '[id].astro');
  
  it('should pass image prop to Layout component for OG tags', () => {
    const content = fs.readFileSync(serverPagePath, 'utf-8');
    
    // Check that the Layout component includes the image prop
    expect(content).toContain('image={server.banner || server.icon');
  });
  
  it('should fallback to default OG image when no banner or icon', () => {
    const content = fs.readFileSync(serverPagePath, 'utf-8');
    
    // Verify fallback to default guildpost OG image
    expect(content).toContain("|| 'https://guildpost.tech/og-image-new.png'");
  });
  
  it('should prioritize banner over icon for OG image', () => {
    const content = fs.readFileSync(serverPagePath, 'utf-8');
    
    // Banner should come before icon in the fallback chain
    const imagePropMatch = content.match(/image=\{server\.banner \|\| server\.icon/);
    expect(imagePropMatch).toBeTruthy();
  });
});
