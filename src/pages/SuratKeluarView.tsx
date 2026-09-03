import React, { useState } from 'react';
import {
  Send,
  Plus,
  Search,
  Eye,
  Stamp,
  CheckCircle2,
  FileCheck2,
  Printer,
  Trash2,
  FileText,
  Clock,
  Sparkles,
  QrCode
} from 'lucide-react';
import { useOffice } from '../context/OfficeContext';
import { SuratKeluar, SuratKeluarStatus } from '../types';
import { SuratStatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { DigitalSignaturePad } from '../components/common/DigitalSignaturePad';
import { Select2, Select2Option } from '../components/common/Select2';
import { TinyMCEEditor } from '../components/common/TinyMCEEditor';

export const SuratKeluarView: React.FC = () => {
  const {
    suratKeluar,
    addSuratKeluar,
    approveSuratKeluar,
    signSuratKeluar,
    deleteSuratKeluar,
    departments,
    currentUser,
    users,
    setPreviewItem
  } = useOffice();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [signingLetter, setSigningLetter] = useState<SuratKeluar | null>(null);

  // New Letter Form State
  const [formTujuan, setFormTujuan] = useState('');
  const [formInstansi, setFormInstansi] = useState('');
  const [formPerihal, setFormPerihal] = useState('');
  const [formKlasifikasi, setFormKlasifikasi] = useState('Surat Permohonan');
  const [formDepartemen, setFormDepartemen] = useState(departments[0]?.nama || 'Direksi & Manajemen');
  const [formPenandatangan, setFormPenandatangan] = useState(users[0]?.name || 'Dr. Ir. Hendra Wijaya, M.M.');
  const [formIsiSurat, setFormIsiSurat] = useState('');

  const templateOptions = [
    { label: 'Surat Permohonan', text: 'Dengan hormat, sehubungan dengan akselerasi program digitalisasi instansi, bersama ini kami bermaksud mengajukan permohonan kerjasama terpadu...' },
    { label: 'Surat Undangan Rapat', text: 'Dengan hormat, mengharap kehadiran Bapak/Ibu pada rapat koordinasi yang akan dilaksanakan pada waktu dan tempat terlampir...' },
    { label: 'Surat Tugas / Perjalanan Dinas', text: 'Dengan ini menugaskan kepada pegawai yang namanya tercantum di bawah ini untuk melaksanakan tugas kedinasan terhitung sejak...' },
    { label: 'Surat Edaran Kebijakan', text: 'Diberitahukan kepada seluruh unit kerja bahwa mulai tanggal yang ditetapkan akan diberlakukan pedoman operasional tata laksana baru...' }
  ];

  const filteredList = suratKeluar.filter((item) => {
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchSearch =
      item.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.perihal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tujuanSurat.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleCreateSuratKeluar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTujuan || !formPerihal || !formIsiSurat) {
      alert('Mohon lengkapi Tujuan, Perihal, dan Isi Surat.');
      return;
    }

    addSuratKeluar({
      tanggalSurat: new Date().toISOString().slice(0, 10),
      tujuanSurat: formTujuan,
      instansiTujuan: formInstansi,
      perihal: formPerihal,
      klasifikasi: formKlasifikasi,
      pembuatId: currentUser?.id || 'usr-4',
      pembuatNama: currentUser?.name || 'Sekretariat',
      departemen: formDepartemen,
      penandatanganId: users[0]?.id || 'usr-1',
      penandatanganNama: formPenandatangan,
      status: 'menunggu_approval',
      isiSurat: formIsiSurat,
      fileName: `Draf_${formPerihal.slice(0, 20).replace(/\s+/g, '_')}.pdf`
    });

    setIsNewModalOpen(false);
    setFormTujuan('');
    setFormInstansi('');
    setFormPerihal('');
    setFormIsiSurat('');
  };

  const handleApplySignature = (sigDataUrl: string) => {
    if (signingLetter) {
      signSuratKeluar(signingLetter.id);
      setSigningLetter(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Send className="w-6 h-6 text-emerald-600" />
            Surat Keluar & E-Penomoran Otomatis
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Penyusunan naskah dinas keluar, penomoran otomatis dengan kode unit, approval pimpinan, dan pembubuhan e-sign ber-QR code.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Cetak Rekap
          </button>
          <button
            id="btn-add-surat-keluar"
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Buat Surat Keluar Baru
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'Semua Surat' },
              { id: 'draft', label: 'Draft' },
              { id: 'menunggu_approval', label: 'Menunggu Approval' },
              { id: 'disetujui', label: 'Disetujui' },
              { id: 'ditandatangani', label: 'Ditandatangani E-Sign' }
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
              placeholder="Cari perihal, nomor, tujuan..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Table of Outgoing Letters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Nomor & Tanggal</th>
                <th className="py-3.5 px-4">Tujuan & Instansi</th>
                <th className="py-3.5 px-4">Perihal Surat</th>
                <th className="py-3.5 px-4">Pembuat & Unit</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Send className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold">Tidak ada surat keluar yang sesuai filter.</p>
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 align-top">
                      <p className="font-bold text-slate-900 font-mono">{item.nomorSurat}</p>
                      <span className="text-[11px] text-slate-500">{item.tanggalSurat}</span>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <p className="font-bold text-slate-800">{item.tujuanSurat}</p>
                      {item.instansiTujuan && <p className="text-[11px] text-slate-500">{item.instansiTujuan}</p>}
                    </td>

                    <td className="py-3.5 px-4 align-top max-w-xs">
                      <p className="font-bold text-slate-900 line-clamp-2">{item.perihal}</p>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded inline-block mt-1">
                        {item.klasifikasi}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <p className="font-bold text-slate-800">{item.pembuatNama}</p>
                      <p className="text-[11px] text-slate-500">{item.departemen}</p>
                    </td>

                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <SuratStatusBadge status={item.status} />
                    </td>

                    <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewItem({ type: 'surat_keluar', data: item })}
                          title="Pratinjau Kop Surat Resmi"
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Quick Approve or E-Sign button */}
                        {item.status === 'menunggu_approval' && (
                          <button
                            onClick={() => approveSuratKeluar(item.id)}
                            title="Setujui Konsep Surat"
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Setujui
                          </button>
                        )}

                        {(item.status === 'disetujui' || item.status === 'menunggu_approval') && (
                          <button
                            onClick={() => setSigningLetter(item)}
                            title="Bubuhkan E-Sign Pimpinan"
                            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Stamp className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (confirm('Hapus draf surat keluar ini?')) {
                              deleteSuratKeluar(item.id);
                            }
                          }}
                          title="Hapus"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Buat Surat Keluar Baru */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Buat Surat Keluar & Naskah Dinas Baru"
        subtitle="Nomor surat otomatis akan digenerate sesuai format baku instansi"
        maxWidth="3xl"
      >
        <form onSubmit={handleCreateSuratKeluar} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kepada Yth. (Nama / Jabatan Penerima) *</label>
              <input
                type="text"
                required
                value={formTujuan}
                onChange={(e) => setFormTujuan(e.target.value)}
                placeholder="Contoh: Sekretaris Jenderal Kemenkomdigi RI"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Instansi / Perusahaan Tujuan</label>
              <input
                type="text"
                value={formInstansi}
                onChange={(e) => setFormInstansi(e.target.value)}
                placeholder="Contoh: Kementerian Komunikasi dan Digital RI"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Departemen / Unit Pembuat</label>
              <Select2
                value={formDepartemen}
                onChange={(val) => setFormDepartemen(val)}
                options={departments.map(d => ({
                  value: d.nama,
                  label: d.nama,
                  sublabel: `Kepala: ${d.kepala}`,
                  badge: `${d.jumlahPegawai} Pegawai`
                }))}
                placeholder="Pilih Departemen..."
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Klasifikasi Surat</label>
              <Select2
                value={formKlasifikasi}
                onChange={(val) => setFormKlasifikasi(val)}
                options={[
                  { value: 'Surat Permohonan', label: 'Surat Permohonan', badge: 'PMH' },
                  { value: 'Surat Undangan', label: 'Surat Undangan', badge: 'UND' },
                  { value: 'Surat Edaran', label: 'Surat Edaran', badge: 'SE' },
                  { value: 'Surat Tugas', label: 'Surat Tugas (SPPD)', badge: 'ST' },
                  { value: 'Surat Keputusan (SK)', label: 'Surat Keputusan (SK)', badge: 'SK' },
                  { value: 'Surat Pemberitahuan', label: 'Surat Pemberitahuan', badge: 'PBT' }
                ]}
                placeholder="Pilih Klasifikasi..."
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Penandatangan Resmi</label>
              <Select2
                value={formPenandatangan}
                onChange={(val) => setFormPenandatangan(val)}
                options={users.map(u => ({
                  value: u.name,
                  label: u.name,
                  sublabel: u.roleLabel,
                  badge: u.department
                }))}
                placeholder="Pilih Pejabat Penandatangan..."
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Perihal Surat *</label>
            <input
              type="text"
              required
              value={formPerihal}
              onChange={(e) => setFormPerihal(e.target.value)}
              placeholder="Contoh: Permohonan Integrasi Sertifikasi Tanda Tangan Elektronik Berinduk"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Quick Template Picker & TinyMCE WYSIWYG Editor */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-bold text-slate-700">Isi Naskah Surat (WYSIWYG TinyMCE Editor) *</label>
              <span className="text-[11px] text-slate-400">Pilih template cepat:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {templateOptions.map((tpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFormIsiSurat(`<p>${tpl.text}</p>`)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer border border-slate-200"
                >
                  ⚡ {tpl.label}
                </button>
              ))}
            </div>
            
            <TinyMCEEditor
              value={formIsiSurat}
              onChange={(val) => setFormIsiSurat(val)}
              placeholder="Tuliskan naskah isi surat resmi lengkap di sini (format bold, list, tabel, alignment didukung)..."
              minHeight="190px"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsNewModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
            >
              Terbitkan & Ajukan Approval
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Tanda Tangan Digital Pad */}
      <Modal
        isOpen={!!signingLetter}
        onClose={() => setSigningLetter(null)}
        title="Pembubuhan Tanda Tangan Digital (E-Sign)"
        subtitle={`Dokumen: ${signingLetter?.nomorSurat} - ${signingLetter?.perihal}`}
        maxWidth="lg"
      >
        <DigitalSignaturePad
          signerName={signingLetter?.penandatanganNama}
          signerPosition="Direktur Utama"
          onSave={(sigDataUrl) => handleApplySignature(sigDataUrl)}
        />
      </Modal>
    </div>
  );
};
