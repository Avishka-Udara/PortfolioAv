// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://avishkaudara.vercel.app', // Will be your Vercel domain
  // base: '/Portfolio', // Not needed for Vercel (uses root domain)
  vite: {
    plugins: [tailwindcss()]
  }
});