import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// Pasada 1 de 2 (`pnpm run build`): multi-entry (index + react + vue) en
// ES/CJS — Rollup extrae un chunk compartido entre las tres, así
// `sharedLoop`/`soundEngine` siguen siendo singletons únicos aunque alguien
// importe 'wissive' y 'wissive/react' en la misma app.
// La pasada 2 (UMD del core, para CDN sin bundler) vive en
// vite.umd.config.ts — UMD no soporta multi-entry, así que no puede ser el
// mismo build.
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        react: resolve(__dirname, 'src/react.tsx'),
        vue: resolve(__dirname, 'src/vue.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const base = entryName === 'index' ? 'wissive' : entryName;
        return format === 'es' ? `${base}.js` : `${base}.cjs`;
      },
    },
    rollupOptions: {
      external: ['cuelume', 'react', 'react/jsx-runtime', 'vue'],
      output: {
        exports: 'named',
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
