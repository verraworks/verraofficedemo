import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  QrCode,
  UserCheck,
  Building,
  Phone,
  Eye,
  LogOut,
  Users
} from 'lucide-react';
import { useOffice } from '../context/OfficeContext';
import { GuestBookEntry } from '../types';
import { Modal } from '../components/common/Modal';
import { Select2 } from '../components/common/Select2';

export const BukuTamuView: React.FC = () => {
  const {
    guestBook,
    checkInGuest,
    checkOutGuest,
    users
  } = useOffice();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedPassBadge, setSelectedPassBadge] = useState<GuestBookEntry | null>(null);

  // Form State
  const [formNama, setFormNama] = useState('');
  const [formInstansi, setFormInstansi] = useState('');
  const [formKontak, setFormKontak] = useState('0812-');
  const [formKeperluan, setFormKeperluan] = useState('');
  const [formTargetPerson, setFormTargetPerson] = useState(users[0]?.name || 'Dr. Ir. Hendra Wijaya, M.M.');

  const filteredGuests = guestBook.filter((item) => {
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchSearch =
      (item.namaTamu?.toLowerCase() || '').includes(term) ||
      (item.instansi?.toLowerCase() || '').includes(term) ||
      (item.keperluan?.toLowerCase() || '').includes(term) ||
      (item.orangDituju?.toLowerCase() || '').includes(term);
    return matchStatus && matchSearch;
  });

  const handleRegisterGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama || !formInstansi || !formKeperluan) return;

    const newGuest = checkInGuest({
      namaTamu: formNama,
      instansi: formInstansi,
      kontak: formKontak,
      keperluan: formKeperluan,
      orangDituju: formTargetPerson,
      departemenDituju: 'Direksi & Manajemen',
      catatan: 'Registrasi mandiri di resepsionis'
    });

    setIsNewModalOpen(false);
    setSelectedPassBadge(newGuest);
    setFormNama('');
    setFormInstansi('');
    setFormKeperluan('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            Buku Tamu Digital & Resepsionis Kantor
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registrasi tamu kunjungan tanpa kertas, pencetakan ID visitor pass elektronik, dan notifikasi kedatangan tamu ke pimpinan.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Cetak Log Buku Tamu
          </button>
          <button
            id="btn-add-guest"
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Registrasi Tamu Baru
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Semua Tamu' },
            { id: 'menunggu', label: 'Menunggu di Lobby' },
            { id: 'sedang_bertemu', label: 'Sedang Bertemu' },
            { id: 'selesai', label: 'Telah Check-out' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
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
            placeholder="Cari nama tamu, instansi, yang dituju..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* Table of Guests */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Nama Tamu & ID Badge</th>
                <th className="py-3.5 px-4">Instansi & Kontak</th>
                <th className="py-3.5 px-4">Keperluan & Pejabat Dituju</th>
                <th className="py-3.5 px-4">Waktu Kunjungan</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <BookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold">Belum ada data kunjungan tamu hari ini.</p>
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 align-top">
                      <p className="font-bold text-slate-900">{guest.namaTamu}</p>
                      <span className="text-[10px] text-slate-500 bg-slate-100 font-mono px-1.5 py-0.5 rounded">
                        Badge: {guest.nomorBadge}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <p className="font-bold text-slate-800">{guest.instansi}</p>
                      <p className="text-[11px] text-slate-500">{guest.kontak}</p>
                    </td>

                    <td className="py-3.5 px-4 align-top max-w-xs">
                      <p className="text-slate-800 font-semibold">{guest.keperluan}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Menemui: <strong className="text-slate-700">{guest.orangDituju}</strong>
                      </p>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <p className="font-mono text-slate-700">Masuk: {guest.waktuDatang} WIB</p>
                      {guest.waktuKeluar && <p className="font-mono text-slate-400 text-[11px]">Keluar: {guest.waktuKeluar} WIB</p>}
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          guest.status === 'menunggu'
                            ? 'bg-amber-100 text-amber-800'
                            : guest.status === 'sedang_bertemu'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {guest.status === 'menunggu' ? '⏳ Menunggu Lobby' : guest.status === 'sedang_bertemu' ? '💬 Sedang Bertemu' : '✓ Telah Selesai'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedPassBadge(guest)}
                          title="Cetak ID Visitor Pass"
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        {guest.status !== 'selesai' && (
                          <button
                            onClick={() => checkOutGuest(guest.id)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <LogOut className="w-3 h-3" /> Check-out
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Registrasi Tamu Baru */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Registrasi Tamu / Resepsionis Digital"
        subtitle="Sistem akan mencatat log kehadiran dan menerbitkan tiket Visitor Pass QR"
        maxWidth="2xl"
      >
        <form onSubmit={handleRegisterGuest} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Tamu *</label>
              <input
                type="text"
                required
                value={formNama}
                onChange={(e) => setFormNama(e.target.value)}
                placeholder="Contoh: Ir. Bambang Sujarwo"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Instansi / Perusahaan Asal *</label>
              <input
                type="text"
                required
                value={formInstansi}
                onChange={(e) => setFormInstansi(e.target.value)}
                placeholder="Contoh: PT Telkom Indonesia Tbk"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp / HP</label>
              <input
                type="text"
                value={formKontak}
                onChange={(e) => setFormKontak(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Pejabat yang Dituju</label>
              <Select2
                value={formTargetPerson}
                onChange={(val) => setFormTargetPerson(val)}
                options={users.map(u => ({
                  value: u.name,
                  label: u.name,
                  sublabel: u.roleLabel,
                  badge: u.department
                }))}
                placeholder="Cari nama pejabat..."
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Maksud & Keperluan Kunjungan *</label>
            <textarea
              rows={3}
              required
              value={formKeperluan}
              onChange={(e) => setFormKeperluan(e.target.value)}
              placeholder="Contoh: Presentasi proposal integrasi infrastruktur cloud enterprise..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none resize-none"
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
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
            >
              Check-in Tamu & Buat Pass
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Visitor Pass Badge */}
      <Modal
        isOpen={!!selectedPassBadge}
        onClose={() => setSelectedPassBadge(null)}
        title="Visitor Pass ID Card Digital"
        subtitle="Kartu tanda pengenal tamu resmi untuk akses gerbang & lobby kantor"
        maxWidth="sm"
      >
        <div className="space-y-4 text-center font-sans">
          {/* Badge Card */}
          <div className="bg-gradient-to-b from-blue-700 to-indigo-900 text-white p-6 rounded-2xl shadow-md border border-blue-500 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-white/20 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">VERRAOFFICE VISITOR</span>
              <span className="text-[10px] bg-emerald-500 text-white font-extrabold px-2 py-0.5 rounded-full">ACTIVE</span>
            </div>

            <div className="bg-white p-3 rounded-xl inline-block mb-3 shadow-inner">
              <div className="w-24 h-24 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs font-mono">
                [QR-{selectedPassBadge?.nomorBadge}]
              </div>
            </div>

            <h3 className="text-base font-extrabold text-white">{selectedPassBadge?.namaTamu}</h3>
            <p className="text-xs text-blue-200 font-medium">{selectedPassBadge?.instansi}</p>

            <div className="mt-4 pt-3 border-t border-white/20 text-[11px] text-blue-100 space-y-1 text-left">
              <div className="flex justify-between">
                <span>Tujuan:</span>
                <strong className="text-white">{selectedPassBadge?.orangDituju}</strong>
              </div>
              <div className="flex justify-between">
                <span>Jam Masuk:</span>
                <strong className="text-white">{selectedPassBadge?.waktuDatang} WIB</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak Badge Tamu
            </button>
            <button
              onClick={() => setSelectedPassBadge(null)}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
