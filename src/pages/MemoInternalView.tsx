import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Printer,
  Trash2,
  Users,
  AlertTriangle,
  Building,
  Send
} from 'lucide-react';
import { useOffice } from '../context/OfficeContext';
import { MemoInternal, PriorityLevel } from '../types';
import { PriorityBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Select2 } from '../components/common/Select2';
import { TinyMCEEditor } from '../components/common/TinyMCEEditor';

export const MemoInternalView: React.FC = () => {
  const {
    memos,
    addMemo,
    markMemoAsRead,
    departments,
    currentUser,
    users
  } = useOffice();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedMemoDetail, setSelectedMemoDetail] = useState<MemoInternal | null>(null);

  // Form State
  const [formJudul, setFormJudul] = useState('');
  const [formKategori, setFormKategori] = useState<'pengumuman' | 'surat_edaran' | 'kebijakan' | 'darurat'>('pengumuman');
  const [formTarget, setFormTarget] = useState<'semua' | 'departemen' | 'spesifik'>('semua');
  const [formDeptTarget, setFormDeptTarget] = useState<string[]>([]);
  const [formPrioritas, setFormPrioritas] = useState<PriorityLevel>('biasa');
  const [formIsi, setFormIsi] = useState('');

  const filteredList = memos.filter((item) => {
    const matchCat = categoryFilter === 'all' || item.kategori === categoryFilter;
    const matchSearch =
      item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.isiMemo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pengirimNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nomorMemo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCreateMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul || !formIsi) return;

    addMemo({
      nomorMemo: `MEMO/INT/${Date.now().toString().slice(-4)}/2026`,
      judul: formJudul,
      pengirimId: currentUser?.id || 'usr-1',
      pengirimNama: currentUser?.name || 'Sekretariat Utama',
      pengirimJabatan: currentUser?.roleLabel || 'Pimpinan',
      tujuan: formTarget,
      targetDepartemen: formTarget === 'departemen' ? formDeptTarget : undefined,
      kategori: formKategori,
      prioritas: formPrioritas,
      isiMemo: formIsi,
      lampiranName: 'Lampiran_Pedoman_Operasional.pdf'
    });

    setIsNewModalOpen(false);
    setFormJudul('');
    setFormIsi('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-indigo-600" />
            Memo Internal & Surat Edaran Kantor
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Komunikasi resmi internal, pengumuman hari libur, kebijakan operasional, dan surat edaran pimpinan.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Cetak Rekap
          </button>
          <button
            id="btn-add-memo"
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Terbitkan Memo Baru
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Semua Memo' },
            { id: 'pengumuman', label: 'Pengumuman' },
            { id: 'surat_edaran', label: 'Surat Edaran' },
            { id: 'kebijakan', label: 'Kebijakan' },
            { id: 'darurat', label: 'Darurat' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
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
            placeholder="Cari judul memo, pengirim, isi..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Memo List Cards */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            <Megaphone className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold">Belum ada memo pada kategori ini.</p>
          </div>
        ) : (
          filteredList.map((memo) => (
            <div
              key={memo.id}
              className={`bg-white rounded-2xl border shadow-xs p-5 transition-all space-y-3.5 hover:shadow-md ${
                memo.kategori === 'darurat' ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {memo.nomorMemo}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                      {memo.kategori.replace('_', ' ')}
                    </span>
                    <PriorityBadge priority={memo.prioritas} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">{memo.judul}</h4>
                </div>

                <div className="text-left sm:text-right text-xs">
                  <p className="font-bold text-slate-800">{memo.pengirimNama}</p>
                  <p className="text-slate-400 text-[11px]">{memo.pengirimJabatan} • {memo.tanggal}</p>
                </div>
              </div>

              {/* Memo Content */}
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                {memo.isiMemo}
              </p>

              {/* Target & Read Status */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Target: <strong>{memo.tujuan === 'semua' ? 'Seluruh Pegawai' : 'Unit Tertentu'}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      markMemoAsRead(memo.id);
                      setSelectedMemoDetail(memo);
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Detail Pembaca ({memo.dibacaOleh.length})
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Terbitkan Memo Baru */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Terbitkan Memo Internal / Surat Edaran Baru"
        subtitle="Informasi akan langsung tersiar ke seluruh pegawai dan tersimpan dalam e-arsip"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateMemo} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Judul Pokok Memo *</label>
            <input
              type="text"
              required
              value={formJudul}
              onChange={(e) => setFormJudul(e.target.value)}
              placeholder="Contoh: Penyesuaian Jam Kerja Operasional Selama Kegiatan Audit Mutu"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori Memo</label>
              <Select2
                value={formKategori}
                onChange={(val) => setFormKategori(val)}
                options={[
                  { value: 'pengumuman', label: 'Pengumuman Umum', badge: 'Umum' },
                  { value: 'surat_edaran', label: 'Surat Edaran', badge: 'Edaran' },
                  { value: 'kebijakan', label: 'Kebijakan Baru', badge: 'Aturan' },
                  { value: 'darurat', label: 'Pemberitahuan Darurat', badge: 'Penting' }
                ]}
                searchable={false}
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Penerima</label>
              <Select2
                value={formTarget}
                onChange={(val) => setFormTarget(val)}
                options={[
                  { value: 'semua', label: 'Semua Karyawan', badge: 'All Staff' },
                  { value: 'departemen', label: 'Departemen Tertentu', badge: 'Unit' },
                  { value: 'spesifik', label: 'Pimpinan / Pejabat Saja', badge: 'VIP' }
                ]}
                searchable={false}
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tingkat Urgensi</label>
              <Select2
                value={formPrioritas}
                onChange={(val) => setFormPrioritas(val as PriorityLevel)}
                options={[
                  { value: 'biasa', label: 'Biasa (Standar)', badge: 'Normal' },
                  { value: 'penting', label: 'Penting (Prioritas)', badge: 'Prioritas' },
                  { value: 'sangat_segera', label: 'Sangat Segera (Urgent)', badge: 'Urgent' }
                ]}
                searchable={false}
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Naskah Isi Memo Lengkap (TinyMCE WYSIWYG) *</label>
            <TinyMCEEditor
              value={formIsi}
              onChange={(val) => setFormIsi(val)}
              placeholder="Tuliskan butir-butir pengumuman atau instruksi internal secara detail..."
              minHeight="180px"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsNewModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" /> Siarkan Memo
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Detail Pembaca */}
      <Modal
        isOpen={!!selectedMemoDetail}
        onClose={() => setSelectedMemoDetail(null)}
        title="Daftar Pembaca Memo Internal"
        subtitle={selectedMemoDetail?.judul}
        maxWidth="md"
      >
        <div className="space-y-3 text-xs">
          <p className="text-slate-600">
            Daftar pegawai yang telah membuka dan membaca pengumuman ini secara digital:
          </p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedMemoDetail?.dibacaOleh.map((read, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-bold text-slate-800">{read.userName}</p>
                  <p className="text-[10px] text-slate-500">{read.waktu}</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Telah Membaca
                </span>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};
