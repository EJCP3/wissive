import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import path from 'path';

export default defineConfig({
  srcDir: './src',
  outDir: './dist',
  integrations: [vue()],
  server: {
    port: 4321,
  },
  vite: {
    resolve: {
      alias: {
        'wissive': path.resolve(import.meta.dirname, '../../packages/wissive/src/index.ts'),
      },
    },
  },
});

