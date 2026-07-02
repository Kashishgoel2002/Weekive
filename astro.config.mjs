// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    // React 19 ships its JSX runtimes as CommonJS. Pre-bundling them (and
    // deduping React) ensures Vite's dev server exposes the `jsxDEV` /
    // `jsx` named exports to the browser. Without this, hydrated islands
    // throw "_jsxDEV is not a function" at runtime.
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
      ],
    },
  },

  integrations: [react()]
});
