import { defineConfig } from 'vite';
import { resolve } from 'path';

// Pasada 2 de 2 (ver vite.config.ts): solo el core, en UMD, para
// `<script>` plano vía CDN sin bundler. Un wrapper de React/Vue no tiene
// sentido ahí, por eso no incluye esos entries.
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Wissive',
      fileName: () => 'wissive.umd.js',
      formats: ['umd'],
    },
    rollupOptions: {
      external: ['cuelume'],
      output: {
        globals: { cuelume: 'Cuelume' },
        exports: 'named',
      },
    },
    sourcemap: true,
    emptyOutDir: false, // no borrar lo que dejó la pasada 1
  },
});
