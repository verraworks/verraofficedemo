import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  Send,
  GitPullRequest,
  FolderLock,
  FileCheck2,
  Stamp,
  Megaphone,
  Calendar,
  CheckSquare,
  Package,
  BookOpen,
  BarChart3,
  Users,
  Building,
  Settings,
  UserCircle,
  FileEdit,
  Leaf,
  ChevronRight,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useOffice } from '../../context/OfficeContext';

interface SidebarProps {
  isOpen?: boolean;
  isMobileOpen?: boolean;
  onCloseMobile: () => void;
  onOpenImpactModal?: () => void;
  onOpenEcoModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isMobileOpen,
  onCloseMobile,
  onOpenImpactModal,
  onOpenEcoModal
}) => {
  const sidebarOpen = isOpen ?? isMobileOpen ?? false;
  const triggerImpactModal = onOpenImpactModal || onOpenEcoModal || (() => {});
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    suratMasuk, 
    suratKeluar,
    disposisi, 
    formSubmissions, 
    guestBook,
    paperlessStats,
    logout
  } = useOffice();

  // Badges calculation
  const pendingSuratMasuk = suratMasuk.filter(s => s.status === 'baru').length;
  const pendingApproval = formSubmissions.filter(f => f.status === 'pending').length + suratKeluar.filter(s => s.status === 'menunggu_approval').length;
  const activeDisposisi = disposisi.filter(d => d.status !== 'selesai').length;
  const activeGuests = guestBook.filter(g => g.status === 'menunggu' || g.status === 'sedang_bertemu').length;

  const menuSections = [
    {
      title: 'UTAMA',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'PERSURATAN & DISPOSISI',
      items: [
        { id: 'surat_masuk', label: 'Surat Masuk', icon: Inbox, badge: pendingSuratMasuk > 0 ? pendingSuratMasuk : undefined, badgeColor: 'bg-blue-600' },
        { id: 'surat_keluar', label: 'Surat Keluar', icon: Send },
        { id: 'disposisi', label: 'Disposisi Digital', icon: GitPullRequest, badge: activeDisposisi > 0 ? activeDisposisi : undefined, badgeColor: 'bg-amber-600' },
        { id: 'tanda_tangan', label: 'Tanda Tangan (E-Sign)', icon: Stamp }
      ]
    },
    {
      title: 'DOKUMEN & FORMULIR',
      items: [
        { id: 'dokumen', label: 'Dokumen & Arsip', icon: FolderLock },
        { id: 'form_digital', label: 'Formulir Digital', icon: FileEdit },
        { id: 'approval', label: 'Persetujuan (Approval)', icon: FileCheck2, badge: pendingApproval > 0 ? pendingApproval : undefined, badgeColor: 'bg-rose-600' },
        { id: 'memo', label: 'Memo & Pengumuman', icon: Megaphone }
      ]
    },
    {
      title: 'OPERASIONAL KANTOR',
      items: [
        { id: 'kalender', label: 'Agenda & Kalender', icon: Calendar },
        { id: 'tugas', label: 'Tugas & Pekerjaan', icon: CheckSquare },
        { id: 'inventaris', label: 'Inventaris & Aset', icon: Package },
        { id: 'buku_tamu', label: 'Buku Tamu Digital', icon: BookOpen, badge: activeGuests > 0 ? activeGuests : undefined, badgeColor: 'bg-emerald-600' }
      ]
    },
    {
      title: 'MANAJEMEN & LAPORAN',
      items: [
        { id: 'laporan', label: 'Laporan & Statistik', icon: BarChart3 },
        { id: 'pengguna', label: 'Pengguna & Role', icon: Users },
        { id: 'departemen', label: 'Departemen / Unit', icon: Building },
        { id: 'pengaturan', label: 'Pengaturan Sistem', icon: Settings },
        { id: 'profil', label: 'Profil Saya', icon: UserCircle }
      ]
    }
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="main-sidebar"
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-lg shadow-sm">
              V
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
                VerraOffice
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-400/30">v2.4</span>
              </h1>
              <p className="text-[10px] text-slate-400 tracking-wide font-medium">Digital Office Hub</p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </p>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs font-bold'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full text-white ${item.badgeColor || 'bg-blue-600'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Paperless Impact Widget */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/30">
          <div 
            onClick={triggerImpactModal}
            className="p-3 rounded-xl bg-gradient-to-br from-emerald-950/60 to-teal-950/40 border border-emerald-800/40 hover:border-emerald-500/60 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>Eco Impact</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[11px] text-slate-300">Kertas Dihemat:</span>
              <span className="text-xs font-extrabold text-emerald-300">{paperlessStats.rimKertasDihemat} Rim</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full w-3/4" />
            </div>
          </div>
        </div>

        {/* User Footer Summary */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
              alt="User"
              className="w-8 h-8 rounded-full object-cover border border-slate-700"
            />
            <div className="min-w-0 text-left">
              <p className="text-xs font-bold text-white truncate">{currentUser?.name?.split(',')[0] || 'User'}</p>
              <p className="text-[10px] text-blue-400 truncate font-medium">{currentUser?.roleLabel || 'Pimpinan'}</p>
            </div>
          </div>
          <button
            id="sidebar-logout-btn"
            onClick={logout}
            title="Keluar / Logout"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
