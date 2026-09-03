import React, { useState } from 'react';
import {
  Settings,
  Save,
  Building,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Eye,
  Sparkles,
  Sliders,
  TreePine,
  RefreshCw
} from 'lucide-react';
import { useOffice } from '../context/OfficeContext';

export const PengaturanView: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetToSampleData
  } = useOffice();

  const [namaInstansi, setNamaInstansi] = useState(settings.namaInstansi);
  const [namaPerusahaanLengkap, setNamaPerusahaanLengkap] = useState(settings.namaPerusahaanLengkap);
  const [alamat, setAlamat] = useState(settings.alamat);
  const [telepon, setTelepon] = useState(settings.telepon);
  const [email, setEmail] = useState(settings.email);
  const [website, setWebsite] = useState(settings.website);
  const [pimpinanNama, setPimpinanNama] = useState(settings.pimpinanNama);
  const [pimpinanJabatan, setPimpinanJabatan] = useState(settings.pimpinanJabatan);
  const [pimpinanNip, setPimpinanNip] = useState(settings.pimpinanNip);
  const [formatNomorSurat, setFormatNomorSurat] = useState(settings.formatNomorSurat);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      namaInstansi,
      namaPerusahaanLengkap,
      alamat,
      telepon,
      email,
      website,
      pimpinanNama,
      pimpinanJabatan,
      pimpinanNip,
      formatNomorSurat
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-700" />
            Pengaturan Sistem & Kop Surat Resmi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Konfigurasi identitas kop surat naskah dinas resmi, format penomoran otomatis, dan parameter integrasi paperless.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Kembalikan seluruh data simulasi ke data awal?')) {
              resetToSampleData();
              window.location.reload();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" /> Reset Data Demo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                Identitas Lembaga & Kop Surat
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Informasi ini akan dicetak otomatis di header seluruh surat keluar dan dokumen arsip resmi.
              </p>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Singkat Lembaga / Instansi</label>
                <input
                  type="text"
                  value={namaInstansi}
                  onChange={(e) => setNamaInstansi(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Lembaga (Huruf Kapital pada Kop)</label>
                <input
                  type="text"
                  value={namaPerusahaanLengkap}
                  onChange={(e) => setNamaPerusahaanLengkap(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Kantor & Gedung</label>
                <textarea
                  rows={2}
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telepon Resmi</label>
                  <input
                    type="text"
                    value={telepon}
                    onChange={(e) => setTelepon(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Resmi</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Website</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 space-y-4 text-xs font-sans">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Pejabat Penandatangan Utama (Default Pimpinan)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    value={pimpinanNama}
                    onChange={(e) => setPimpinanNama(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jabatan</label>
                  <input
                    type="text"
                    value={pimpinanJabatan}
                    onChange={(e) => setPimpinanJabatan(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIP / NRP</label>
                  <input
                    type="text"
                    value={pimpinanNip}
                    onChange={(e) => setPimpinanNip(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 space-y-4 text-xs font-sans">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                Format Penomoran Surat Otomatis
              </h3>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pola Penomoran</label>
                <input
                  type="text"
                  value={formatNomorSurat}
                  onChange={(e) => setFormatNomorSurat(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none font-mono text-xs bg-slate-50"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Tag otomatis: {'{NOMOR}'}, {'{KODE_DEPT}'}, {'{BULAN_ROMAWI}'}, {'{TAHUN}'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {savedSuccess ? (
                <span className="text-emerald-600 font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Pengaturan berhasil disimpan!
                </span>
              ) : <div />}

              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Simpan Perubahan
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Preview Kop Surat */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-slate-500">
              <Eye className="w-4 h-4 text-blue-600" /> Live Preview Kop Surat Resmi
            </h4>

            {/* Simulated Paper Header */}
            <div className="bg-slate-50 border border-slate-300 p-5 rounded-xl text-center space-y-2 shadow-inner font-serif">
              <div className="w-10 h-10 bg-blue-900 text-white font-sans font-black text-xl rounded-lg flex items-center justify-center mx-auto mb-1">
                V
              </div>
              <h5 className="font-bold text-slate-900 text-sm font-sans tracking-wide uppercase leading-tight">
                {namaPerusahaanLengkap}
              </h5>
              <p className="text-[10px] text-slate-600 font-sans leading-tight">
                {alamat}
              </p>
              <p className="text-[9px] text-slate-500 font-sans border-b-2 border-double border-slate-800 pb-3">
                Telp: {telepon} | Email: {email} | Web: {website}
              </p>

              <div className="pt-2 text-left font-sans text-[10px] space-y-1 text-slate-600">
                <p>Nomor : 042/SEKR/VOFFICE/IX/2026</p>
                <p>Perihal : Undangan Sosialisasi Digital Office</p>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 space-y-1">
              <p className="font-bold">Keaslian Dokumen Terjamin</p>
              <p className="text-blue-700">Setiap cetakan surat keluar akan otomatis disisipi QR Code SHA-256 dan stempel digital pimpinan.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
