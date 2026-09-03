import React, { useRef } from 'react';
import { 
  Printer, 
  Download, 
  Share2, 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  Building2, 
  FileText,
  Clock,
  UserCheck
} from 'lucide-react';
import { Modal } from './Modal';
import { useOffice } from '../../context/OfficeContext';

export const DocumentViewerModal: React.FC = () => {
  const { previewItem, setPreviewItem, settings } = useOffice();
  const printRef = useRef<HTMLDivElement | null>(null);

  if (!previewItem) return null;

  const { type, data } = previewItem;

  const handlePrint = () => {
    window.print();
  };

  const renderOfficialLetter = (surat: any) => {
    return (
      <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-xs text-slate-800 font-serif leading-relaxed text-sm">
        {/* Kop Surat Resmi */}
        <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-1">
            <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center text-white font-sans font-black text-xl">
              V
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-wider font-sans text-slate-900 uppercase">
                {settings.namaPerusahaanLengkap}
              </h2>
              <p className="text-xs font-sans text-slate-600">
                Layanan Tata Kelola Digital, E-Government & Manajemen Administrasi Terpadu
              </p>
            </div>
          </div>
          <p className="text-[11px] font-sans text-slate-500">
            {settings.alamat} | Telp: {settings.telepon} | Email: {settings.email}
          </p>
        </div>

        {/* Info Surat */}
        <div className="flex justify-between items-start mb-6 font-sans text-xs">
          <div className="space-y-1">
            <p><span className="font-bold inline-block w-24">Nomor</span>: {surat.nomorSurat}</p>
            <p><span className="font-bold inline-block w-24">Sifat / Prioritas</span>: {surat.prioritas ? surat.prioritas.toUpperCase() : 'PENTING'}</p>
            <p><span className="font-bold inline-block w-24">Lampiran</span>: 1 (Satu) Berkas Digital</p>
            <p><span className="font-bold inline-block w-24">Perihal</span>: <strong className="text-slate-900">{surat.perihal}</strong></p>
          </div>
          <div className="text-right">
            <p>Jakarta, {surat.tanggalSurat || '02 September 2026'}</p>
          </div>
        </div>

        {/* Tujuan */}
        <div className="mb-6 font-sans text-xs">
          <p>Kepada Yth:</p>
          <p className="font-bold text-slate-900">{surat.tujuanSurat || surat.asalSurat}</p>
          {surat.instansiTujuan && <p className="text-slate-600">{surat.instansiTujuan}</p>}
          <p className="text-slate-600">di Tempat</p>
        </div>

        {/* Isi Surat */}
        <div className="mb-10 text-justify text-xs sm:text-sm font-serif space-y-3 leading-relaxed">
          <p>Dengan hormat,</p>
          <p>
            {surat.isiSurat || surat.ringkasanIsi || 'Sehubungan dengan agenda digitalisasi dan koordinasi tata kelola perkantoran modern, bersama ini kami sampaikan berkas dokumen resmi untuk ditindaklanjuti sesuai prosedur yang berlaku.'}
          </p>
          <p>
            Demikian surat ini kami sampaikan. Atas perhatian dan kerjasama yang baik, kami ucapkan terima kasih.
          </p>
        </div>

        {/* Signature Box */}
        <div className="flex justify-between items-end font-sans pt-4 border-t border-slate-100">
          {/* QR Verification Seal */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 max-w-xs">
            <div className="w-14 h-14 bg-white p-1 rounded-lg border border-blue-300 flex items-center justify-center shrink-0">
              <QrCode className="w-12 h-12 text-blue-900" />
            </div>
            <div className="text-[10px] text-slate-600 leading-tight">
              <p className="font-bold text-blue-900 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" /> TTE TERSERTIFIKASI
              </p>
              <p className="mt-0.5">Dokumen ini ditandatangani secara elektronik sah sesuai UU ITE.</p>
              <p className="font-mono text-slate-400 mt-0.5">ID: {surat.signatureStamp?.signatureId || 'VERRA-ESIGN-88219'}</p>
            </div>
          </div>

          {/* Signer */}
          <div className="text-center w-56">
            <p className="text-xs font-bold text-slate-800">
              {settings.pimpinanJabatan || 'Direktur Utama'}
            </p>
            
            {/* Signature Area */}
            <div className="h-16 flex items-center justify-center my-1">
              <span className="font-signature text-3xl text-blue-900 font-bold">
                {surat.penandatanganNama || settings.pimpinanNama}
              </span>
            </div>

            <p className="text-xs font-bold text-slate-900 underline">
              {surat.penandatanganNama || settings.pimpinanNama}
            </p>
            <p className="text-[10px] text-slate-500">NIP. {settings.pimpinanNip}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderDispositionSlip = (disp: any) => {
    return (
      <div className="bg-amber-50/30 p-6 border-2 border-amber-300 rounded-xl shadow-xs text-xs font-sans">
        {/* Header Disposisi */}
        <div className="bg-amber-100 border border-amber-300 p-3 rounded-lg text-center mb-5">
          <h3 className="text-base font-extrabold text-amber-900 uppercase tracking-wider">
            LEMBAR DISPOSISI DIGITAL ELEKTRONIK
          </h3>
          <p className="text-xs text-amber-800 font-medium">
            {settings.namaPerusahaanLengkap} - Sistem VerraOffice
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5 border-b border-amber-200 pb-4">
          <div className="space-y-1.5">
            <p><span className="text-slate-500 font-semibold w-28 inline-block">Surat Dari</span>: <strong>{disp.asalSurat}</strong></p>
            <p><span className="text-slate-500 font-semibold w-28 inline-block">No. Surat</span>: <span className="font-mono">{disp.nomorSurat}</span></p>
            <p><span className="text-slate-500 font-semibold w-28 inline-block">Tanggal Surat</span>: {disp.tanggalDisposisi?.slice(0, 10)}</p>
          </div>
          <div className="space-y-1.5">
            <p><span className="text-slate-500 font-semibold w-28 inline-block">Sifat Surat</span>: <span className="uppercase font-bold text-rose-700">{disp.prioritas}</span></p>
            <p><span className="text-slate-500 font-semibold w-28 inline-block">Batas Waktu</span>: <strong className="text-slate-900">{disp.deadline || 'Segera'}</strong></p>
            <p><span className="text-slate-500 font-semibold w-28 inline-block">Status</span>: <span className="uppercase font-bold text-blue-700">{disp.status}</span></p>
          </div>
        </div>

        <div className="mb-5 bg-white p-3 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-slate-700 mb-1">Perihal Dokumen:</p>
          <p className="text-sm font-semibold text-slate-900">{disp.perihal}</p>
        </div>

        {/* Diteruskan Kepada */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="bg-white p-4 rounded-xl border border-amber-200">
            <p className="font-bold text-amber-900 mb-2 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-amber-700" /> Diteruskan Kepada:
            </p>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <p className="font-bold text-slate-900">{disp.tujuanPegawaiNama}</p>
              <p className="text-xs text-slate-500">{disp.departemenTujuan}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200">
            <p className="font-bold text-amber-900 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instruksi Pimpinan:
            </p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {disp.instruksi?.map((ins: string, idx: number) => (
                <span key={idx} className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-bold text-[11px] border border-amber-300">
                  ✓ {ins}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Catatan Pimpinan */}
        <div className="bg-white p-4 rounded-xl border border-amber-200 mb-5">
          <p className="font-bold text-slate-800 mb-1">Catatan / Arahan Khusus Pimpinan:</p>
          <p className="text-slate-700 italic bg-amber-50/50 p-3 rounded-lg border border-amber-100">
            "{disp.catatanInstruksi || 'Mohon dipelajari dan segera ditindaklanjuti sesuai ketentuan.'}"
          </p>
          <div className="mt-3 flex justify-between items-center text-[11px] text-slate-500">
            <span>Diberikan oleh: <strong>{disp.dariPimpinan}</strong></span>
            <span>Waktu: {disp.tanggalDisposisi}</span>
          </div>
        </div>

        {/* Laporan Penyelesaian */}
        {disp.laporanPenyelesaian && (
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            <p className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Laporan Hasil Tindak Lanjut:
            </p>
            <p className="text-emerald-800">{disp.laporanPenyelesaian}</p>
            <p className="text-[10px] text-emerald-600 mt-2">Diselesaikan pada: {disp.tanggalSelesai}</p>
          </div>
        )}
      </div>
    );
  };

  const renderFormSubmission = (form: any) => {
    return (
      <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-xs text-xs font-sans space-y-5">
        <div className="flex justify-between items-start border-b border-slate-200 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Formulir Digital Paperless</span>
            <h3 className="text-lg font-bold text-slate-900">{form.formTitle}</h3>
            <p className="text-slate-500 font-mono text-[11px]">No. Pengajuan: {form.nomorPengajuan}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400">Tanggal Pengajuan</p>
            <p className="font-bold text-slate-800">{form.tanggalPengajuan}</p>
          </div>
        </div>

        {/* Data Pemohon */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <p className="text-slate-500">Nama Pemohon</p>
            <p className="font-bold text-slate-900 text-sm">{form.pemohonNama}</p>
          </div>
          <div>
            <p className="text-slate-500">Unit / Departemen</p>
            <p className="font-bold text-slate-900 text-sm">{form.departemen}</p>
          </div>
        </div>

        {/* Rincian Isian Form */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-800 text-sm">Rincian Informasi Pengajuan:</h4>
          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
            {Object.entries(form.data || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between p-3 bg-white text-xs hover:bg-slate-50">
                <span className="text-slate-500 capitalize font-medium">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-bold text-slate-900 text-right">{String(value)}</span>
              </div>
            ))}
            {form.biayaEstimasi && (
              <div className="flex justify-between p-3 bg-blue-50/50 font-bold text-sm">
                <span className="text-blue-900">Total Estimasi Anggaran:</span>
                <span className="text-blue-900 font-mono">Rp {form.biayaEstimasi.toLocaleString('id-ID')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Alur Approval */}
        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-slate-800 text-sm">Status & Alur Persetujuan Bertingkat:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {form.approvers?.map((app: any, idx: number) => (
              <div 
                key={idx} 
                className={`p-3.5 rounded-xl border ${
                  app.status === 'approved' 
                    ? 'bg-emerald-50/60 border-emerald-200' 
                    : app.status === 'rejected'
                    ? 'bg-rose-50/60 border-rose-200'
                    : 'bg-amber-50/50 border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-slate-800">Tingkat {app.level}: {app.role}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    app.status === 'approved' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : app.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {app.status === 'approved' ? '✓ Disetujui' : app.status === 'rejected' ? '✕ Ditolak' : '⏳ Pending'}
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-semibold">{app.userName}</p>
                {app.reviewedAt && <p className="text-[10px] text-slate-400 mt-1">{app.reviewedAt}</p>}
                {app.notes && <p className="text-xs text-slate-600 mt-1.5 italic bg-white/70 p-1.5 rounded border">"{app.notes}"</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={!!previewItem}
      onClose={() => setPreviewItem(null)}
      title="Pratinjau Dokumen Digital Resmi"
      subtitle="Dokumen digital terverifikasi dalam sistem arsip VerraOffice"
      maxWidth="4xl"
      actions={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Integritas Dokumen Digital Terlindungi</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Cetak / Print
            </button>
            <button
              onClick={() => {
                alert('Dokumen digital PDF berhasil diunduh ke perangkat Anda.');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>
      }
    >
      <div ref={printRef} className="print-area">
        {type === 'surat_keluar' || type === 'surat_masuk' ? renderOfficialLetter(data) : null}
        {type === 'disposisi' ? renderDispositionSlip(data) : null}
        {type === 'form' ? renderFormSubmission(data) : null}
        {type === 'dokumen' ? (
          <div className="space-y-4">
            <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="font-bold text-sm">{data.judul}</p>
                  <p className="text-slate-400">{data.nomorDokumen} • Versi {data.versi} • {data.ukuranFile}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-blue-600 rounded-md font-bold uppercase">{data.fileType}</span>
            </div>
            {renderOfficialLetter({
              nomorSurat: data.nomorDokumen,
              perihal: data.judul,
              tanggalSurat: data.tanggalUnggah,
              tujuanSurat: 'Arsip Internal Instansi',
              isiSurat: data.deskripsi,
              prioritas: 'biasa',
              penandatanganNama: data.diunggahOleh
            })}
          </div>
        ) : null}
      </div>
    </Modal>
  );
};
