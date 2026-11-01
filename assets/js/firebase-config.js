/**
 * ScoutDupta - Firebase v10 Modular Configuration
 * Pramuka SMAN 20 Kabupaten Tangerang
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  where, 
  onSnapshot,
  serverTimestamp,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase App Configuration
export const firebaseConfig = {
  projectId: "emerald-theory-9f6jr",
  appId: "1:155149553024:web:f66d16389d1739a8d00565",
  apiKey: "AIzaSyAKmVFviWV1eW67jyVmjzPIlfabJEK67pY",
  authDomain: "emerald-theory-9f6jr.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-f0e8e193-d22f-4088-a1f6-f3b66d59f071",
  storageBucket: "emerald-theory-9f6jr.firebasestorage.app",
  messagingSenderId: "155149553024"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Error handler helper
export function handleFirestoreError(error, operationType = 'read', path = '') {
  console.error(`[Firestore Error - ${operationType} on ${path}]:`, error);
  if (window.Swal) {
    Swal.fire({
      icon: 'error',
      title: 'Kesalahan Sistem',
      text: error.message || 'Terjadi kesalahan saat menghubungi database Firebase.',
      confirmButtonColor: '#dc2626'
    });
  }
}

// Initial Data Seeder (Ensures default rich content for first-time load)
export async function seedInitialDataIfEmpty() {
  try {
    const articlesCol = collection(db, "articles");
    const checkSnap = await getDocs(query(articlesCol, limit(1)));
    
    if (checkSnap.empty) {
      console.log("Seeding initial articles & configuration...");

      // Initial Articles
      await addDoc(articlesCol, {
        judul: "Penerimaan Tamu Ambalan (PTA) SMAN 20 Kab. Tangerang Tahun 2026",
        isi_html: `<p>Kegiatan Penerimaan Tamu Ambalan (PTA) Pangkalan SMAN 20 Kabupaten Tangerang Ambalan Raden Fatah - Cut Nyak Dien berlangsung dengan penuh khidmat dan semangat kebersamaan.</p>
        <p>Kegiatan ini bertujuan untuk menyambut adik-adik penggalang yang beralih ke jenjang penegak, serta membentuk karakter disiplin, mandiri, berakhlak mulia, dan berjiwa ksatria sesuai dengan Tri Satya dan Dasa Darma Pramuka.</p>
        <p>Adapun rangkaian kegiatan meliputi upacara adat ambalan, materi kepenagakan, pioneering, penjelajahan halang rintang, serta api unggun persaudaraan.</p>`,
        penulis: "Hafidz Sajili (Pembina)",
        authorId: "admin",
        gambar_url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200",
        views: 142,
        kategori: "Kegiatan",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      await addDoc(articlesCol, {
        judul: "Arah Kebijakan dan Petunjuk Teknis Gerakan Pramuka Gudep 20.081 - 20.082",
        isi_html: `<p>Berikut adalah dokumen Arah Kebijakan dan Rencana Kerja Strategis Kepramukaan SMAN 20 Kabupaten Tangerang masa bakti 2026-2027.</p>
        <p>Dokumen ini menjadi pedoman pelaksanaan kegiatan kepramukaan, sistem presensi digital, uji SKU & SKK, serta program partisipasi lomba tingkat kwaran, kwarcab hingga daerah.</p>`,
        penulis: "Dewan Kehormatan",
        authorId: "admin",
        gambar_url: "https://images.unsplash.com/photo-1455849318743-b2233052fcff?q=80&w=1200",
        pdf_url: "https://drive.google.com/file/d/1iGIOK7EmnnUkQYiOwfqep_diOcb_hH5y/preview",
        views: 89,
        kategori: "Kebijakan",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString()
      });

      await addDoc(articlesCol, {
        judul: "Latihan Gabungan Pioneering & Navigasi Darat Bersama Kwarran",
        isi_html: `<p>Anggota ScoutDupta sukses melaksanakan latihan gabungan pembuatan menara pandang 4 tiang dan navigasi darat orientasi medan di kawasan perkemahan Kitri Bakti.</p>
        <p>Kegiatan ini mengasah keterampilan tali-temali tingkat lanjut, kekompakan sangga, dan ketangkasan membaca peta topografi serta kompas bidik.</p>`,
        penulis: "Pradana Putra",
        authorId: "author",
        gambar_url: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200",
        views: 65,
        kategori: "Pelatihan",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Initial Proker
      const prokerCol = collection(db, "proker");
      await addDoc(prokerCol, {
        name: "Penerimaan Tamu Ambalan (PTA)",
        cover: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800",
        description: "Dokumentasi kegiatan pelantikan dan masa orientasi tamu ambalan",
        photos: [
          "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200",
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200",
          "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=1200"
        ],
        createdAt: new Date().toISOString()
      });

      await addDoc(prokerCol, {
        name: "Giat Dianpinsat & LDKP",
        cover: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=800",
        description: "Geladi Pimpinan Satuan dan Latihan Dasar Kepemimpinan Penegak",
        photos: [
          "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1200",
          "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200"
        ],
        createdAt: new Date().toISOString()
      });

      await addDoc(prokerCol, {
        name: "Bakti Sosial & Ramadhan Ceria",
        cover: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=800",
        description: "Penyaluran sembako dan santunan masyarakat sekitar sekolah",
        photos: [
          "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1200"
        ],
        createdAt: new Date().toISOString()
      });

      // Initial Config (Classes & Divisions)
      await setDoc(doc(db, "config", "attendance_roster"), {
        school: "PRADUPTA - SMAN 20 KAB. TANGERANG",
        classes: [
          "Sangga Penegas (Kelas X)",
          "Sangga Pendobrak (Kelas X)",
          "Sangga Perintis (Kelas XI)",
          "Sangga Pelaksana (Kelas XI)",
          "Dewan Ambalan (Kelas XII)",
          "Pembina & Pelatih"
        ],
        students: [
          { nama: "Ahmad Rizki Pratama", kelas: "Sangga Penegas (Kelas X)" },
          { nama: "Bunga Citra Lestari", kelas: "Sangga Penegas (Kelas X)" },
          { nama: "Dimas Anggara", kelas: "Sangga Pendobrak (Kelas X)" },
          { nama: "Fajar Maulana", kelas: "Sangga Perintis (Kelas XI)" },
          { nama: "Gita Safitri", kelas: "Sangga Perintis (Kelas XI)" },
          { nama: "Hafidz Sajili", kelas: "Pembina & Pelatih" },
          { nama: "Muhammad Farhan", kelas: "Dewan Ambalan (Kelas XII)" },
          { nama: "Nabila Putri Rahayu", kelas: "Dewan Ambalan (Kelas XII)" }
        ],
        updatedAt: new Date().toISOString()
      });

      console.log("Seeding complete.");
    }
  } catch (err) {
    console.warn("Seeding note:", err.message);
  }
}

// Auto-run seeder on boot
seedInitialDataIfEmpty();
