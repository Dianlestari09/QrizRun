// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    includeFiles: [
      './node_modules/tesseract.js/**/*',
      './node_modules/tesseract.js-core/**/*'
    ]
  }),
  vite: {
    ssr: {
      external: ['tesseract.js']
    }
  }
});
