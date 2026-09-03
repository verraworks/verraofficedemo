import React, { useState } from 'react';
import {
  GitPullRequest,
  Plus,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  UserCheck,
  Send,
  AlertCircle
} from 'lucide-react';
import { useOffice } from '../context/OfficeContext';
import { DisposisiItem, PriorityLevel } from '../types';
import { PriorityBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const DisposisiView: React.FC = () => {
  const {
    disposisi,
    suratMasuk,
    addDisposisi,
    updateDisposisiStatus,
    users,
    setPreviewItem
  } = useOffice();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [completingDisposisi, setCompletingDisposisi] = useState<DisposisiItem | null>(null);
  const [laporanPenyelesaian, setLaporanPenyelesaian] = useState('');

  // Form State for new disposition
  const [selectedSuratId, setSelectedSuratId] = useState(suratMasuk[0]?.id || '');
  const [targetUserId, setTargetUserId] = useState(users[2]?.id || '');
  const [selectedInstruksi, setSelectedInstruksi] = useState<string[]>(['Tindak Lanjuti Segera', 'Koordinasikan']);
  const [catatan, setCatatan] = useState('');
  const [prioritas, setPrioritas] = useState<PriorityLevel>('penting');
  const [deadline, setDeadline] = useState(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));

  const instructionPresets = [
    'Tindak Lanjuti Segera',
    'Hadir / Wakili',
    'Siapkan Bahan Paparan',
    'Koordinasikan dengan Unit Terkait',
    'Pelajari & Beri Masukan',
    'Arsipkan / Simpan',
    'Laporkan Hasilnya'
  ];

  const filteredList = disposisi.filter((item) => {
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchSearch =
      item.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.perihal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tujuanPegawaiNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.asalSurat.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const surat = suratMasuk.find(s => s.id === selectedSuratId);
    const targetUser = users.find(u => u.id === targetUserId);

    if (!surat || !targetUser) return;

    addDisposisi({
      suratMasukId: surat.id,
      nomorSurat: surat.nomorSurat,
      asalSurat: surat.asalSurat,
      perihal: surat.perihal,
      dariPimpinan: 'Dr. Ir. Hendra Wijaya, M.M.',
      tujuanPegawaiId: targetUser.id,
      tujuanPegawaiNama: targetUser.name,
      departemenTujuan: targetUser.department,
      instruksi: selectedInstruksi,
      catatanInstruksi: catatan,
      prioritas,
      deadline
    });

    setIsNewModalOpen(false);
    setCatatan('');
  };

  const handleCompleteDisposisi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingDisposisi) return;

    updateDisposisiStatus(completingDisposisi.id, 'selesai', laporanPenyelesaian || 'Disposisi telah ditindaklanjuti dan diselesaikan.');
    setCompletingDisposisi(null);
    setLaporanPenyelesaian('');
  };

  const toggleInst = (inst: string) => {
    setSelectedInstruksi(prev => 
      prev.includes(inst) ? prev.filter(i => i !== inst) : [...prev, inst]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <GitPullRequest className="w-6 h-6 text-amber-600" />
            Lembar Disposisi Digital Pimpinan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengganti lembar disposisi kertas kuning manual. Instruksi langsung ke pejabat pelaksana dengan pelacakan deadline real-time.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Cetak Lembar Disposisi
          </button>
          <button
            id="btn-add-disposisi"
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Beri Disposisi Baru
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'Semua Disposisi' },
              { id: 'belum_dibuka', label: 'Belum Dibuka' },
              { id: 'dikerjakan', label: 'Sedang Dikerjakan' },
              { id: 'selesai', label: 'Selesai' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari perihal, nomor surat, nama..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Disposisi Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.length === 0 ? (
          <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            <GitPullRequest className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold">Tidak ada lembar disposisi yang sesuai filter.</p>
          </div>
        ) : (
          filteredList.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400 shadow-xs p-5 transition-all space-y-4"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                      Disposisi #{d.id.slice(-4)}
                    </span>
                    <PriorityBadge priority={d.prioritas} />
                  </div>
                  <p className="font-bold text-slate-900 text-sm line-clamp-1">{d.perihal}</p>
                  <p className="text-[11px] text-slate-500 font-mono">Surat No: {d.nomorSurat} ({d.asalSurat})</p>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 ${
                    d.status === 'selesai'
                      ? 'bg-emerald-100 text-emerald-800'
                      : d.status === 'dikerjakan'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {d.status === 'selesai' ? '✓ Selesai' : d.status === 'dikerjakan' ? '⚡ Dikerjakan' : '⏳ Belum Dibuka'}
                </span>
              </div>

              {/* Recipient & Deadline */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold">Tujuan Pegawai</p>
                  <p className="font-bold text-slate-900 truncate">{d.tujuanPegawaiNama}</p>
                  <p className="text-[10px] text-slate-500 truncate">{d.departemenTujuan}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold">Batas Waktu (Deadline)</p>
                  <p className="font-bold text-slate-900 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" /> {d.deadline || 'Segera'}
                  </p>
                  <p className="text-[10px] text-slate-400">Dari: {d.dariPimpinan.split(',')[0]}</p>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Instruksi Pimpinan:</p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {d.instruksi.map((ins, i) => (
                    <span key={i} className="text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md">
                      ✓ {ins}
                    </span>
                  ))}
                </div>
                {d.catatanInstruksi && (
                  <p className="text-xs text-slate-600 italic bg-amber-50/40 p-2.5 rounded-lg border border-amber-100">
                    "{d.catatanInstruksi}"
                  </p>
                )}
              </div>

              {/* Completion Report if done */}
              {d.laporanPenyelesaian && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                  <p className="font-bold text-emerald-900 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Laporan Penyelesaian:
                  </p>
                  <p className="text-emerald-800 text-[11px] mt-0.5">{d.laporanPenyelesaian}</p>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => setPreviewItem({ type: 'disposisi', data: d })}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> Pratinjau Lembar
                </button>

                {d.status !== 'selesai' ? (
                  <button
                    onClick={() => setCompletingDisposisi(d)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    Lapor Selesai
                  </button>
                ) : (
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Tuntas
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Beri Disposisi Baru */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Buat Lembar Disposisi Digital Baru"
        subtitle="Berikan arahan disposisi dari surat masuk kepada pejabat/staf pelaksana"
        maxWidth="3xl"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Pilih Surat Masuk yang Didisposisikan *</label>
            <select
              value={selectedSuratId}
              onChange={(e) => setSelectedSuratId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-amber-500 font-semibold text-slate-800"
            >
              {suratMasuk.map(s => (
                <option key={s.id} value={s.id}>
                  [{s.nomorSurat}] {s.perihal} — {s.asalSurat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Diteruskan Kepada (Pegawai / Pejabat) *</label>
              <select
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-amber-500 font-semibold text-slate-800"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.roleLabel}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Batas Waktu (Deadline)</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-2">Instruksi Pimpinan:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {instructionPresets.map(preset => {
                const isChecked = selectedInstruksi.includes(preset);
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => toggleInst(preset)}
                    className={`p-2 rounded-xl border text-left font-semibold text-xs transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {isChecked ? '✓ ' : '+ '} {preset}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Catatan Arahan Khusus</label>
            <textarea
              rows={3}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Catatan tambahan petunjuk teknis pelaksanaan..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-amber-500 outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsNewModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" /> Terbitkan Disposisi
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Lapor Penyelesaian Disposisi */}
      <Modal
        isOpen={!!completingDisposisi}
        onClose={() => setCompletingDisposisi(null)}
        title="Laporan Penyelesaian Disposisi"
        subtitle={`Disposisi No. ${completingDisposisi?.nomorSurat}`}
        maxWidth="lg"
      >
        <form onSubmit={handleCompleteDisposisi} className="space-y-4 text-xs font-sans">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <p className="font-bold text-slate-800">{completingDisposisi?.perihal}</p>
            <p className="text-[11px] text-slate-500">Instruksi: {completingDisposisi?.instruksi.join(', ')}</p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Uraian Hasil Tindak Lanjut *</label>
            <textarea
              rows={4}
              required
              value={laporanPenyelesaian}
              onChange={(e) => setLaporanPenyelesaian(e.target.value)}
              placeholder="Jelaskan langkah atau hasil tindak lanjut yang telah dilakukan (misal: Bahan paparan telah disusun, rapat telah dihadiri)..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setCompletingDisposisi(null)}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
            >
              Kirim Laporan & Tandai Selesai
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
