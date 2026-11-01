import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          berita: path.resolve(__dirname, 'berita.html'),
          artikelDetail: path.resolve(__dirname, 'artikel-detail.html'),
          daftar: path.resolve(__dirname, 'daftar.html'),
          absen: path.resolve(__dirname, 'absen.html'),
          proker: path.resolve(__dirname, 'proker.html'),
          login: path.resolve(__dirname, 'login.html'),
          adminRoot: path.resolve(__dirname, 'admin.html'),
          adminIndex: path.resolve(__dirname, 'admin/index.html'),
          adminLogin: path.resolve(__dirname, 'admin/login.html'),
          adminDashboard: path.resolve(__dirname, 'admin/dashboard.html'),
          adminKelolaBerita: path.resolve(__dirname, 'admin/kelola-berita.html'),
          adminTulisArtikel: path.resolve(__dirname, 'admin/tulis-artikel.html'),
          adminKelolaAbsen: path.resolve(__dirname, 'admin/kelola-absen.html'),
          adminKelolaAnggota: path.resolve(__dirname, 'admin/kelola-anggota.html'),
          adminKelolaProker: path.resolve(__dirname, 'admin/kelola-proker.html'),
        },
      },
    },
  };
});
