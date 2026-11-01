/**
 * ScoutDupta - Admin App Common Logic & Navigation
 */

export function renderAdminLayout(activePage = 'dashboard') {
  const sidebarContainer = document.getElementById('admin-sidebar');
  const headerContainer = document.getElementById('admin-header');

  const navItems = [
    { id: 'dashboard', label: 'Ringkasan', icon: 'fas fa-chart-pie', href: '/admin/dashboard.html' },
    { id: 'berita', label: 'Kelola Berita', icon: 'fas fa-newspaper', href: '/admin/kelola-berita.html' },
    { id: 'tulis', label: 'Tulis Artikel', icon: 'fas fa-pen-nib', href: '/admin/tulis-artikel.html' },
    { id: 'absen', label: 'Presensi Realtime', icon: 'fas fa-fingerprint', href: '/admin/kelola-absen.html' },
    { id: 'anggota', label: 'Data Anggota', icon: 'fas fa-users', href: '/admin/kelola-anggota.html' },
    { id: 'proker', label: 'Dokumentasi Proker', icon: 'fas fa-images', href: '/admin/kelola-proker.html' },
  ];

  if (sidebarContainer) {
    sidebarContainer.innerHTML = `
      <div class="p-6 border-b border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="https://pradupta.my.id/img/logo.png" alt="Logo" class="w-10 h-10 object-contain drop-shadow" onerror="this.src='https://pradupta.github.io/web/img/logo.png'">
          <div>
            <h1 class="font-extrabold text-white text-base tracking-tight">ScoutDupta</h1>
            <p class="text-[10px] text-red-400 font-bold uppercase tracking-wider">Admin Control Panel</p>
          </div>
        </div>
      </div>

      <nav class="p-4 space-y-1.5 flex-1 overflow-y-auto">
        <div class="text-[10px] uppercase font-bold text-slate-500 px-3 mb-2 tracking-widest">Navigasi Utama</div>
        ${navItems.map(item => {
          const isActive = activePage === item.id;
          return `
            <a href="${item.href}" class="flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
              isActive 
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/25' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }">
              <i class="${item.icon} w-5 text-center text-sm ${isActive ? 'text-white' : 'text-slate-400'}"></i>
              <span>${item.label}</span>
            </a>
          `;
        }).join('')}

        <div class="pt-6 text-[10px] uppercase font-bold text-slate-500 px-3 mb-2 tracking-widest">Situs Publik</div>
        <a href="/index.html" target="_blank" class="flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all">
          <i class="fas fa-external-link-alt w-5 text-center text-sm"></i>
          <span>Buka Beranda Publik</span>
        </a>
      </nav>

      <div class="p-4 border-t border-slate-800">
        <div class="bg-slate-800/80 p-3.5 rounded-2xl flex items-center justify-between">
          <div class="flex items-center gap-2.5 overflow-hidden">
            <div class="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center font-bold text-xs shrink-0">
              <i class="fas fa-user-shield"></i>
            </div>
            <div class="truncate">
              <p id="admin-user-name" class="text-xs font-bold text-white truncate">Administrator</p>
              <p id="admin-user-role" class="text-[10px] text-red-400 font-bold uppercase tracking-wider">SUPER ADMIN</p>
            </div>
          </div>
          <button onclick="adminLogout()" class="p-2 text-slate-400 hover:text-red-400 transition" title="Keluar">
            <i class="fas fa-sign-out-alt text-sm"></i>
          </button>
        </div>
      </div>
    `;
  }

  if (headerContainer) {
    headerContainer.innerHTML = `
      <div class="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
        <div class="flex items-center gap-3">
          <button id="toggle-mobile-sidebar" class="lg:hidden p-2 text-slate-400 hover:text-white">
            <i class="fas fa-bars text-lg"></i>
          </button>
          <span class="text-xs font-extrabold text-slate-400 uppercase tracking-widest">SMAN 20 KAB. TANGERANG</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Firestore Real-time Aktif
          </span>
          <button onclick="adminLogout()" class="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-600/20 text-slate-300 hover:text-red-400 text-xs font-bold transition">
            <i class="fas fa-power-off text-xs"></i> Keluar
          </button>
        </div>
      </div>
    `;

    // Hook mobile drawer
    const toggleBtn = document.getElementById('toggle-mobile-sidebar');
    if (toggleBtn) {
      toggleBtn.onclick = () => {
        const sidebar = document.getElementById('admin-sidebar');
        if (sidebar) sidebar.classList.toggle('hidden');
      };
    }
  }
}
