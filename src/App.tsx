import React, { useState } from 'react';
import { OfficeProvider, useOffice } from './context/OfficeContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DocumentViewerModal } from './components/common/DocumentViewerModal';
import { PaperlessImpactModal } from './components/layout/PaperlessImpactModal';

// Pages
import { DashboardView } from './pages/DashboardView';
import { SuratMasukView } from './pages/SuratMasukView';
import { SuratKeluarView } from './pages/SuratKeluarView';
import { DisposisiView } from './pages/DisposisiView';
import { DokumenArsipView } from './pages/DokumenArsipView';
import { FormulirDigitalView } from './pages/FormulirDigitalView';
import { ApprovalView } from './pages/ApprovalView';
import { ESignView } from './pages/ESignView';
import { MemoInternalView } from './pages/MemoInternalView';
import { KalenderAgendaView } from './pages/KalenderAgendaView';
import { TaskManagementView } from './pages/TaskManagementView';
import { InventarisAsetView } from './pages/InventarisAsetView';
import { BukuTamuView } from './pages/BukuTamuView';
import { LaporanView } from './pages/LaporanView';
import { PenggunaView } from './pages/PenggunaView';
import { DepartemenView } from './pages/DepartemenView';
import { PengaturanView } from './pages/PengaturanView';
import { ProfilView } from './pages/ProfilView';
import { LoginView } from './pages/LoginView';

const MainOfficeApp: React.FC = () => {
  const {
    activeTab,
    setActiveTab
  } = useOffice();

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isEcoModalOpen, setIsEcoModalOpen] = useState(false);

  if (!isLoggedIn) {
    return <LoginView onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onOpenQuickAction={(t) => setActiveTab(t)} onOpenImpactModal={() => setIsEcoModalOpen(true)} />;
      case 'surat_masuk':
        return <SuratMasukView />;
      case 'surat_keluar':
        return <SuratKeluarView />;
      case 'disposisi':
        return <DisposisiView />;
      case 'dokumen':
      case 'arsip':
        return <DokumenArsipView />;
      case 'form_digital':
      case 'formulir':
        return <FormulirDigitalView />;
      case 'approval':
        return <ApprovalView />;
      case 'tanda_tangan':
      case 'esign':
        return <ESignView />;
      case 'memo':
        return <MemoInternalView />;
      case 'kalender':
      case 'agenda':
        return <KalenderAgendaView />;
      case 'tugas':
      case 'tasks':
        return <TaskManagementView />;
      case 'inventaris':
        return <InventarisAsetView />;
      case 'buku_tamu':
        return <BukuTamuView />;
      case 'laporan':
        return <LaporanView />;
      case 'pengguna':
        return <PenggunaView />;
      case 'departemen':
        return <DepartemenView />;
      case 'pengaturan':
        return <PengaturanView />;
      case 'profil':
        return <ProfilView />;
      default:
        return <DashboardView onOpenQuickAction={(t) => setActiveTab(t)} onOpenImpactModal={() => setIsEcoModalOpen(true)} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50/80 font-sans antialiased text-slate-900 overflow-hidden selection:bg-indigo-600 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenEcoModal={() => setIsEcoModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <Navbar
          onToggleMobileMenu={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onOpenEcoModal={() => setIsEcoModalOpen(true)}
          onLogout={() => setIsLoggedIn(false)}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto pb-12">
            {renderActivePage()}
          </div>
        </main>
      </div>

      {/* Modals */}
      <DocumentViewerModal />
      <PaperlessImpactModal
        isOpen={isEcoModalOpen}
        onClose={() => setIsEcoModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <OfficeProvider>
      <MainOfficeApp />
    </OfficeProvider>
  );
}
