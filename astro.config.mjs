import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@tailwindcss/vite';
// https://astro.build/config
export default defineConfig({
  site: 'https://bragge.dev',

  integrations: [
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: {
        // Dual themes give perfect light/dark code blocks with zero extra work
        themes: {
          light: 'github-light',
          dark: 'github-dark',
        },
        wrap: true,
      },
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],

  vite: {
    plugins: [tailwind()],
  },
});
