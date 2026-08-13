import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Wissive',
      fileName: (format) => {
        if (format === 'es') return 'wissive.js';
        if (format === 'cjs') return 'wissive.cjs';
        if (format === 'umd') return 'wissive.umd.js';
        return `wissive.${format}.js`;
      },
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      external: ['cuelume'],
      output: {
        globals: {
          cuelume: 'Cuelume',
        },
      },
    },
    sourcemap: true,
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
});
