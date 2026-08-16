import { defineConfig } from 'astro/config';
import path from 'path';

export default defineConfig({
  root: './app',
  srcDir: './src',
  outDir: './dist',
  server: {
    port: 4321,
  },
  vite: {
    resolve: {
      alias: {
        'wissive': path.resolve(import.meta.dirname, './src/index.ts'),
      },
    },
  },
});
