import React from 'react';
import {
  Inbox,
  Send,
  GitPullRequest,
  FileCheck2,
  FolderLock,
  TreePine,
  Clock,
  ArrowUpRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertCircle,
  FileText,
  Plus,
  ArrowRight,
  Building2,
  Users,
  Megaphone,
  ShieldCheck,
  TrendingUp,
  Leaf
} from 'lucide-react';
import { useOffice } from '../context/OfficeContext';
import { StatsCard } from '../components/common/StatsCard';
import { PriorityBadge, SuratStatusBadge, FormStatusBadge } from '../components/common/Badge';

interface DashboardViewProps {
  onOpenQuickAction: (actionType: string) => void;
  onOpenImpactModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenQuickAction, onOpenImpactModal }) => {
  const {
    currentUser,
    suratMasuk,
    suratKeluar,
    disposisi,
    dokumen,
    formSubmissions,
    events,
    tasks,
    memos,
    paperlessStats,
    setActiveTab,
    setPreviewItem
  } = useOffice();

  const pendingSuratMasuk = suratMasuk.filter(s => s.status === 'baru');
  const pendingApprovals = formSubmissions.filter(f => f.status === 'pending');
  const activeDisposisi = disposisi.filter(d => d.status !== 'selesai');
  const todayDate = new Date().toISOString().slice(0, 10);
  const todayEvents = events.filter(e => e.tanggal === todayDate || e.tanggal >= todayDate).slice(0, 3);
  const urgentTasks = tasks.filter(t => t.status !== 'completed').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Paperless Progress */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-md border border-slate-800">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>VerraOffice Digital Enterprise 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang, {currentUser?.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Sistem administrasi perkantoran digital terpadu. Seluruh alur surat, disposisi, pengajuan form, dan pengarsipan berjalan 100% paperless dengan validasi e-signature resmi.
            </p>
          </div>

          {/* Eco Impact Quick Metric */}
          <div 
            onClick={onOpenImpactModal}
            className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 hover:bg-white/15 transition-all cursor-pointer group shrink-0 lg:w-72"
          >
            <div className="flex items-center justify-between text-xs text-emerald-300 font-bold mb-1">
              <span className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-400" /> Penghematan Kertas
              </span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <p className="text-2xl font-black text-white">
              {paperlessStats.rimKertasDihemat} <span className="text-sm font-semibold text-emerald-300">Rim Terhemat</span>
            </p>
            <p className="text-[11px] text-slate-300 mt-1">
              ~Rp {(paperlessStats.biayaPercetakanDihemat / 1000).toFixed(0)}rb biaya cetak & {paperlessStats.pohonTerselamatkan} pohon lestari
            </p>
          </div>
        </div>
      </div>

      {/* 4 Core Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          id="stat-surat-masuk"
          title="Surat Masuk"
          value={suratMasuk.length}
          subtitle={`${pendingSuratMasuk.length} surat baru belum didisposisi`}
          icon={Inbox}
          color="blue"
          onClick={() => setActiveTab('surat_masuk')}
        />
        <StatsCard
          id="stat-surat-keluar"
          title="Surat Keluar"
          value={suratKeluar.length}
          subtitle={`${suratKeluar.filter(s => s.status === 'ditandatangani').length} telah di-e-sign resmi`}
          icon={Send}
          color="emerald"
          onClick={() => setActiveTab('surat_keluar')}
        />
        <StatsCard
          id="stat-disposisi"
          title="Disposisi Aktif"
          value={activeDisposisi.length}
          subtitle={`${disposisi.filter(d => d.status === 'selesai').length} instruksi terselesaikan`}
          icon={GitPullRequest}
          color="amber"
          onClick={() => setActiveTab('disposisi')}
        />
        <StatsCard
          id="stat-approval"
          title="Menunggu Approval"
          value={pendingApprovals.length}
          subtitle="Formulir & surat butuh persetujuan"
          icon={FileCheck2}
          color="rose"
          onClick={() => setActiveTab('approval')}
        />
      </div>

      {/* Main Grid: Pending Approvals & Today Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Action Required & Urgent Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Approvals Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Pekerjaan & Approval Menunggu Tindakan</h3>
                  <p className="text-xs text-slate-500">Permintaan yang memerlukan verifikasi atau paraf Anda</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('approval')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingApprovals.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-semibold text-slate-600">Semua pengajuan telah diproses!</p>
                <p className="text-slate-400">Tidak ada approval yang tertunda saat ini.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.slice(0, 3).map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-xl border border-slate-200/90 hover:border-blue-300 bg-slate-50/40 hover:bg-blue-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{sub.formTitle}</span>
                        <PriorityBadge priority={sub.prioritas} />
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Diajukan oleh <strong className="text-slate-700">{sub.pemohonNama}</strong> ({sub.departemen}) • No: {sub.nomorPengajuan}
                      </p>
                      {sub.biayaEstimasi && (
                        <p className="text-xs font-bold text-blue-900">
                          Estimasi: Rp {sub.biayaEstimasi.toLocaleString('id-ID')}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setPreviewItem({ type: 'form', data: sub })}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => setActiveTab('approval')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                      >
                        Tinjau & Setujui
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Incoming & Outgoing Letters */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Inbox className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Aktivitas Surat Terkini</h3>
                  <p className="text-xs text-slate-500">Surat masuk & keluar yang baru diarsipkan secara digital</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('surat_masuk')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                Arsip Surat <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {suratMasuk.slice(0, 3).map((sm) => (
                <div
                  key={sm.id}
                  onClick={() => setPreviewItem({ type: 'surat_masuk', data: sm })}
                  className="py-3 flex items-start justify-between gap-3 hover:bg-slate-50/60 p-2 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <SuratStatusBadge status={sm.status} />
                      <span className="font-mono text-[11px] text-slate-500">{sm.nomorSurat}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 truncate">{sm.perihal}</p>
                    <p className="text-[11px] text-slate-500 truncate">
                      Dari: <strong className="text-slate-700">{sm.asalSurat}</strong> • Diterima: {sm.tanggalTerima}
                    </p>
                  </div>
                  <PriorityBadge priority={sm.prioritas} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Today's Agenda, Priority Tasks & Latest Memo */}
        <div className="space-y-6">
          {/* Today's Agenda & Meetings */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Agenda & Jadwal</h3>
                  <p className="text-xs text-slate-500">Pertemuan & kegiatan hari ini</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('kalender')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Kalender
              </button>
            </div>

            <div className="space-y-3">
              {todayEvents.map((ev) => (
                <div key={ev.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{ev.judul}</span>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      {ev.waktuMulai} - {ev.waktuSelesai}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-400" /> {ev.lokasi}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    Peserta: {ev.peserta.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tasks Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Tugas Prioritas</h3>
                  <p className="text-xs text-slate-500">Pekerjaan kantor yang sedang berjalan</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('tugas')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Kanban
              </button>
            </div>

            <div className="space-y-2.5">
              {urgentTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setActiveTab('tugas')}
                  className="p-3 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/20 transition-all cursor-pointer text-xs space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-slate-800 line-clamp-1">{t.judul}</p>
                    <PriorityBadge priority={t.prioritas} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> Due: {t.deadline}
                    </span>
                    <span className="font-semibold text-slate-700">{t.penanggungJawabNama.split(' ')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Internal Memo Card */}
          {memos.length > 0 && (
            <div 
              onClick={() => setActiveTab('memo')}
              className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 cursor-pointer hover:shadow-xs transition-all"
            >
              <div className="flex items-center gap-2 text-blue-900 text-xs font-bold mb-1.5">
                <Megaphone className="w-4 h-4 text-blue-600" />
                <span>Pengumuman Kantor Terbaru</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{memos[0].judul}</h4>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{memos[0].isiMemo}</p>
              <p className="text-[10px] text-blue-700 font-semibold mt-2">Diterbitkan oleh {memos[0].pengirimNama}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
