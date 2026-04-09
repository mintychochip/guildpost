import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

export default defineConfig({
  integrations: [tailwind()],
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  // Deploying to root domain guildpost.tech
  build: {
    assets: 'assets',
  },
  vite: {
    build: {
      rollupOptions: {
        external: ['minecraft-server-util', 'stripe']
      }
    }
  }
});