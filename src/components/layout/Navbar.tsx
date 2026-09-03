import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Plus,
  ChevronDown,
  UserCheck,
  RotateCcw,
  Sparkles,
  Inbox,
  Send,
  FileEdit,
  GitPullRequest,
  BookOpen,
  Check,
  Layers,
  X
} from 'lucide-react';
import { useOffice } from '../../context/OfficeContext';

interface NavbarProps {
  onToggleMobileSidebar?: () => void;
  onToggleMobileMenu?: () => void;
  onOpenQuickAction?: (actionType: string) => void;
  onOpenEcoModal?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
  onToggleMobileMenu,
  onOpenQuickAction,
  onOpenEcoModal,
  onLogout
}) => {
  const handleToggleMobile = onToggleMobileSidebar || onToggleMobileMenu || (() => {});
  const handleQuickAction = onOpenQuickAction || ((action: string) => {
    if (action === 'surat_masuk') setActiveTab('surat_masuk');
    else if (action === 'surat_keluar') setActiveTab('surat_keluar');
    else if (action === 'disposisi') setActiveTab('disposisi');
    else if (action === 'form_digital' || action === 'formulir') setActiveTab('formulir');
    else if (action === 'buku_tamu') setActiveTab('buku_tamu');
  });
  const {
    currentUser,
    users,
    switchUser,
    activeTab,
    setActiveTab,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    searchQuery,
    setSearchQuery,
    suratMasuk,
    suratKeluar,
    dokumen,
    tasks,
    resetToSampleData
  } = useOffice();

  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const roleRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const quickRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = notifications.filter(n => !n.dibaca).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setShowRoleSwitcher(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (quickRef.current && !quickRef.current.contains(e.target as Node)) setShowQuickActions(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearchDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search results
  const searchResults = searchQuery.trim() ? {
    suratMasuk: suratMasuk.filter(s => 
      s.nomorSurat.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.perihal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.asalSurat.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3),
    suratKeluar: suratKeluar.filter(s => 
      s.nomorSurat.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.perihal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tujuanSurat.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3),
    dokumen: dokumen.filter(d => 
      d.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nomorDokumen.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3),
    tasks: tasks.filter(t => 
      t.judul.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3)
  } : null;

  const totalResults = searchResults 
    ? searchResults.suratMasuk.length + searchResults.suratKeluar.length + searchResults.dokumen.length + searchResults.tasks.length 
    : 0;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between transition-all no-print">
      {/* Left: Mobile Toggle & Page Indicator */}
      <div className="flex items-center gap-3">
        <button
          id="btn-toggle-mobile-sidebar"
          onClick={handleToggleMobile}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">VerraOffice</span>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-bold text-slate-800 capitalize">
            {activeTab.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Middle: Global Search Input */}
      <div ref={searchRef} className="relative flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            placeholder="Cari surat, disposisi, dokumen arsip, nomor agenda..."
            className="w-full pl-9 pr-8 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs text-slate-800 rounded-xl border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Instant Search Results Dropdown */}
        {showSearchDropdown && searchResults && totalResults > 0 && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 max-h-96 overflow-y-auto space-y-3 z-50">
            <div className="flex justify-between items-center px-1 pb-1 border-b border-slate-100 text-[11px] text-slate-500 font-semibold">
              <span>Hasil Pencarian Global ({totalResults})</span>
              <span className="text-blue-600 font-medium">Klik untuk membuka</span>
            </div>

            {searchResults.suratMasuk.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">Surat Masuk</p>
                {searchResults.suratMasuk.map(s => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setActiveTab('surat_masuk');
                      setShowSearchDropdown(false);
                    }}
                    className="p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs"
                  >
                    <p className="font-bold text-slate-800">{s.perihal}</p>
                    <p className="text-[11px] text-slate-500">{s.nomorSurat} • {s.asalSurat}</p>
                  </div>
                ))}
              </div>
            )}

            {searchResults.suratKeluar.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">Surat Keluar</p>
                {searchResults.suratKeluar.map(s => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setActiveTab('surat_keluar');
                      setShowSearchDropdown(false);
                    }}
                    className="p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs"
                  >
                    <p className="font-bold text-slate-800">{s.perihal}</p>
                    <p className="text-[11px] text-slate-500">{s.nomorSurat} • {s.tujuanSurat}</p>
                  </div>
                ))}
              </div>
            )}

            {searchResults.dokumen.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">Dokumen & Arsip</p>
                {searchResults.dokumen.map(d => (
                  <div
                    key={d.id}
                    onClick={() => {
                      setActiveTab('dokumen');
                      setShowSearchDropdown(false);
                    }}
                    className="p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs"
                  >
                    <p className="font-bold text-slate-800">{d.judul}</p>
                    <p className="text-[11px] text-slate-500">{d.nomorDokumen} • {d.departemen}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action Button */}
        <div ref={quickRef} className="relative">
          <button
            id="btn-quick-action"
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Buat Baru</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>

          {showQuickActions && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1">
              <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Pintasan Cepat</p>
              <button
                onClick={() => {
                  setShowQuickActions(false);
                  handleQuickAction('surat_masuk');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 text-left transition-colors cursor-pointer"
              >
                <Inbox className="w-4 h-4 text-blue-600" />
                <span>Input Surat Masuk</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickActions(false);
                  handleQuickAction('surat_keluar');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 text-left transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4 text-emerald-600" />
                <span>Buat Surat Keluar</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickActions(false);
                  handleQuickAction('disposisi');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 text-left transition-colors cursor-pointer"
              >
                <GitPullRequest className="w-4 h-4 text-amber-600" />
                <span>Beri Disposisi</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickActions(false);
                  handleQuickAction('form_digital');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 text-left transition-colors cursor-pointer"
              >
                <FileEdit className="w-4 h-4 text-purple-600" />
                <span>Isi Formulir Digital</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickActions(false);
                  handleQuickAction('buku_tamu');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 text-left transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-cyan-600" />
                <span>Registrasi Tamu Baru</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div ref={notifRef} className="relative">
          <button
            id="btn-notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-800">Notifikasi Kantor</h4>
                  {unreadCount > 0 && (
                    <span className="bg-rose-100 text-rose-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {unreadCount} baru
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                >
                  Tandai Semua Dibaca
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-2">
                {notifications.length === 0 ? (
                  <p className="p-4 text-center text-xs text-slate-400">Tidak ada notifikasi baru.</p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.linkTab) setActiveTab(n.linkTab);
                        setShowNotifications(false);
                      }}
                      className={`p-2.5 rounded-xl cursor-pointer transition-colors text-xs ${
                        !n.dibaca ? 'bg-blue-50/70 hover:bg-blue-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-slate-800">{n.judul}</p>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.waktu}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5 line-clamp-2">{n.pesan}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher Button */}
        <div ref={roleRef} className="relative">
          <button
            id="btn-role-switcher"
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-blue-700 text-white text-[11px] font-black flex items-center justify-center shrink-0">
              {(currentUser?.name || 'U')[0]}
            </div>
            <div className="hidden md:block text-left text-xs">
              <p className="font-bold text-slate-800 truncate max-w-[120px]">{currentUser?.name.split(',')[0]}</p>
              <p className="text-[10px] text-blue-600 font-semibold">{currentUser?.roleLabel}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/70 rounded-xl mb-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ganti Peran / Role Pegawai</p>
                <p className="text-xs text-slate-600 mt-0.5">Uji coba akses menu & hak approval sebagai akun berbeda:</p>
              </div>

              <div className="space-y-1 max-h-72 overflow-y-auto">
                {users.map(u => {
                  const isSelected = currentUser?.id === u.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setShowRoleSwitcher(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                        isSelected ? 'bg-blue-50 border border-blue-200 text-blue-900' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover border" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate">{u.name}</p>
                          <p className="text-[10px] text-slate-500">{u.roleLabel}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 mt-2 border-t border-slate-100 flex justify-between items-center px-2">
                <button
                  onClick={() => {
                    if (confirm('Kembalikan seluruh data ke contoh awal (sample data)?')) {
                      resetToSampleData();
                      setShowRoleSwitcher(false);
                    }
                  }}
                  className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Sample Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
