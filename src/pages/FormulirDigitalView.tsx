import React, { useState } from 'react';
import {
  FileEdit,
  Package,
  Calendar,
  Clock,
  Car,
  CreditCard,
  Laptop,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Eye,
  Plus,
  Send,
  FileCheck,
  Building,
  DollarSign
} from 'lucide-react';
import { useOffice } from '../context/OfficeContext';
import { FormSubmission, PriorityLevel } from '../types';
import { FormStatusBadge, PriorityBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Select2 } from '../components/common/Select2';
import { TinyMCEEditor } from '../components/common/TinyMCEEditor';

export const FormulirDigitalView: React.FC = () => {
  const {
    formSubmissions,
    addFormSubmission,
    currentUser,
    departments,
    setPreviewItem
  } = useOffice();

  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'history'>('catalog');
  const [selectedFormType, setSelectedFormType] = useState<string | null>(null);

  // Dynamic Form State
  const [keperluan, setKeperluan] = useState('');
  const [prioritas, setPrioritas] = useState<PriorityLevel>('penting');
  const [tglMulai, setTglMulai] = useState(new Date().toISOString().slice(0, 10));
  const [tglSelesai, setTglSelesai] = useState(new Date().toISOString().slice(0, 10));
  const [estimasiBiaya, setEstimasiBiaya] = useState<number>(0);
  const [detailList, setDetailList] = useState<string>('');

  const formTemplates = [
    {
      id: 'form_atk',
      title: 'Permintaan Barang ATK & Perlengkapan',
      desc: 'Pengadaan kertas, tinta printer, map, binder, dan peralatan tulis kantor unit.',
      icon: Package,
      color: 'blue',
      dept: 'Logistik & Umum'
    },
    {
      id: 'form_cuti',
      title: 'Pengajuan Cuti & Izin Kerja',
      desc: 'Cuti tahunan, cuti melahirkan, izin sakit, atau izin keperluan mendesak.',
      icon: Calendar,
      color: 'emerald',
      dept: 'HRD & SDM'
    },
    {
      id: 'form_sppd',
      title: 'Surat Tugas & Perjalanan Dinas (SPPD)',
      desc: 'Kunjungan kerja luar kota, transportasi dinas, akomodasi, dan uang harian.',
      icon: Car,
      color: 'amber',
      dept: 'Sekretariat & Keuangan'
    },
    {
      id: 'form_lembur',
      title: 'Pengajuan Kerja Lembur (Overtime)',
      desc: 'Permohonan pelaksanaan kerja lembur di luar jam operasional normal kantor.',
      icon: Clock,
      color: 'purple',
      dept: 'HRD & Operasional'
    },
    {
      id: 'form_reimburse',
      title: 'Klaim Reimbursement Operasional',
      desc: 'Penggantian dana talangan BBM dinas, konsumsi rapat klien, atau tiket parkir.',
      icon: CreditCard,
      color: 'rose',
      dept: 'Keuangan & Akuntansi'
    },
    {
      id: 'form_it',
      title: 'Permintaan Akses IT & Perangkat Kerja',
      desc: 'Pengajuan laptop kantor, akun email resmi, akses VPN, atau lisensi software.',
      icon: Laptop,
      color: 'indigo',
      dept: 'Teknologi Informasi'
    },
    {
      id: 'form_maintenance',
      title: 'Perbaikan Sarana & Fasilitas Kantor',
      desc: 'Laporan kerusakan AC, proyektor ruang rapat, instalasi listrik, atau furniture.',
      icon: Wrench,
      color: 'teal',
      dept: 'Umum & Fasilitas'
    },
    {
      id: 'form_ruang',
      title: 'Peminjaman Ruang Rapat & Zoom Hybrid',
      desc: 'Reservasi Ballroom, Ruang Rapat Pimpinan, atau akun Zoom Enterprise.',
      icon: Building,
      color: 'cyan',
      dept: 'Sekretariat'
    }
  ];

  const handleOpenFormModal = (formId: string) => {
    setSelectedFormType(formId);
    setKeperluan('');
    setEstimasiBiaya(0);
    setDetailList('');
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFormType) return;

    const selectedTpl = formTemplates.find(t => t.id === selectedFormType);
    if (!selectedTpl) return;

    addFormSubmission({
      formId: selectedTpl.id,
      formTitle: selectedTpl.title,
      pemohonId: currentUser?.id || 'usr-1',
      pemohonNama: currentUser?.name || 'Dr. Ir. Hendra Wijaya, M.M.',
      pemohonJabatan: currentUser?.roleLabel || 'Pegawai',
      departemen: currentUser?.department || 'Manajemen',
      tanggalPengajuan: new Date().toISOString().slice(0, 10),
      status: 'pending',
      prioritas,
      biayaEstimasi: estimasiBiaya > 0 ? estimasiBiaya : undefined,
      formData: {
        keperluan,
        tglMulai,
        tglSelesai,
        detail: detailList
      },
      tahapanApproval: [
        {
          urutan: 1,
          role: 'Kepala Unit / Departemen',
          pejabatNama: 'Siti Rahmawati, S.E.',
          status: 'pending'
        },
        {
          urutan: 2,
          role: 'Pimpinan / Direktur Utama',
          pejabatNama: 'Dr. Ir. Hendra Wijaya, M.M.',
          status: 'pending'
        }
      ]
    });

    setSelectedFormType(null);
    setActiveSubTab('history');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileEdit className="w-6 h-6 text-purple-600" />
            Layanan Formulir Digital & E-Form Kantor
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengajuan administrasi paperless 100%. Mulai dari cuti, ATK, reimbursement hingga SPPD dinas secara elektronik.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('catalog')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'catalog' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Katalog E-Form
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'history' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Riwayat Pengajuan</span>
            <span className="bg-purple-100 text-purple-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
              {formSubmissions.length}
            </span>
          </button>
        </div>
      </div>

      {activeSubTab === 'catalog' ? (
        /* Catalog Grid of 8 E-Forms */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {formTemplates.map((tpl) => {
            const Icon = tpl.icon;
            return (
              <div
                key={tpl.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-purple-300 shadow-xs hover:shadow-md p-5 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{tpl.dept}</span>
                    <h4 className="font-bold text-slate-900 text-sm mt-0.5">{tpl.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{tpl.desc}</p>
                </div>

                <button
                  id={`btn-open-${tpl.id}`}
                  onClick={() => handleOpenFormModal(tpl.id)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 group-hover:bg-purple-600 text-slate-700 group-hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Isi Formulir
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* Submissions History Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">No. Pengajuan & Formulir</th>
                  <th className="py-3.5 px-4">Tanggal & Pemohon</th>
                  <th className="py-3.5 px-4">Keperluan & Estimasi</th>
                  <th className="py-3.5 px-4">Prioritas</th>
                  <th className="py-3.5 px-4">Tahapan Approval</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {formSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <FileEdit className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold">Belum ada formulir yang diajukan.</p>
                    </td>
                  </tr>
                ) : (
                  formSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 align-top">
                        <p className="font-bold text-slate-900">{sub.formTitle}</p>
                        <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 font-mono">
                          {sub.nomorPengajuan}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 align-top">
                        <p className="font-bold text-slate-800">{sub.pemohonNama}</p>
                        <p className="text-[11px] text-slate-500">{sub.departemen} • {sub.tanggalPengajuan}</p>
                      </td>

                      <td className="py-3.5 px-4 align-top max-w-xs">
                        <p className="text-slate-800 font-medium line-clamp-2">
                          {sub.data?.keperluan ||
                            sub.data?.tujuanKegiatan ||
                            sub.data?.alasan ||
                            sub.data?.itemBarang ||
                            sub.data?.asetDipinjam ||
                            sub.formData?.keperluan ||
                            sub.formData?.detail ||
                            '-'}
                        </p>
                        {sub.biayaEstimasi && (
                          <p className="text-[11px] font-bold text-blue-900 mt-0.5">
                            Rp {sub.biayaEstimasi.toLocaleString('id-ID')}
                          </p>
                        )}
                      </td>

                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <PriorityBadge priority={sub.prioritas} />
                      </td>

                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1">
                          {(sub.approvers || sub.tahapanApproval || []).map((step: any, idx: number) => {
                            const name = (step.userName || step.pejabatNama || 'Pejabat').split(',')[0];
                            return (
                              <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                                {step.status === 'approved' ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                ) : step.status === 'rejected' ? (
                                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                ) : (
                                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                )}
                                <span className={step.status === 'approved' ? 'text-emerald-900 font-semibold' : 'text-slate-600'}>
                                  {step.role} ({name})
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <FormStatusBadge status={sub.status} />
                      </td>

                      <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                        <button
                          onClick={() => setPreviewItem({ type: 'form', data: sub })}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" /> Pratinjau
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

      {/* Modal: Dynamic Form Filling */}
      <Modal
        isOpen={!!selectedFormType}
        onClose={() => setSelectedFormType(null)}
        title={`Pengajuan: ${formTemplates.find(t => t.id === selectedFormType)?.title}`}
        subtitle="Formulir digital resmi dengan alur persetujuan bertingkat terotomasi"
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmitForm} className="space-y-4 text-xs font-sans">
          {/* Pemohon Header Auto-filled */}
          <div className="bg-purple-50/70 p-3.5 rounded-xl border border-purple-200 grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] text-purple-700 font-semibold">Nama Pemohon</p>
              <p className="font-bold text-slate-900">{currentUser?.name}</p>
            </div>
            <div>
              <p className="text-[10px] text-purple-700 font-semibold">Unit / Departemen</p>
              <p className="font-bold text-slate-900">{currentUser?.department}</p>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tingkat Urgensi / Prioritas *</label>
            <Select2
              value={prioritas}
              onChange={(val) => setPrioritas(val as PriorityLevel)}
              options={[
                { value: 'biasa', label: 'Biasa (Sesuai antrean SOP reguler)', badge: 'Normal' },
                { value: 'penting', label: 'Penting (Dibutuhkan dalam 2-3 hari kerja)', badge: 'Prioritas' },
                { value: 'sangat_segera', label: 'Sangat Segera (Darurat / Hari Ini)', badge: 'Urgent' }
              ]}
              searchable={false}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Maksud / Keperluan Pengajuan (WYSIWYG Editor) *</label>
            <TinyMCEEditor
              value={keperluan}
              onChange={(val) => setKeperluan(val)}
              placeholder="Jelaskan rincian permohonan, item barang, spesifikasi, atau alasan kebutuhan secara detail..."
              minHeight="140px"
            />
          </div>

          {/* Conditional field for cost if relevant */}
          {(selectedFormType === 'form_atk' || selectedFormType === 'form_sppd' || selectedFormType === 'form_reimburse') && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Estimasi Kebutuhan Biaya (Rp)</label>
              <input
                type="number"
                value={estimasiBiaya}
                onChange={(e) => setEstimasiBiaya(Number(e.target.value))}
                placeholder="0"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-purple-500 outline-none font-mono"
              />
            </div>
          )}

          {/* Conditional Date Range for Cuti, SPPD, Ruang */}
          {(selectedFormType === 'form_cuti' || selectedFormType === 'form_sppd' || selectedFormType === 'form_ruang') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tanggal Mulai</label>
                <input
                  type="date"
                  value={tglMulai}
                  onChange={(e) => setTglMulai(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tanggal Selesai</label>
                <input
                  type="date"
                  value={tglSelesai}
                  onChange={(e) => setTglSelesai(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-purple-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Daftar Item / Rincian Spesifikasi Tambahan</label>
            <textarea
              rows={2}
              value={detailList}
              onChange={(e) => setDetailList(e.target.value)}
              placeholder="Contoh: Kertas A4 80gr (5 rim), Spidol whiteboard (1 lusin)..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-purple-500 outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setSelectedFormType(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" /> Kirim Pengajuan E-Form
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
