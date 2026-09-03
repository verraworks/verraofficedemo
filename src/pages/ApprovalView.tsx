import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Eye,
  Stamp,
  AlertCircle,
  FileText,
  DollarSign,
  UserCheck,
  Send,
  Sparkles
} from 'lucide-react';
import { useOffice } from '../context/OfficeContext';
import { FormSubmission, PriorityLevel } from '../types';
import { FormStatusBadge, PriorityBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { DigitalSignaturePad } from '../components/common/DigitalSignaturePad';

export const ApprovalView: React.FC = () => {
  const {
    formSubmissions,
    suratKeluar,
    approveFormSubmission,
    rejectFormSubmission,
    approveSuratKeluar,
    currentUser,
    setPreviewItem
  } = useOffice();

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [selectedSubForReview, setSelectedSubForReview] = useState<FormSubmission | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [approvalNote, setApprovalNote] = useState('');
  const [showSignModal, setShowSignModal] = useState(false);

  const pendingList = formSubmissions.filter(f => f.status === 'pending');
  const approvedList = formSubmissions.filter(f => f.status === 'approved');
  const rejectedList = formSubmissions.filter(f => f.status === 'rejected');

  const currentList = activeTab === 'pending' ? pendingList : activeTab === 'approved' ? approvedList : rejectedList;

  const filteredList = currentList.filter(item => 
    item.formTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.pemohonNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nomorPengajuan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = () => {
    if (!selectedSubForReview) return;
    approveFormSubmission(selectedSubForReview.id, approvalNote || 'Pengajuan disetujui sesuai ketentuan.');
    setSelectedSubForReview(null);
    setApprovalNote('');
  };

  const handleReject = () => {
    if (!selectedSubForReview || !rejectReason.trim()) {
      alert('Mohon tuliskan alasan penolakan/evaluasi.');
      return;
    }
    rejectFormSubmission(selectedSubForReview.id, rejectReason);
    setSelectedSubForReview(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-rose-600" />
            Pusat Persetujuan & Verifikasi (Approval Hub)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Otorisasi berjenjang pengajuan dana, cuti, surat dinas, dan pengadaan perlengkapan kantor.
          </p>
        </div>

        {/* Tab Badges */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pending' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Menunggu Tindakan</span>
            {pendingList.length > 0 && (
              <span className="bg-rose-600 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                {pendingList.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'approved' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Disetujui ({approvedList.length})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'rejected' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ditolak ({rejectedList.length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari pemohon, nomor pengajuan, jenis form..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-rose-500 outline-none"
          />
        </div>
      </div>

      {/* Approval Cards List */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
            <p className="font-semibold text-slate-700">Tidak ada pengajuan pada tab ini.</p>
          </div>
        ) : (
          filteredList.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-rose-300 shadow-xs p-5 transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {sub.nomorPengajuan}
                    </span>
                    <PriorityBadge priority={sub.prioritas} />
                    <FormStatusBadge status={sub.status} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{sub.formTitle}</h4>
                </div>

                <div className="text-left sm:text-right text-xs">
                  <p className="font-bold text-slate-800">{sub.pemohonNama}</p>
                  <p className="text-slate-400 text-[11px]">{sub.departemen} • {sub.tanggalPengajuan}</p>
                </div>
              </div>

              {/* Purpose & Cost preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="md:col-span-2">
                  <p className="text-[10px] font-semibold text-slate-400">Keperluan / Keterangan Pengajuan:</p>
                  <p className="text-slate-800 font-medium mt-0.5">
                    {sub.data?.keperluan ||
                      sub.data?.tujuanKegiatan ||
                      sub.data?.alasan ||
                      sub.data?.itemBarang ||
                      sub.data?.asetDipinjam ||
                      sub.formData?.keperluan ||
                      sub.formData?.detail ||
                      '-'}
                  </p>
                </div>
                {sub.biayaEstimasi && (
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400">Estimasi Anggaran:</p>
                    <p className="text-sm font-extrabold text-blue-900 mt-0.5">
                      Rp {sub.biayaEstimasi.toLocaleString('id-ID')}
                    </p>
                  </div>
                )}
              </div>

              {/* Multi-tier timeline */}
              <div className="flex items-center gap-3 overflow-x-auto text-[11px] py-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Alur Persetujuan:</span>
                {(sub.approvers || sub.tahapanApproval || []).map((st: any, i: number, arr: any[]) => (
                  <div key={i} className="flex items-center gap-1.5 whitespace-nowrap">
                    {st.status === 'approved' ? (
                      <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {st.role}
                      </span>
                    ) : st.status === 'rejected' ? (
                      <span className="flex items-center gap-1 text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" /> {st.role}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <Clock className="w-3.5 h-3.5" /> {st.role}
                      </span>
                    )}
                    {i < arr.length - 1 && <span className="text-slate-300">→</span>}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => setPreviewItem({ type: 'form', data: sub })}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> Lihat Lembar Lengkap
                </button>

                {sub.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedSubForReview(sub);
                        setRejectReason('');
                        setApprovalNote('');
                      }}
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Stamp className="w-3.5 h-3.5" /> Tinjau & Ambil Keputusan
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Tinjau & Otorisasi Approval */}
      <Modal
        isOpen={!!selectedSubForReview}
        onClose={() => setSelectedSubForReview(null)}
        title="Otorisasi & Tinjauan Persetujuan Pengajuan"
        subtitle={`Pengajuan No. ${selectedSubForReview?.nomorPengajuan} - ${selectedSubForReview?.formTitle}`}
        maxWidth="2xl"
      >
        <div className="space-y-4 text-xs font-sans">
          {/* Summary Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-slate-900 text-sm">{selectedSubForReview?.formTitle}</p>
                <p className="text-slate-500 text-[11px]">
                  Pemohon: <strong>{selectedSubForReview?.pemohonNama}</strong> ({selectedSubForReview?.departemen})
                </p>
              </div>
              <PriorityBadge priority={selectedSubForReview?.prioritas || 'biasa'} />
            </div>
            <p className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
              "{selectedSubForReview?.data?.keperluan ||
                selectedSubForReview?.data?.tujuanKegiatan ||
                selectedSubForReview?.data?.alasan ||
                selectedSubForReview?.data?.itemBarang ||
                selectedSubForReview?.data?.asetDipinjam ||
                selectedSubForReview?.formData?.keperluan ||
                selectedSubForReview?.formData?.detail ||
                'Tidak ada catatan keperluan khusus.'}"
            </p>
            {selectedSubForReview?.biayaEstimasi && (
              <p className="text-xs font-bold text-blue-900">
                Estimasi Anggaran: Rp {selectedSubForReview.biayaEstimasi.toLocaleString('id-ID')}
              </p>
            )}
          </div>

          {/* Catatan Persetujuan */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Catatan / Arahan Pimpinan (Opsional jika Setuju)</label>
            <input
              type="text"
              value={approvalNote}
              onChange={(e) => setApprovalNote(e.target.value)}
              placeholder="Contoh: Disetujui, harap koordinasikan pencairan dengan Keuangan..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Alasan Penolakan */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Alasan Penolakan / Revisi (Wajib jika Menolak)</label>
            <textarea
              rows={2}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Tuliskan evaluasi mengapa pengajuan ini ditolak atau perlu direvisi..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-rose-500 outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={handleReject}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <XCircle className="w-4 h-4" /> Tolak Pengajuan
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedSubForReview(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> Setujui & Beri Otorisasi
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
