import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Shield,
  CheckCircle2,
  Key,
  Building,
  Mail,
  UserCheck,
  Edit2,
  Trash2,
  Sparkles
} from 'lucide-react';
import { useOffice } from '../context/OfficeContext';
import { User, UserRole } from '../types';
import { Modal } from '../components/common/Modal';

export const PenggunaView: React.FC = () => {
  const {
    users,
    currentUser,
    switchUser,
    departments
  } = useOffice();

  const [searchTerm, setSearchTerm] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formNip, setFormNip] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('staf');
  const [formDept, setFormDept] = useState(departments[0]?.nama || 'Sekretariat');

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.roleLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const permissionsMatrix = [
    { module: 'Dashboard & Statistik', superadmin: true, pimpinan: true, hr: true, keuangan: true, staf: true, admin_surat: true },
    { module: 'Input Surat Masuk & Registrasi Agenda', superadmin: true, pimpinan: true, hr: false, keuangan: false, staf: false, admin_surat: true },
    { module: 'Penerbitan Lembar Disposisi Pimpinan', superadmin: true, pimpinan: true, hr: false, keuangan: false, staf: false, admin_surat: false },
    { module: 'Pembubuhan Tanda Tangan E-Sign Resmi', superadmin: true, pimpinan: true, hr: true, keuangan: true, staf: false, admin_surat: false },
    { module: 'Approval & Otorisasi Pengajuan Dana / Cuti', superadmin: true, pimpinan: true, hr: true, keuangan: true, staf: false, admin_surat: false },
    { module: 'Pengisian E-Formulir Digital', superadmin: true, pimpinan: true, hr: true, keuangan: true, staf: true, admin_surat: true },
    { module: 'Akses Repositori E-Arsip Rahasia', superadmin: true, pimpinan: true, hr: false, keuangan: false, staf: false, admin_surat: false },
    { module: 'Buku Tamu Digital & Resepsionis', superadmin: true, pimpinan: true, hr: true, keuangan: false, staf: true, admin_surat: true },
    { module: 'Manajemen Pengguna & Konfigurasi Sistem', superadmin: true, pimpinan: false, hr: false, keuangan: false, staf: false, admin_surat: false }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Manajemen Pengguna & Hak Akses (RBAC)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengaturan akun pegawai, struktur peran (Role-Based Access Control), dan hak otorisasi naskah dinas.
          </p>
        </div>

        <button
          id="btn-add-user"
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Tambah Pegawai Baru
        </button>
      </div>

      {/* Users Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900">Daftar Pegawai & Pejabat Kantor ({users.length})</h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama, NIP, peran..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Pegawai</th>
                <th className="py-3.5 px-4">NIP & Kontak</th>
                <th className="py-3.5 px-4">Unit / Departemen</th>
                <th className="py-3.5 px-4">Role & Hak Akses</th>
                <th className="py-3.5 px-4">Status Akun</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const isCurrent = currentUser?.id === u.id;
                return (
                  <tr key={u.id} className={isCurrent ? 'bg-blue-50/40' : 'hover:bg-slate-50/60 transition-colors'}>
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                        <div>
                          <p className="font-bold text-slate-900 flex items-center gap-1.5">
                            {u.name}
                            {isCurrent && (
                              <span className="text-[10px] bg-blue-600 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                                Akun Anda
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-middle">
                      <p className="font-mono text-slate-800">{u.nip || '-'}</p>
                      <p className="text-[11px] text-slate-400">{u.phone || '-'}</p>
                    </td>

                    <td className="py-3.5 px-4 align-middle">
                      <p className="font-semibold text-slate-800">{u.department}</p>
                    </td>

                    <td className="py-3.5 px-4 align-middle">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200">
                        <Shield className="w-3 h-3 text-blue-600" />
                        {u.roleLabel}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 align-middle">
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Aktif
                      </span>
                    </td>

                    <td className="py-3.5 px-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isCurrent && (
                          <button
                            onClick={() => switchUser(u.id)}
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Masuk Sebagai
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC Matrix Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Matriks Hak Akses Peran (Permission Matrix)</h3>
          <p className="text-xs text-slate-500">Standarisasi otorisasi modul berdasarkan peran jabatan perkantoran</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold text-[11px]">
              <tr>
                <th className="py-3 px-4">Fitur / Modul</th>
                <th className="py-3 px-4 text-center">Super Admin</th>
                <th className="py-3 px-4 text-center">Pimpinan</th>
                <th className="py-3 px-4 text-center">HRD</th>
                <th className="py-3 px-4 text-center">Keuangan</th>
                <th className="py-3 px-4 text-center">Staf</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionsMatrix.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-semibold text-slate-900">{p.module}</td>
                  <td className="py-2.5 px-4 text-center">{p.superadmin ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">-</span>}</td>
                  <td className="py-2.5 px-4 text-center">{p.pimpinan ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">-</span>}</td>
                  <td className="py-2.5 px-4 text-center">{p.hr ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">-</span>}</td>
                  <td className="py-2.5 px-4 text-center">{p.keuangan ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">-</span>}</td>
                  <td className="py-2.5 px-4 text-center">{p.staf ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">-</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Tambah User */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Pendaftaran Akun Pegawai Baru"
        subtitle="Pegawai akan diberikan akses login sistem dan sertifikat tanda tangan digital"
        maxWidth="md"
      >
        <form onSubmit={(e) => { e.preventDefault(); alert('Pegawai baru berhasil didaftarkan ke sistem!'); setIsNewModalOpen(false); }} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Contoh: Rahmat Hidayat, S.Kom."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Resmi Kantor *</label>
            <input
              type="email"
              required
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="rahmat@verraoffice.id"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Peran / Role Akses</label>
              <select
                value={formRole}
                onChange={(e) => setFormRole(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500"
              >
                <option value="pimpinan">Pimpinan</option>
                <option value="hr">HRD</option>
                <option value="keuangan">Keuangan</option>
                <option value="staf">Staf Pelaksana</option>
                <option value="admin_surat">Admin Tata Usaha</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Departemen</label>
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
              Simpan Akun Pegawai
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
