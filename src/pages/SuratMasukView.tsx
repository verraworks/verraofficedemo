import React, { useState } from 'react';
import {
  Inbox,
  Plus,
  Search,
  Filter,
  Eye,
  GitPullRequest,
  Download,
  Printer,
  Trash2,
  FileText,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  Send,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import { useOffice } from '../context/OfficeContext';
import { SuratMasuk, PriorityLevel, SuratStatus } from '../types';
import { PriorityBadge, SuratStatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Select2 } from '../components/common/Select2';

export const SuratMasukView: React.FC = () => {
  const {
    suratMasuk,
    addSuratMasuk,
    updateSuratMasukStatus,
    deleteSuratMasuk,
    addDisposisi,
    users,
    setPreviewItem
  } = useOffice();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedSuratForDisposisi, setSelectedSuratForDisposisi] = useState<SuratMasuk | null>(null);
  const [selectedSuratDetail, setSelectedSuratDetail] = useState<SuratMasuk | null>(null);

  // New Letter Form State
  const [formNomor, setFormNomor] = useState('');
  const [formAsal, setFormAsal] = useState('');
  const [formPerihal, setFormPerihal] = useState('');
  const [formKategori, setFormKategori] = useState('Undangan Resmi');
  const [formPrioritas, setFormPrioritas] = useState<PriorityLevel>('penting');
  const [formTglSurat, setFormTglSurat] = useState(new Date().toISOString().slice(0, 10));
  const [formTglTerima, setFormTglTerima] = useState(new Date().toISOString().slice(0, 10));
  const [formRingkasan, setFormRingkasan] = useState('');
  const [formTargetDisposisi, setFormTargetDisposisi] = useState<string[]>(['usr-1']);

  // Disposisi Quick Form State
  const [dispTargetUser, setDispTargetUser] = useState(users[2].id); // default finance or other
  const [dispInstruksi, setDispInstruksi] = useState<string[]>(['Tindak Lanjuti Segera', 'Siapkan Bahan']);
  const [dispCatatan, setDispCatatan] = useState('');
  const [dispDeadline, setDispDeadline] = useState(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
  const [dispPrioritas, setDispPrioritas] = useState<PriorityLevel>('penting');

  const instructionPresets = [
    'Tindak Lanjuti Segera',
    'Hadir / Wakili',
    'Siapkan Bahan Paparan',
    'Koordinasikan dengan Unit Terkait',
    'Pelajari & Beri Masukan',
    'Arsipkan / Simpan',
    'Laporkan Hasilnya'
  ];

  const filteredList = suratMasuk.filter((item) => {
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || item.prioritas === priorityFilter;
    const matchSearch =
      item.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.perihal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.asalSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nomorAgenda.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchPriority && matchSearch;
  });

  const handleCreateSurat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNomor || !formAsal || !formPerihal) {
      alert('Mohon lengkapi Nomor Surat, Asal Surat, dan Perihal.');
      return;
    }

    addSuratMasuk({
      nomorSurat: formNomor,
      tanggalSurat: formTglSurat,
      tanggalTerima: formTglTerima,
      asalSurat: formAsal,
      perihal: formPerihal,
      kategori: formKategori,
      prioritas: formPrioritas,
      tujuanDisposisi: formTargetDisposisi,
      ringkasanIsi: formRingkasan || 'Surat masuk telah dipindai dan dicatat dalam buku agenda digital.',
      fileUrl: '#',
      fileName: `Scan_${formNomor.replace(/[/\\?%*:|"<>]/g, '_')}.pdf`,
      fileSize: '1.8 MB',
      status: formTargetDisposisi.length > 0 ? 'disposisi' : 'baru'
    });

    setIsNewModalOpen(false);
    // Reset Form
    setFormNomor('');
    setFormAsal('');
    setFormPerihal('');
    setFormRingkasan('');
  };

  const handleCreateDisposisi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSuratForDisposisi) return;

    const targetUserObj = users.find(u => u.id === dispTargetUser) || users[0];

    addDisposisi({
      suratMasukId: selectedSuratForDisposisi.id,
      nomorSurat: selectedSuratForDisposisi.nomorSurat,
      asalSurat: selectedSuratForDisposisi.asalSurat,
      perihal: selectedSuratForDisposisi.perihal,
      dariPimpinan: 'Dr. Ir. Hendra Wijaya, M.M.',
      tujuanPegawaiId: targetUserObj.id,
      tujuanPegawaiNama: targetUserObj.name,
      departemenTujuan: targetUserObj.department,
      instruksi: dispInstruksi,
      catatanInstruksi: dispCatatan,
      prioritas: dispPrioritas,
      deadline: dispDeadline
    });

    setSelectedSuratForDisposisi(null);
    setDispCatatan('');
  };

  const toggleInstruction = (inst: string) => {
    setDispInstruksi(prev => 
      prev.includes(inst) ? prev.filter(i => i !== inst) : [...prev, inst]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Inbox className="w-6 h-6 text-blue-600" />
            Buku Agenda & Surat Masuk Digital
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan, pemindaian, pengarsipan, dan lembar disposisi digital surat masuk perkantoran.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Cetak Agenda
          </button>
          <button
            id="btn-add-surat-masuk"
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Input Surat Masuk Baru
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'Semua Surat' },
              { id: 'baru', label: 'Surat Baru' },
              { id: 'disposisi', label: 'Didisposisikan' },
              { id: 'diproses', label: 'Diproses' },
              { id: 'selesai', label: 'Selesai' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input & Priority Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nomor, pengirim, perihal..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:bg-white focus:border-blue-500 outline-none text-slate-700"
            >
              <option value="all">Semua Sifat</option>
              <option value="biasa">Biasa</option>
              <option value="penting">Penting</option>
              <option value="sangat_segera">Sangat Segera</option>
              <option value="rahasia">Rahasia</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table of Incoming Letters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">No. Agenda & Surat</th>
                <th className="py-3.5 px-4">Tanggal & Pengirim</th>
                <th className="py-3.5 px-4">Perihal & Berkas</th>
                <th className="py-3.5 px-4">Sifat</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Inbox className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold">Tidak ada surat masuk yang sesuai filter.</p>
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 align-top">
                      <p className="font-bold text-slate-900 font-mono">{item.nomorSurat}</p>
                      <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-mono">
                        {item.nomorAgenda}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <p className="font-bold text-slate-800">{item.asalSurat}</p>
                      <p className="text-[11px] text-slate-400">
                        Surat: {item.tanggalSurat} • Terima: {item.tanggalTerima}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 align-top max-w-xs">
                      <p className="font-bold text-slate-900 line-clamp-2">{item.perihal}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.ringkasanIsi}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                          <FileText className="w-3 h-3 text-slate-400" /> {item.fileName} ({item.fileSize})
                        </span>
                        {item.disposisiCount > 0 && (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-bold">
                            {item.disposisiCount} Disposisi
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <PriorityBadge priority={item.prioritas} />
                    </td>

                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <SuratStatusBadge status={item.status} />
                    </td>

                    <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewItem({ type: 'surat_masuk', data: item })}
                          title="Lihat Pratinjau Dokumen"
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedSuratForDisposisi(item)}
                          title="Beri Lembar Disposisi"
                          className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <GitPullRequest className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedSuratDetail(item)}
                          title="Detail & Riwayat"
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Hapus arsip surat masuk ini?')) {
                              deleteSuratMasuk(item.id);
                            }
                          }}
                          title="Hapus"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Input Surat Masuk Baru */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Registrasi Surat Masuk Digital Baru"
        subtitle="Pencatatan data surat masuk fisik menjadi arsip elektronik digital terpadu"
        maxWidth="3xl"
      >
        <form onSubmit={handleCreateSurat} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Surat Asal *</label>
              <input
                type="text"
                required
                value={formNomor}
                onChange={(e) => setFormNomor(e.target.value)}
                placeholder="Contoh: 045/UND/KEMENKEU/IX/2026"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Instansi / Pengirim Asal *</label>
              <input
                type="text"
                required
                value={formAsal}
                onChange={(e) => setFormAsal(e.target.value)}
                placeholder="Contoh: Kementerian Keuangan RI"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal Surat</label>
              <input
                type="date"
                value={formTglSurat}
                onChange={(e) => setFormTglSurat(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal Diterima</label>
              <input
                type="date"
                value={formTglTerima}
                onChange={(e) => setFormTglTerima(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Sifat & Prioritas</label>
              <Select2
                value={formPrioritas}
                onChange={(val) => setFormPrioritas(val as PriorityLevel)}
                options={[
                  { value: 'biasa', label: 'Biasa (Standar)', badge: 'Normal' },
                  { value: 'penting', label: 'Penting (Prioritas)', badge: 'Prioritas' },
                  { value: 'sangat_segera', label: 'Sangat Segera (Urgent)', badge: 'Urgent' },
                  { value: 'rahasia', label: 'Rahasia (Confidential)', badge: 'Rahasia' }
                ]}
                searchable={false}
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Perihal Surat *</label>
            <input
              type="text"
              required
              value={formPerihal}
              onChange={(e) => setFormPerihal(e.target.value)}
              placeholder="Contoh: Undangan Rapat Koordinasi Tata Kelola Digital"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Ringkasan Isi / Pokok Surat</label>
            <textarea
              rows={3}
              value={formRingkasan}
              onChange={(e) => setFormRingkasan(e.target.value)}
              placeholder="Catatan singkat isi surat yang perlu diketahui pimpinan..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none resize-none"
            />
          </div>

          {/* Target Pimpinan Disposisi */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block font-bold text-slate-800 mb-2">Teruskan / Ajukan Disposisi Kepada:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {users.slice(0, 4).map(u => (
                <label key={u.id} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-blue-50/50">
                  <input
                    type="checkbox"
                    checked={formTargetDisposisi.includes(u.id)}
                    onChange={(e) => {
                      if (e.target.checked) setFormTargetDisposisi([...formTargetDisposisi, u.id]);
                      else setFormTargetDisposisi(formTargetDisposisi.filter(id => id !== u.id));
                    }}
                    className="rounded text-blue-600"
                  />
                  <div>
                    <p className="font-bold text-slate-900">{u.name}</p>
                    <p className="text-[10px] text-slate-500">{u.roleLabel}</p>
                  </div>
                </label>
              ))}
            </div>
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
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
            >
              Simpan & Arsipkan Surat
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Quick Disposisi Sheet */}
      <Modal
        isOpen={!!selectedSuratForDisposisi}
        onClose={() => setSelectedSuratForDisposisi(null)}
        title="Lembar Disposisi Digital Pimpinan"
        subtitle={`Instruksi pimpinan untuk surat No. ${selectedSuratForDisposisi?.nomorSurat}`}
        maxWidth="3xl"
      >
        <form onSubmit={handleCreateDisposisi} className="space-y-4 text-xs font-sans">
          {/* Header Info Surat */}
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
            <p className="text-[11px] text-amber-800 font-bold uppercase tracking-wider">Surat yang Didisposisikan:</p>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">{selectedSuratForDisposisi?.perihal}</p>
            <p className="text-xs text-slate-600 mt-1">
              Dari: <strong>{selectedSuratForDisposisi?.asalSurat}</strong> • No: {selectedSuratForDisposisi?.nomorSurat}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Diteruskan Kepada (Pegawai / Pejabat) *</label>
              <Select2
                value={dispTargetUser}
                onChange={(val) => setDispTargetUser(val)}
                options={users.map(u => ({
                  value: u.id,
                  label: u.name,
                  sublabel: u.roleLabel,
                  badge: u.department
                }))}
                placeholder="Pilih Pejabat Terkait..."
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Batas Waktu Penyelesaian (Deadline)</label>
              <input
                type="date"
                value={dispDeadline}
                onChange={(e) => setDispDeadline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Preset Instruksi Disposisi */}
          <div>
            <label className="block font-bold text-slate-700 mb-2">Instruksi / Arahan Pimpinan (Pilih satu atau lebih):</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {instructionPresets.map(preset => {
                const isChecked = dispInstruksi.includes(preset);
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => toggleInstruction(preset)}
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
            <label className="block font-bold text-slate-700 mb-1">Catatan Khusus Pimpinan</label>
            <textarea
              rows={3}
              value={dispCatatan}
              onChange={(e) => setDispCatatan(e.target.value)}
              placeholder="Tuliskan arahan tambahan secara spesifik..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setSelectedSuratForDisposisi(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" /> Kirim Lembar Disposisi
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Detail Surat & Timeline Riwayat */}
      <Modal
        isOpen={!!selectedSuratDetail}
        onClose={() => setSelectedSuratDetail(null)}
        title="Riwayat & Kronologi Surat Masuk"
        subtitle={`Tracking siklus surat No. ${selectedSuratDetail?.nomorSurat}`}
        maxWidth="2xl"
      >
        <div className="space-y-5 text-xs font-sans">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <p className="font-extrabold text-slate-900 text-sm">{selectedSuratDetail?.perihal}</p>
            <p className="text-slate-500">
              Pengirim: <strong>{selectedSuratDetail?.asalSurat}</strong> • No. Agenda: {selectedSuratDetail?.nomorAgenda}
            </p>
          </div>

          {/* Status Updater */}
          <div className="flex items-center justify-between p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
            <span className="font-bold text-blue-900">Perbarui Status Surat:</span>
            <div className="flex gap-1.5">
              {(['baru', 'disposisi', 'diproses', 'selesai', 'diarsipkan'] as SuratStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    if (selectedSuratDetail) {
                      updateSuratMasukStatus(selectedSuratDetail.id, st);
                      setSelectedSuratDetail({ ...selectedSuratDetail, status: st });
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] capitalize cursor-pointer ${
                    selectedSuratDetail?.status === st
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Log Riwayat Pemrosesan:</h4>
            <div className="border-l-2 border-blue-200 pl-4 space-y-4 ml-2">
              {selectedSuratDetail?.riwayat.map((rw, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                  <p className="font-bold text-slate-800">{rw.aksi}</p>
                  <p className="text-[11px] text-slate-500">Oleh: {rw.oleh} • {rw.tanggal}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
