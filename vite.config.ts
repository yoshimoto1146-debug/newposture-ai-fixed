
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // ローカルの .env ファイルをロード
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Vercel上の実際の process.env を優先し、なければ .env ファイルから取得
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY || env.API_KEY || ''),
      'process.env.STORE_NAME': JSON.stringify(process.env.STORE_NAME || env.STORE_NAME || '')
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
