import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copyStaticAssetsPlugin() {
  return {
    name: 'copy-static-assets-plugin',
    closeBundle() {
      const outDir = path.resolve(__dirname, 'dist');
      const dirsToCopy = ['admin', 'data', 'images', 'videos'];
      for (const dir of dirsToCopy) {
        copyDirSync(path.resolve(__dirname, dir), path.join(outDir, dir));
      }
      const filesToCopy = ['_redirects'];
      for (const f of filesToCopy) {
        const src = path.resolve(__dirname, f);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, path.join(outDir, f));
        }
      }
      console.log('Successfully synced static assets into dist/');
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    copyStaticAssetsPlugin()
  ],
  server: {
    port: 3000
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'gsap-vendor': ['gsap', 'lenis'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'icons-vendor': ['lucide-react'],
        }
      }
    }
  }
});
