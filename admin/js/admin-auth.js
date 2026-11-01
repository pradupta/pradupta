/**
 * ScoutDupta - Admin Route Protection Guard
 */
import { auth, db } from "../../assets/js/firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export function protectAdminRoute(allowedRoles = ['admin', 'author']) {
  return new Promise((resolve) => {
    // Show loading overlay while checking
    let guardOverlay = document.getElementById('admin-guard-overlay');
    if (!guardOverlay) {
      guardOverlay = document.createElement('div');
      guardOverlay.id = 'admin-guard-overlay';
      guardOverlay.className = 'fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[9999] flex flex-col items-center justify-center text-white';
      guardOverlay.innerHTML = `
        <div class="w-12 h-12 border-4 border-red-500/30 border-t-red-600 rounded-full animate-spin mb-4"></div>
        <p class="text-xs uppercase font-extrabold tracking-widest text-slate-300">Memverifikasi Izin Akses Admin...</p>
      `;
      document.body.appendChild(guardOverlay);
    }

    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.warn("Unauthenticated admin access attempt.");
        window.location.replace('/admin/login.html?redirect=' + encodeURIComponent(window.location.pathname));
        return;
      }

      let role = 'member';
      let nama = user.displayName || user.email.split('@')[0];

      // Super admin bypass
      if (user.email === 'hafidzsajili464@gmail.com') {
        role = 'admin';
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          role = userDoc.data().role || role;
          nama = userDoc.data().nama_lengkap || nama;
        }
      } catch (err) {
        console.error("Error verifying admin role:", err);
      }

      if (!allowedRoles.includes(role) && user.email !== 'hafidzsajili464@gmail.com') {
        alert("Akses Ditolak: Anda tidak memiliki wewenang untuk membuka Panel Admin.");
        window.location.replace('/index.html');
        return;
      }

      // User authorized
      if (guardOverlay && guardOverlay.parentNode) {
        guardOverlay.parentNode.removeChild(guardOverlay);
      }

      // Update UI elements if present
      const adminNameEl = document.getElementById('admin-user-name');
      if (adminNameEl) adminNameEl.innerText = nama;
      const adminEmailEl = document.getElementById('admin-user-email');
      if (adminEmailEl) adminEmailEl.innerText = user.email;
      const adminRoleEl = document.getElementById('admin-user-role');
      if (adminRoleEl) adminRoleEl.innerText = role.toUpperCase();

      resolve({ user, role, nama });
    });
  });
}

export async function adminLogout() {
  if (confirm("Apakah Anda yakin ingin keluar dari Panel Admin?")) {
    await signOut(auth);
    localStorage.clear();
    window.location.replace('/admin/login.html');
  }
}

window.adminLogout = adminLogout;
