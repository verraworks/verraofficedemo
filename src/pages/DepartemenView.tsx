import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Users,
  MapPin,
  Mail,
  ShieldCheck,
  Edit2,
  Trash2,
  FileText
} from 'lucide-react';
import { useOffice } from '../context/OfficeContext';
import { Department } from '../types';
import { Modal } from '../components/common/Modal';

export const DepartemenView: React.FC = () => {
  const {
    departments,
    users
  } = useOffice();

  const [searchTerm, setSearchTerm] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Form State
  const [formNama, setFormNama] = useState('');
  const [formKode, setFormKode] = useState('');
  const [formKepala, setFormKepala] = useState('');
  const [formLokasi, setFormLokasi] = useState('Gedung Utama Lantai 2');
  const [formEmail, setFormEmail] = useState('');

  const filteredDepts = departments.filter(d =>
    d.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.kepala.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-600" />
            Struktur Departemen & Unit Kerja
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen unit organisasi, kode klasifikasi surat per unit, dan penanggung jawab divisi.
          </p>
        </div>

        <button
          id="btn-add-dept"
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Tambah Unit Kerja
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama departemen, kode unit, kepala divisi..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDepts.map((dept) => {
          const deptMembers = users.filter(u => u.department === dept.nama);
          return (
            <div
              key={dept.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-md p-5 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                    KODE: {dept.kode}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full">
                    <Users className="w-3 h-3 text-slate-400" /> {dept.jumlahStaff || deptMembers.length || 5} Pegawai
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{dept.nama}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {dept.lokasi}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kepala Unit:</span>
                    <strong className="text-slate-800">{dept.kepala}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email Resmi:</span>
                    <span className="text-indigo-600 font-mono text-[11px]">{dept.email}</span>
                  </div>
                </div>
              </div>

              {/* Members Preview */}
              <div className="pt-3 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Anggota Divisi</p>
                <div className="flex items-center -space-x-1.5 overflow-hidden">
                  {deptMembers.slice(0, 4).map((member, i) => (
                    <img
                      key={member.id}
                      src={member.avatar}
                      alt={member.name}
                      title={member.name}
                      className="w-7 h-7 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                  {deptMembers.length > 4 && (
                    <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">
                      +{deptMembers.length - 4}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Tambah Departemen */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Tambah Unit Organisasi / Departemen Baru"
        subtitle="Unit kerja baru akan langsung aktif dalam pilihan disposisi dan penomoran surat"
        maxWidth="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); setIsNewModalOpen(false); }} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Departemen / Unit Kerja *</label>
            <input
              type="text"
              required
              value={formNama}
              onChange={(e) => setFormNama(e.target.value)}
              placeholder="Contoh: Divisi Keamanan Informasi & Siber"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kode Klasifikasi Unit *</label>
              <input
                type="text"
                required
                value={formKode}
                onChange={(e) => setFormKode(e.target.value)}
                placeholder="Contoh: SEC"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none uppercase font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kepala Unit / Divisi</label>
              <input
                type="text"
                value={formKepala}
                onChange={(e) => setFormKepala(e.target.value)}
                placeholder="Nama Pejabat"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Lokasi Ruangan / Lantai</label>
            <input
              type="text"
              value={formLokasi}
              onChange={(e) => setFormLokasi(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none"
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
              Simpan Unit Kerja
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
