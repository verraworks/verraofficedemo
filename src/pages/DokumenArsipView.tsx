import React, { useState } from 'react';
import {
  FolderLock,
  Plus,
  Search,
  Filter,
  Eye,
  Download,
  FileText,
  FileSpreadsheet,
  FileCode,
  Tag,
  Shield,
  Trash2,
  Clock,
  Layers,
  Sparkles,
  Printer
} from 'lucide-react';
import { useOffice } from '../context/OfficeContext';
import { DokumenArsip } from '../types';
import { Modal } from '../components/common/Modal';

export const DokumenArsipView: React.FC = () => {
  const {
    dokumen,
    addDokumen,
    deleteDokumen,
    incrementDownloadCount,
    departments,
    currentUser,
    setPreviewItem
  } = useOffice();

  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedKategori, setSelectedKategori] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Form State
  const [formJudul, setFormJudul] = useState('');
  const [formKategori, setFormKategori] = useState('SOP & Prosedur');
  const [formDept, setFormDept] = useState(departments[0]?.nama || 'Sekretariat & Tata Usaha');
  const [formAkses, setFormAkses] = useState<'publik' | 'internal' | 'rahasia' | 'terbatas'>('internal');
  const [formTags, setFormTags] = useState('SOP, Digital, 2026');
  const [formDeskripsi, setFormDeskripsi] = useState('');
  const [formFormat, setFormFormat] = useState('pdf');

  const filteredList = dokumen.filter((item) => {
    const matchDept = selectedDept === 'all' || item.departemen === selectedDept;
    const matchKategori = selectedKategori === 'all' || item.kategori === selectedKategori;
    const matchSearch =
      item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nomorDokumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchDept && matchKategori && matchSearch;
  });

  const handleCreateDokumen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul) return;

    addDokumen({
      nomorDokumen: `DOC/E-ARSIP/${Date.now().toString().slice(-4)}`,
      judul: formJudul,
      kategori: formKategori,
      departemen: formDept,
      pengunggahId: currentUser?.id || 'usr-1',
      pengunggahNama: currentUser?.name || 'Administrator',
      tanggalUnggah: new Date().toISOString().slice(0, 10),
      fileFormat: formFormat,
      fileSize: '2.4 MB',
      fileUrl: '#',
      versi: '1.0',
      tingkatAkses: formAkses,
      tags: formTags.split(',').map(t => t.trim()).filter(Boolean),
      deskripsi: formDeskripsi || 'Dokumen arsip digital resmi tersimpan dalam repositori institusi.'
    });

    setIsNewModalOpen(false);
    setFormJudul('');
    setFormDeskripsi('');
  };

  const getFormatIcon = (format: string) => {
    if (format === 'pdf') return <FileText className="w-5 h-5 text-rose-600" />;
    if (format === 'xlsx' || format === 'xls') return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    if (format === 'docx' || format === 'doc') return <FileText className="w-5 h-5 text-blue-600" />;
    return <FileCode className="w-5 h-5 text-indigo-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderLock className="w-6 h-6 text-blue-600" />
            E-Archive & Dokumen Manajemen (DMS)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Penyimpanan terpusat dokumen digital, SOP institusi, kontrak kerja sama, SK pimpinan, dan berkas terenkripsi.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Cetak Indeks Arsip
          </button>
          <button
            id="btn-upload-dokumen"
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Unggah Arsip Dokumen Baru
          </button>
        </div>
      </div>

      {/* Department Quick Filter Badges */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedDept('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedDept === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          Semua Departemen ({dokumen.length})
        </button>
        {departments.map(d => {
          const count = dokumen.filter(doc => doc.departemen === d.nama).length;
          return (
            <button
              key={d.id}
              onClick={() => setSelectedDept(d.nama)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedDept === d.nama
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span>{d.nama}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedDept === d.nama ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Semua Kategori' },
            { id: 'SOP & Kebijakan', label: 'SOP & Prosedur' },
            { id: 'Perjanjian & Legal', label: 'Kontrak / Legal' },
            { id: 'Keuangan & Audit', label: 'Keuangan & Audit' },
            { id: 'SDM & Personalia', label: 'SDM & HR' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedKategori(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedKategori === cat.id
                  ? 'bg-blue-100 text-blue-800 font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari judul dokumen, nomor, tag..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Document Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredList.length === 0 ? (
          <div className="col-span-3 bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            <FolderLock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold">Tidak ada arsip dokumen yang ditemukan.</p>
          </div>
        ) : (
          filteredList.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 shadow-xs hover:shadow-md p-5 transition-all flex flex-col justify-between space-y-4 group"
            >
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-100 group-hover:bg-blue-50 transition-colors">
                    {getFormatIcon(doc.fileFormat)}
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      doc.tingkatAkses === 'rahasia'
                        ? 'bg-rose-100 text-rose-800'
                        : doc.tingkatAkses === 'terbatas'
                        ? 'bg-amber-100 text-amber-800'
                        : doc.tingkatAkses === 'publik'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {doc.tingkatAkses}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-400">{doc.nomorDokumen}</span>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-2 mt-0.5">{doc.judul}</h4>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2">{doc.deskripsi}</p>
              </div>

              {/* Tags & Metadata */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap gap-1">
                  {doc.tags.map((tg, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      #{tg}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{doc.departemen}</span>
                  <span>v{doc.versi} • {doc.fileSize}</span>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setPreviewItem({ type: 'dokumen', data: doc })}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Pratinjau
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        incrementDownloadCount(doc.id);
                        alert(`Mengunduh file: ${doc.judul}.${doc.fileFormat}`);
                      }}
                      title="Unduh Berkas Arsip"
                      className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Hapus dokumen arsip ini?')) {
                          deleteDokumen(doc.id);
                        }
                      }}
                      title="Hapus"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Unggah Dokumen Arsip */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Unggah Dokumen ke Repositori E-Arsip"
        subtitle="Dokumen akan terenkripsi dan dapat dicari secara full-text"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateDokumen} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Judul Dokumen Resmi *</label>
            <input
              type="text"
              required
              value={formJudul}
              onChange={(e) => setFormJudul(e.target.value)}
              placeholder="Contoh: Pedoman Operasional Standar (SOP) Keamanan Siber 2026"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Departemen / Unit Pemilik</label>
              <select
                value={formDept}
                onChange={(e) => setFormDept(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.nama}>{d.nama}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori Dokumen</label>
              <select
                value={formKategori}
                onChange={(e) => setFormKategori(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500"
              >
                <option value="SOP & Kebijakan">SOP & Prosedur</option>
                <option value="Perjanjian & Legal">Kontrak / MoU Legal</option>
                <option value="Keuangan & Audit">Keuangan & Audit</option>
                <option value="SDM & Personalia">SDM & HR</option>
                <option value="Laporan Tahunan">Laporan Tahunan / Manajerial</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tingkat Akses Dokumen</label>
              <select
                value={formAkses}
                onChange={(e) => setFormAkses(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500"
              >
                <option value="internal">Internal (Seluruh Karyawan)</option>
                <option value="terbatas">Terbatas (Khusus Departemen)</option>
                <option value="rahasia">Rahasia (Pimpinan Saja)</option>
                <option value="publik">Publik (Dapat Dibagikan Luar)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Format File</label>
              <select
                value={formFormat}
                onChange={(e) => setFormFormat(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500"
              >
                <option value="pdf">PDF Document (.pdf)</option>
                <option value="docx">Microsoft Word (.docx)</option>
                <option value="xlsx">Microsoft Excel (.xlsx)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tagar / Kata Kunci (Pisahkan dengan koma)</label>
            <input
              type="text"
              value={formTags}
              onChange={(e) => setFormTags(e.target.value)}
              placeholder="SOP, IT, Pedoman, 2026"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Deskripsi Singkat Dokumen</label>
            <textarea
              rows={3}
              value={formDeskripsi}
              onChange={(e) => setFormDeskripsi(e.target.value)}
              placeholder="Penjelasan pokok isi dokumen..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsNewModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs"
            >
              Simpan ke E-Arsip
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
