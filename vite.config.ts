import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Fix: Property 'cwd' does not exist on type 'Process'.
  // Using type assertion to any as process.cwd() is available in the Vite config (Node.js) environment.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    },
    server: {
      host: true,
      port: 5173,
    },
    build: {
      outDir: 'dist',
      minify: 'esbuild',
      sourcemap: false
    }
  };
});
