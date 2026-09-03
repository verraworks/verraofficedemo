import React, { useState } from 'react';
import {
  User as UserIcon,
  Shield,
  Key,
  Mail,
  Phone,
  Building,
  Stamp,
  CheckCircle2,
  Lock,
  Save,
  Clock,
  Sparkles
} from 'lucide-react';
import { useOffice } from '../context/OfficeContext';
import { DigitalSignaturePad } from '../components/common/DigitalSignaturePad';

export const ProfilView: React.FC = () => {
  const {
    currentUser,
    suratKeluar,
    disposisi,
    formSubmissions
  } = useOffice();

  const [pinCode, setPinCode] = useState('123456');
  const [phone, setPhone] = useState(currentUser?.phone || '0812-3456-7890');
  const [successMsg, setSuccessMsg] = useState(false);

  const mySubmissions = formSubmissions.filter(f => f.pemohonId === currentUser?.id);
  const myDispositions = disposisi.filter(d => d.tujuanId === currentUser?.id);
  const mySignedLetters = suratKeluar.filter(s => s.penandatanganId === currentUser?.id && s.status === 'ditandatangani');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UserIcon className="w-6 h-6 text-blue-600" />
            Profil Pegawai & Sertifikat Tanda Tangan Digital
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Informasi identitas kedinasan, pengaturan PIN keamanan otorisasi naskah, dan spesimen e-signature.
          </p>
        </div>

        {successMsg && (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Profil Anda berhasil diperbarui!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Profile Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-center space-y-4">
            <div className="relative inline-block">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-50 shadow-sm mx-auto"
              />
              <span className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px]">
                ✓
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-base">{currentUser?.name}</h3>
              <p className="text-xs font-semibold text-blue-600 mt-0.5">{currentUser?.roleLabel}</p>
              <p className="text-[11px] text-slate-500">{currentUser?.department}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">NIP:</span>
                <span className="font-mono font-bold text-slate-800">{currentUser?.nip}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="text-slate-700 font-semibold">{currentUser?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hak Akses:</span>
                <span className="font-bold text-blue-700 capitalize">{currentUser?.role}</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
              <div className="p-2 bg-blue-50/60 rounded-xl">
                <p className="text-base font-extrabold text-blue-700">{mySubmissions.length}</p>
                <p className="text-[10px] text-slate-500 font-medium">Pengajuan</p>
              </div>
              <div className="p-2 bg-indigo-50/60 rounded-xl">
                <p className="text-base font-extrabold text-indigo-700">{myDispositions.length}</p>
                <p className="text-[10px] text-slate-500 font-medium">Disposisi</p>
              </div>
              <div className="p-2 bg-purple-50/60 rounded-xl">
                <p className="text-base font-extrabold text-purple-700">{mySignedLetters.length}</p>
                <p className="text-[10px] text-slate-500 font-medium">Surat E-Sign</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Tab: Security & E-Signature Pad */}
        <div className="lg:col-span-8 space-y-6">
          {/* Security & PIN */}
          <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Lock className="w-4 h-4 text-slate-700" />
              Keamanan Akun & PIN Otorisasi Naskah
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp / HP Pegawai</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">PIN 6-Digit Tanda Tangan Digital</label>
                <input
                  type="password"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 font-mono tracking-widest text-center"
                />
                <p className="text-[10px] text-slate-400 mt-1">Digunakan untuk konfirmasi setiap pembubuhan e-sign pada surat resmi.</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> Simpan Pengaturan Akun
              </button>
            </div>
          </form>

          {/* E-Signature Pad */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Stamp className="w-4 h-4 text-purple-600" />
                Spesimen Tanda Tangan Digital Resmi
              </h3>
              <p className="text-xs text-slate-500">
                Goreskan tanda tangan resmi Anda pada kotak di bawah ini untuk digunakan pada modul Surat Keluar dan Approval.
              </p>
            </div>

            <DigitalSignaturePad
              signerName={currentUser?.name}
              signerPosition={currentUser?.roleLabel}
              onSave={(dataUrl) => {
                alert('Tanda tangan digital Anda telah tersimpan aman!');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
