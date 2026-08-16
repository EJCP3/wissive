import { defineConfig } from 'astro/config';
import path from 'path';

export default defineConfig({
  srcDir: './src',
  outDir: './dist',
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
