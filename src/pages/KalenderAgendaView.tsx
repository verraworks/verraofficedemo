import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Building,
  Video,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Printer,
  Trash2,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { useOffice } from '../context/OfficeContext';
import { CalendarEvent } from '../types';
import { Modal } from '../components/common/Modal';

export const KalenderAgendaView: React.FC = () => {
  const {
    events,
    addEvent,
    deleteEvent,
    users
  } = useOffice();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Form State
  const [formJudul, setFormJudul] = useState('');
  const [formTanggal, setFormTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [formMulai, setFormMulai] = useState('09:00');
  const [formSelesai, setFormSelesai] = useState('11:00');
  const [formLokasi, setFormLokasi] = useState('Ruang Rapat Utama (Lantai 3)');
  const [formKategori, setFormKategori] = useState<'rapat' | 'kunjungan' | 'deadline' | 'acara' | 'jadwal_pimpinan'>('rapat');
  const [formTipeLokasi, setFormTipeLokasi] = useState<'ruang_rapat' | 'zoom' | 'luar_kantor'>('ruang_rapat');
  const [formCatatan, setFormCatatan] = useState('');
  const [formLinkMeeting, setFormLinkMeeting] = useState('');

  const filteredList = events.filter((item) => {
    const matchCat = categoryFilter === 'all' || item.kategori === categoryFilter;
    const matchSearch =
      item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.penanggungJawab.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul) return;

    addEvent({
      judul: formJudul,
      tanggal: formTanggal,
      waktuMulai: formMulai,
      waktuSelesai: formSelesai,
      lokasi: formLokasi,
      tipeLokasi: formTipeLokasi,
      kategori: formKategori,
      penanggungJawab: 'Sekretariat Utama',
      departemen: 'Sekretariat',
      peserta: ['Direksi', 'Kepala Unit Terkait'],
      catatan: formCatatan || 'Agenda dinas resmi kantor',
      linkMeeting: formLinkMeeting || undefined
    });

    setIsNewModalOpen(false);
    setFormJudul('');
    setFormCatatan('');
    setFormLinkMeeting('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-600" />
            Agenda & Kalender Kerja Kantor
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sinkronisasi jadwal rapat pimpinan, audiensi eksternal, reservasi ruangan, dan deadline laporan instansi.
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
            id="btn-add-agenda"
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tambah Agenda Baru
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Semua Agenda' },
            { id: 'rapat', label: 'Rapat Internal' },
            { id: 'kunjungan', label: 'Audiensi / Tamu' },
            { id: 'deadline', label: 'Deadline' },
            { id: 'acara', label: 'Acara Kantor' },
            { id: 'jadwal_pimpinan', label: 'Jadwal Pimpinan' }
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
            placeholder="Cari judul agenda, lokasi, penyelenggara..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredList.length === 0 ? (
          <div className="col-span-3 bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            <CalendarIcon className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold">Tidak ada agenda yang terdaftar pada filter ini.</p>
          </div>
        ) : (
          filteredList.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md p-5 transition-all flex flex-col justify-between space-y-4"
            >
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200">
                    {ev.kategori.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    {ev.waktuMulai} - {ev.waktuSelesai} WIB
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm mt-1">{ev.judul}</h4>
                {ev.catatan && <p className="text-xs text-slate-500 line-clamp-2">{ev.catatan}</p>}
              </div>

              {/* Location & Participants */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="font-semibold truncate">{ev.lokasi}</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Peserta: {ev.peserta.join(', ')}</span>
                </div>

                {ev.linkMeeting && (
                  <a
                    href={ev.linkMeeting}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 mt-1"
                  >
                    <Video className="w-3.5 h-3.5" /> Gabung Link Meeting Virtual
                  </a>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-[11px] font-bold text-indigo-900 bg-indigo-50/60 px-2 py-0.5 rounded">
                  📅 {ev.tanggal}
                </span>

                <button
                  onClick={() => {
                    if (confirm('Hapus jadwal agenda ini?')) {
                      deleteEvent(ev.id);
                    }
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Hapus Agenda"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Tambah Agenda Baru */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Jadwalkan Agenda Rapat / Acara Kantor Baru"
        subtitle="Agenda akan disinkronisasikan ke kalender pimpinan dan seluruh peserta rapat"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama / Topik Agenda *</label>
            <input
              type="text"
              required
              value={formJudul}
              onChange={(e) => setFormJudul(e.target.value)}
              placeholder="Contoh: Rapat Koordinasi Evaluasi Anggaran Triwulan III"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal</label>
              <input
                type="date"
                value={formTanggal}
                onChange={(e) => setFormTanggal(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Waktu Mulai</label>
              <input
                type="time"
                value={formMulai}
                onChange={(e) => setFormMulai(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Waktu Selesai</label>
              <input
                type="time"
                value={formSelesai}
                onChange={(e) => setFormSelesai(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori Agenda</label>
              <select
                value={formKategori}
                onChange={(e) => setFormKategori(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-indigo-500"
              >
                <option value="rapat">Rapat Internal</option>
                <option value="kunjungan">Audiensi / Kunjungan Tamu</option>
                <option value="deadline">Deadline Laporan / Tugas</option>
                <option value="acara">Acara Resmi Instansi</option>
                <option value="jadwal_pimpinan">Jadwal Pimpinan</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Lokasi / Ruangan</label>
              <input
                type="text"
                value={formLokasi}
                onChange={(e) => setFormLokasi(e.target.value)}
                placeholder="Contoh: Ruang Rapat Pimpinan / Zoom Meeting"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Link Virtual Meeting (Opsional)</label>
            <input
              type="text"
              value={formLinkMeeting}
              onChange={(e) => setFormLinkMeeting(e.target.value)}
              placeholder="https://zoom.us/j/987654321 atau Google Meet"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Uraian / Pokok Pembahasan</label>
            <textarea
              rows={3}
              value={formCatatan}
              onChange={(e) => setFormCatatan(e.target.value)}
              placeholder="Catatan agenda yang akan dibahas..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none resize-none"
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
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs"
            >
              Simpan ke Kalender
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
