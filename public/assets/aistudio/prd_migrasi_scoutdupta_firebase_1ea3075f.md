# Product Requirements Document (PRD)

**Proyek:** Migrasi ScoutDupta (Pramuka SMAN 20 Kab. Tangerang) ke Firebase
**Dokumen Status:** Draft / Perencanaan Awal
**Platform:** Multi-Page Web Application (Mobile First) & Isolated Admin Panel

## 1. Ringkasan Eksekutif (Executive Summary)
ScoutDupta adalah sistem informasi dan manajemen digital terpadu untuk organisasi kepramukaan. Sistem ini akan dimigrasikan dari Google Apps Script ke **Firebase** untuk mencapai performa *real-time* dan tanpa jeda *loading*. 

Sistem akan dirancang menggunakan arsitektur **Multi-Page Application (MPA)** di mana setiap fitur memiliki file HTML-nya sendiri, serta sebuah **Panel Admin Terisolasi** yang tidak memiliki tautan langsung dari web publik demi keamanan maksimal.

## 2. Tujuan & Sasaran (Objectives & Goals)
1. **Performa Real-time:** Memanfaatkan protokol WebSocket Firestore.
2. **Keamanan Terisolasi:** Memisahkan *User Interface* publik dengan Dasbor Admin secara fisik (beda folder) dan logika (Firestore Security Rules).
3. **Pemisahan Modul (MPA):** Menghindari penumpukan kode HTML (kode *spaghetti*) dengan memisahkan file (misal: `absen.html`, `daftar.html`, `berita.html`).
4. **Otomatisasi Latar Belakang:** Menggunakan Firebase Cloud Functions untuk pembuatan PDF Biodata, pengiriman Email, dan API WhatsApp Fonnte.

## 3. Struktur Folder & File (Folder Structure)
Proyek ini akan di-hosting menggunakan **Firebase Hosting** dengan struktur direktori sebagai berikut:

```text
scoutdupta-firebase/
│
├── public/                     # Folder utama untuk Firebase Hosting
│   │
│   ├── index.html              # Beranda utama (Menu navigasi utama)
│   ├── berita.html             # Daftar seluruh berita/kabar
│   ├── artikel.html            # Halaman baca detail satu artikel (?id=...)
│   ├── absen.html              # Halaman presensi anggota
│   ├── daftar.html             # Form pendaftaran anggota baru
│   ├── proker.html             # Galeri dokumentasi program kerja
│   ├── login.html              # Halaman login (penulis/admin)
│   ├── tulis-artikel.html      # Halaman khusus penulis (wajib login auth)
│   │
│   ├── assets/                 # Aset statis publik
│   │   ├── css/                # File styling kustom
│   │   ├── js/                 # File logika global
│   │   │   └── firebase.js     # Inisialisasi koneksi Firebase Config
│   │   └── img/                # Gambar statis (Logo, favicon, dll)
│   │
│   └── admin/                  # PANEL ADMIN (Tidak dilink dari halaman depan)
│       ├── index.html          # Dasbor Admin (Overview statistik)
│       ├── data-anggota.html   # Tabel pengelolaan biodata & pendaftar
│       ├── data-absen.html     # Pemantauan absensi real-time
│       ├── data-artikel.html   # Manajemen (Edit/Hapus) artikel
│       ├── data-proker.html    # Manajemen album & unggah foto proker
│       └── assets-admin/       # JS/CSS khusus panel admin
│
├── functions/                  # Backend Firebase Cloud Functions (Node.js)
│   ├── index.js                # Script trigger Generate PDF, Kirim WA, Email
│   └── package.json            # Dependensi Node (pdf-lib, nodemailer, axios)
│
├── firebase.json               # Konfigurasi Firebase Hosting & penanganan URL
└── firestore.rules             # Aturan keamanan read/write database
```

## 4. Profil Pengguna & Hak Akses
1. **Publik/Pengunjung:** Dapat mengakses `index.html`, `berita.html`, `artikel.html`, `proker.html`, `daftar.html`, dan `absen.html`.
2. **Penulis (Author):** Wajib *Login* melalui `login.html`. Hanya dapat mengakses halaman `tulis-artikel.html` (Tidak bisa masuk ke folder `/admin/`).
3. **Super Admin:** Wajib *Login* dengan akun khusus. Mengakses URL `/admin/index.html` secara manual untuk mengelola seluruh data sistem.

## 5. Ruang Lingkup Fitur Baru berdasarkan File

### A. Folder Publik (Akses Pengguna Umum & Penulis)
*   **`daftar.html` (Pendaftaran):** Input data pengguna, unggah pas foto (langsung ke Storage), menyimpan ke Firestore.
*   **`absen.html` (Presensi):** Form pilih nama, status, jepret kamera, catat GPS. Data dikirim ke koleksi `attendance`.
*   **`berita.html` & `artikel.html` (Portal Kabar):** Menampilkan daftar berita (*feed*) dan membaca detail artikel berdasarkan ID dokumen Firestore (`?id=xyz`). View counter dihitung *real-time*.
*   **`tulis-artikel.html`:** Form khusus editor (WYSIWYG) untuk menulis berita. Skrip akan memblokir akses jika pengguna belum melewati Firebase Auth.

### B. Folder Admin (`/admin/` - Terisolasi)
*   Panel ini dikhususkan untuk memantau data yang masuk (*CRUD - Create, Read, Update, Delete*).
*   **`data-anggota.html`:** Melihat daftar pendaftar baru, status pembuatan PDF, dan opsi untuk mengunduh rekap.
*   **`data-absen.html`:** Tabel interaktif *real-time*. Jika ada anggota yang absen di `absen.html`, tabel admin akan bertambah barisnya secara instan tanpa perlu klik *refresh*.
*   Menerapkan *Firestore Security Rules* agar direktori dan data admin hanya bisa di-*read/write* oleh akun dengan *Custom Claim* atau *Role* `admin`.

## 6. Desain Database (Firestore Schema)
*   **`users`**: `uid`, `nama_lengkap`, `email`, `no_wa`, `role` (admin/author/member), `foto_url`.
*   **`articles`**: `id`, `judul`, `isi_html`, `penulis`, `gambar_url`, `views`, `createdAt`.
*   **`attendance`**: `id`, `user_name`, `divisi`, `status`, `lat`, `lng`, `foto_wajah_url`, `timestamp`.

## 7. Cloud Functions (Otomatisasi Pendaftaran)
Sistem pendaftaran akan berjalan asinkronus:
1. Data pendaftar masuk ke Firestore dari `daftar.html`.
2. `functions/index.js` otomatis berjalan di server Google.
3. Node.js menghasilkan dokumen PDF, mengirimnya via Email (`nodemailer`), dan WhatsApp (API Fonnte).