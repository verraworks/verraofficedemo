import React from 'react';
import { 
  TreePine, 
  FileSpreadsheet, 
  DollarSign, 
  Clock, 
  CloudRain, 
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Leaf
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useOffice } from '../../context/OfficeContext';

interface PaperlessImpactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaperlessImpactModal: React.FC<PaperlessImpactModalProps> = ({ isOpen, onClose }) => {
  const { paperlessStats } = useOffice();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dampak Ekologis & Efisiensi Digitalisasi (Paperless Impact)"
      subtitle="Statistik nyata penghematan kertas, biaya operasional, dan emisi karbon instansi"
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Banner Hero Impact */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-2.5 mb-2 text-emerald-100">
            <Leaf className="w-5 h-5 text-emerald-300" />
            <span className="text-xs font-bold uppercase tracking-wider">Pencapaian Eco-Office 2026</span>
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight mb-1">
            {paperlessStats.kertasDihematLembar.toLocaleString('id-ID')} Lembar Kertas Telah Dihemat
          </h3>
          <p className="text-emerald-100 text-xs max-w-xl">
            Dengan beralih ke surat digital, disposisi online, formulir e-form, dan approval e-sign, instansi berhasil meniadakan konsumsi kertas fisik secara terukur.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl text-center">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <p className="text-xl font-extrabold text-emerald-900">{paperlessStats.rimKertasDihemat} Rim</p>
            <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">Kertas Terhemat</p>
          </div>

          <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-xl text-center">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-2">
              <DollarSign className="w-5 h-5" />
            </div>
            <p className="text-xl font-extrabold text-blue-900">Rp {(paperlessStats.biayaPercetakanDihemat / 1000).toFixed(0)}rb</p>
            <p className="text-[11px] font-semibold text-blue-700 mt-0.5">Biaya Cetak & Toner</p>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl text-center">
            <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center mx-auto mb-2">
              <TreePine className="w-5 h-5" />
            </div>
            <p className="text-xl font-extrabold text-amber-900">{paperlessStats.pohonTerselamatkan} Pohon</p>
            <p className="text-[11px] font-semibold text-amber-700 mt-0.5">Pohon Lestari</p>
          </div>

          <div className="bg-purple-50/70 border border-purple-200 p-4 rounded-xl text-center">
            <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-xl font-extrabold text-purple-900">{paperlessStats.jamKerjaDihemat} Jam</p>
            <p className="text-[11px] font-semibold text-purple-700 mt-0.5">Waktu Administrasi</p>
          </div>
        </div>

        {/* Traditional vs Digital Office Matrix */}
        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
          <div className="bg-slate-100 p-3 font-bold text-slate-800 border-b border-slate-200">
            Perbandingan Alur Kerja: Tradisional Fisik vs. VerraOffice Digital
          </div>
          <div className="divide-y divide-slate-100">
            <div className="grid grid-cols-2 p-3 bg-white">
              <div className="flex items-start gap-2 pr-3 border-r border-slate-200 text-rose-700">
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Kantor Manual (Kertas)</p>
                  <p className="text-slate-500 text-[11px]">Surat dicetak 3 rangkap, diantar kurir ke meja pimpinan, menunggu tanda tangan basah berhari-hari.</p>
                </div>
              </div>
              <div className="flex items-start gap-2 pl-3 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">VerraOffice Digital</p>
                  <p className="text-slate-600 text-[11px]">Surat dibuat digital, notifikasi instant, review & e-sign hitungan menit dari mana saja.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 p-3 bg-slate-50/40">
              <div className="flex items-start gap-2 pr-3 border-r border-slate-200 text-rose-700">
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Lembar Disposisi Kertas</p>
                  <p className="text-slate-500 text-[11px]">Kertas disposisi kuning rawan terselip, rusak, dan tidak terlacak status tindak lanjutnya.</p>
                </div>
              </div>
              <div className="flex items-start gap-2 pl-3 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Disposisi Digital</p>
                  <p className="text-slate-600 text-[11px]">Riwayat instruksi tersimpan permanen, ada deadline dan progress pelaporan online.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 p-3 bg-white">
              <div className="flex items-start gap-2 pr-3 border-r border-slate-200 text-rose-700">
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Map & Lemari Arsip</p>
                  <p className="text-slate-500 text-[11px]">Memerlukan gudang fisik besar, dokumen lapuk, pencarian arsip lama memakan waktu 30+ menit.</p>
                </div>
              </div>
              <div className="flex items-start gap-2 pl-3 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">E-Arsip Terenkripsi</p>
                  <p className="text-slate-600 text-[11px]">Pencarian full-text instan dalam 1 detik, aman dengan backup cloud multi-region.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
