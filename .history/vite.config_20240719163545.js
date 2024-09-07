import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  esbuild: {
    jsxInject: `import { h } from 'preact'`,
    loader: {
      '.js': 'jsx',
      '.jsx': 'jsx',
    },
  },
});
