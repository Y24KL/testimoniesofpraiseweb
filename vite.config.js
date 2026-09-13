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
      const filesToCopy = ['_redirects', 'render.yaml'];
      for (const f of filesToCopy) {
        const src = path.resolve(__dirname, f);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, path.join(outDir, f));
        }
      }

      // Generate SPA route fallback files for static hosts (Render, Netlify, GitHub Pages)
      const indexHtmlPath = path.join(outDir, 'index.html');
      if (fs.existsSync(indexHtmlPath)) {
        // 404.html fallback for static hosts
        fs.copyFileSync(indexHtmlPath, path.join(outDir, '404.html'));

        // Route fallback for /live and /live.html
        const liveDir = path.join(outDir, 'live');
        if (!fs.existsSync(liveDir)) fs.mkdirSync(liveDir, { recursive: true });
        fs.copyFileSync(indexHtmlPath, path.join(liveDir, 'index.html'));
        fs.copyFileSync(indexHtmlPath, path.join(outDir, 'live.html'));

        // Route fallback for /testifiers and /testimonies
        const testifiersDir = path.join(outDir, 'testifiers');
        if (!fs.existsSync(testifiersDir)) fs.mkdirSync(testifiersDir, { recursive: true });
        fs.copyFileSync(indexHtmlPath, path.join(testifiersDir, 'index.html'));
        fs.copyFileSync(indexHtmlPath, path.join(outDir, 'testifiers.html'));

        const testimoniesDir = path.join(outDir, 'testimonies');
        if (!fs.existsSync(testimoniesDir)) fs.mkdirSync(testimoniesDir, { recursive: true });
        fs.copyFileSync(indexHtmlPath, path.join(testimoniesDir, 'index.html'));
        fs.copyFileSync(indexHtmlPath, path.join(outDir, 'testimonies.html'));

        // Route fallback for /adotopoc
        const adotopocDir = path.join(outDir, 'adotopoc');
        if (!fs.existsSync(adotopocDir)) fs.mkdirSync(adotopocDir, { recursive: true });
        fs.copyFileSync(indexHtmlPath, path.join(adotopocDir, 'index.html'));
      }

      console.log('Successfully synced static assets and SPA route fallbacks into dist/');
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
