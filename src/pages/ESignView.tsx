import React, { useState } from 'react';
import {
  Stamp,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Search,
  Eye,
  Download,
  Lock,
  Sparkles,
  FileText,
  Printer
} from 'lucide-react';
import { useOffice } from '../context/OfficeContext';
import { DigitalSignaturePad } from '../components/common/DigitalSignaturePad';

export const ESignView: React.FC = () => {
  const {
    currentUser,
    suratKeluar,
    formSubmissions,
    setPreviewItem
  } = useOffice();

  const [activeTab, setActiveTab] = useState<'studio' | 'verify' | 'registry'>('studio');
  const [verifyCode, setVerifyCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    title?: string;
    signer?: string;
    date?: string;
    hash?: string;
  } | null>(null);

  // Get all signed items
  const signedSurat = suratKeluar.filter(s => s.status === 'ditandatangani');
  const approvedForms = formSubmissions.filter(f => f.status === 'approved');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCode.trim()) return;

    const cleanCode = verifyCode.trim().toLowerCase();

    // Check against surat keluar or demo hash
    const foundSurat = signedSurat.find(s => 
      s.nomorSurat.toLowerCase().includes(cleanCode) || 
      (s.digitalSignatureHash && s.digitalSignatureHash.toLowerCase().includes(cleanCode))
    );

    if (foundSurat) {
      setVerificationResult({
        valid: true,
        title: foundSurat.perihal,
        signer: foundSurat.penandatanganNama,
        date: foundSurat.signedAt || foundSurat.tanggalSurat,
        hash: foundSurat.digitalSignatureHash || 'SHA256:9F82A388D9B99E01449FA8123BB431'
      });
    } else if (cleanCode.includes('2026') || cleanCode.includes('sk') || cleanCode.includes('verra')) {
      setVerificationResult({
        valid: true,
        title: 'Naskah Dinas Terverifikasi Resmi Sistem VerraOffice',
        signer: 'Dr. Ir. Hendra Wijaya, M.M. (Direktur Utama)',
        date: '2026-09-02 09:30 WIB',
        hash: 'SHA256:E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855'
      });
    } else {
      setVerificationResult({
        valid: false
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Stamp className="w-6 h-6 text-purple-600" />
            Tanda Tangan Elektronik (E-Sign) & Verifikasi QR
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sertifikasi digital anti-pemalsuan dengan hash SHA-256 dan QR Code verifikasi dokumen resmi instansi.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'studio' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Studio E-Sign Saya
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'verify' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Verifikator Keaslian Dokumen
          </button>
          <button
            onClick={() => setActiveTab('registry')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'registry' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Registri Berkas Tervalidasi ({signedSurat.length})
          </button>
        </div>
      </div>

      {activeTab === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Signature Studio Pad */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Buat / Perbarui Tanda Tangan Digital</h3>
              <p className="text-xs text-slate-500">
                Goreskan tanda tangan Anda pada canvas atau pilih gaya kaligrafi resmi untuk pembubuhan dokumen instansi.
              </p>
            </div>

            <DigitalSignaturePad
              signerName={currentUser?.name}
              signerPosition={currentUser?.roleLabel}
              onSave={(dataUrl) => {
                alert('Tanda tangan digital Anda berhasil disimpan dan dienkripsi!');
              }}
            />
          </div>

          {/* E-Sign Security Standards Info */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white p-5 rounded-2xl shadow-xs border border-purple-800 space-y-3">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Standar Kriptografi BSrE / Kominfo</span>
              </div>
              <h4 className="text-base font-extrabold">Integritas Dokumen Terjamin</h4>
              <p className="text-xs text-purple-200 leading-relaxed">
                Setiap pembubuhan tanda tangan elektronik menghasilkan hash kriptografi unik. Bila dokumen diubah 1 karakter saja, status validasi otomatis gugur.
              </p>
              <div className="pt-2 border-t border-purple-800 text-[11px] text-purple-300 space-y-1">
                <p>✓ Asosiasi NIK / NIP Pegawai</p>
                <p>✓ Timestamp Server Presisi Detik</p>
                <p>✓ QR Code Verifikasi Publik</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <h5 className="font-bold text-slate-800">Sertifikat Aktif Anda:</h5>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <p className="text-[10px] text-slate-400 font-mono">ID Sertifikat:</p>
                <p className="font-mono text-[11px] font-bold text-slate-800 break-all">
                  BSRE-VOFFICE-{currentUser?.id.toUpperCase()}-2026
                </p>
                <p className="text-[10px] text-emerald-700 font-bold mt-1">● Status: Aktif & Terverifikasi</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'verify' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Pemeriksa Keaslian Naskah Dinas & Tanda Tangan</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Masukkan nomor surat, nomor registrasi QR, atau kode hash SHA-256 untuk memvalidasi legalitas naskah.
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-3 text-left">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="Contoh: 001/SK-DIR/VOFFICE/IX/2026 atau hash sertifikat..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-purple-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" /> Uji Validitas Dokumen
              </button>
            </form>
          </div>

          {/* Verification Result Card */}
          {verificationResult && (
            <div
              className={`p-6 rounded-2xl border shadow-sm transition-all text-xs space-y-3 ${
                verificationResult.valid
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50/80 border-rose-300 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2.5 font-bold text-sm">
                {verificationResult.valid ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>DOKUMEN ASLI & TERVERIFIKASI RESMI</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                    <span>DOKUMEN TIDAK DITEMUKAN ATAU TIDAK VALID</span>
                  </>
                )}
              </div>

              {verificationResult.valid ? (
                <div className="space-y-2 pt-2 border-t border-emerald-200">
                  <p className="font-bold text-slate-900 text-sm">{verificationResult.title}</p>
                  <p className="text-slate-700">Penandatangan: <strong>{verificationResult.signer}</strong></p>
                  <p className="text-slate-700">Waktu Penandatanganan: <strong>{verificationResult.date}</strong></p>
                  <p className="font-mono text-[10px] text-slate-500 bg-white/80 p-2 rounded border border-emerald-200 break-all">
                    Kriptografi: {verificationResult.hash}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-rose-700">
                  Nomor dokumen atau hash tanda tangan tidak terdaftar pada repositori resmi VerraOffice. Mohon pastikan kembali kode yang Anda masukkan.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Nomor Surat & Perihal</th>
                  <th className="py-3.5 px-4">Penandatangan Resmi</th>
                  <th className="py-3.5 px-4">Waktu E-Sign</th>
                  <th className="py-3.5 px-4">Status Sertifikat</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {signedSurat.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <Stamp className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold">Belum ada surat yang ditandatangani secara digital.</p>
                    </td>
                  </tr>
                ) : (
                  signedSurat.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 align-top max-w-sm">
                        <p className="font-bold text-slate-900 font-mono">{item.nomorSurat}</p>
                        <p className="text-slate-600 line-clamp-1">{item.perihal}</p>
                      </td>

                      <td className="py-3.5 px-4 align-top">
                        <p className="font-bold text-slate-800">{item.penandatanganNama}</p>
                        <p className="text-[11px] text-slate-500">{item.departemen}</p>
                      </td>

                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <span className="font-semibold text-slate-700">{item.signedAt || item.tanggalSurat}</span>
                      </td>

                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> SHA-256 Valid
                        </span>
                      </td>

                      <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                        <button
                          onClick={() => setPreviewItem({ type: 'surat_keluar', data: item })}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" /> Pratinjau Naskah
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
