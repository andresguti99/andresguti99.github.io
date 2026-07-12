import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.ureppsa.com',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
});
