import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Eye,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Printer,
  Trash2,
  Laptop,
  Car,
  Building,
  DollarSign
} from 'lucide-react';
import { useOffice } from '../context/OfficeContext';
import { AssetInventory } from '../types';
import { Modal } from '../components/common/Modal';

export const InventarisAsetView: React.FC = () => {
  const {
    assets,
    addAsset,
    borrowAsset,
    returnAsset,
    users,
    departments
  } = useOffice();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [pinjamModalAsset, setPinjamModalAsset] = useState<AssetInventory | null>(null);
  const [pinjamPeminjam, setPinjamPeminjam] = useState(users[0]?.name || '');
  const [pinjamKeperluan, setPinjamKeperluan] = useState('Kegiatan operasional dan dinas kantor');
  const [pinjamSampai, setPinjamSampai] = useState(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));

  // New Asset Form State
  const [formNama, setFormNama] = useState('');
  const [formKategori, setFormKategori] = useState<'elektronik' | 'kendaraan' | 'furniture' | 'peralatan' | 'atk'>('elektronik');
  const [formLokasi, setFormLokasi] = useState('Ruang Staf Lantai 2');
  const [formDept, setFormDept] = useState(departments[0]?.nama || 'Sekretariat');
  const [formNilai, setFormNilai] = useState<number>(15000000);
  const [formKondisi, setFormKondisi] = useState<'baik' | 'butuh_perbaikan' | 'rusak'>('baik');

  const filteredList = assets.filter((item) => {
    const matchCat = categoryFilter === 'all' || item.kategori === categoryFilter;
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchSearch =
      item.namaAset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kodeAset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.penanggungJawab.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama) return;

    addAsset({
      kodeAset: `AST/VOFFICE/${Date.now().toString().slice(-4)}/2026`,
      namaAset: formNama,
      kategori: formKategori,
      lokasi: formLokasi,
      kondisi: formKondisi,
      penanggungJawab: 'Bagian Rumah Tangga & Aset',
      departemen: formDept,
      tanggalPengadaan: new Date().toISOString().slice(0, 10),
      nilaiAset: formNilai,
      status: 'tersedia'
    });

    setIsNewModalOpen(false);
    setFormNama('');
  };

  const handleProcessPinjam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinjamModalAsset) return;

    borrowAsset(pinjamModalAsset.id, pinjamPeminjam, pinjamKeperluan, pinjamSampai);
    setPinjamModalAsset(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-teal-600" />
            Inventaris & Manajemen Aset Kantor
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Database inventaris perlengkapan dinas, tracking peminjaman laptop/kendaraan, dan pelabelan QR Code aset.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Cetak Label QR
          </button>
          <button
            id="btn-add-asset"
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Registrasi Aset Baru
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Semua Aset' },
            { id: 'tersedia', label: 'Tersedia' },
            { id: 'dipinjam', label: 'Sedang Dipinjam' },
            { id: 'maintenance', label: 'Maintenance' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-teal-600 text-white shadow-xs'
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
            placeholder="Cari kode aset, nama barang, lokasi..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-none"
          />
        </div>
      </div>

      {/* Grid Cards of Assets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredList.length === 0 ? (
          <div className="col-span-3 bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            <Package className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold">Tidak ada barang inventaris yang ditemukan.</p>
          </div>
        ) : (
          filteredList.map((asset) => (
            <div
              key={asset.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-300 shadow-xs hover:shadow-md p-5 transition-all flex flex-col justify-between space-y-4"
            >
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                    {asset.kodeAset}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                      asset.status === 'tersedia'
                        ? 'bg-emerald-100 text-emerald-800'
                        : asset.status === 'dipinjam'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {asset.status === 'tersedia' ? '● Tersedia' : asset.status === 'dipinjam' ? '⚡ Dipinjam' : '🛠 Maintenance'}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm mt-1">{asset.namaAset}</h4>
                <p className="text-xs text-slate-500 uppercase">{asset.kategori} • {asset.departemen}</p>
              </div>

              {/* Location & Details */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Lokasi:</span>
                  <strong className="text-slate-800">{asset.lokasi}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kondisi Fisik:</span>
                  <span className="font-semibold text-emerald-700 capitalize">{asset.kondisi.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nilai Perolehan:</span>
                  <strong className="text-slate-900 font-mono">Rp {asset.nilaiAset.toLocaleString('id-ID')}</strong>
                </div>
                {asset.peminjamSaatIni && (
                  <div className="flex justify-between text-amber-900 font-bold pt-1 border-t border-slate-200">
                    <span>Dipinjam Oleh:</span>
                    <span>{asset.peminjamSaatIni.nama}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                {asset.status === 'tersedia' ? (
                  <button
                    onClick={() => setPinjamModalAsset(asset)}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    Pinjamkan Aset
                  </button>
                ) : (
                  <button
                    onClick={() => returnAsset(asset.id, 'baik')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <RotateCcw className="w-3 h-3" /> Kembalikan Aset
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Registrasi Aset Baru */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Registrasi Aset Inventaris Kantor Baru"
        subtitle="Barang akan mendapatkan nomor inventaris dan barcode QR pelacakan aset"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateAsset} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Barang / Aset *</label>
            <input
              type="text"
              required
              value={formNama}
              onChange={(e) => setFormNama(e.target.value)}
              placeholder="Contoh: Laptop ThinkPad X1 Carbon Gen 12 (Core Ultra 7)"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-teal-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori Aset</label>
              <select
                value={formKategori}
                onChange={(e) => setFormKategori(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-teal-500"
              >
                <option value="elektronik">Elektronik & IT</option>
                <option value="kendaraan">Kendaraan Dinas</option>
                <option value="furniture">Furnitur & Kantor</option>
                <option value="peralatan">Peralatan Ruang Rapat</option>
                <option value="atk">ATK / Sarana Kerja</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Departemen Penanggung Jawab</label>
              <select
                value={formDept}
                onChange={(e) => setFormDept(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-teal-500"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.nama}>{d.nama}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Lokasi Ruangan</label>
              <input
                type="text"
                value={formLokasi}
                onChange={(e) => setFormLokasi(e.target.value)}
                placeholder="Ruang IT Lantai 2"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nilai Perolehan (Rp)</label>
              <input
                type="number"
                value={formNilai}
                onChange={(e) => setFormNilai(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kondisi Awal</label>
              <select
                value={formKondisi}
                onChange={(e) => setFormKondisi(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-teal-500"
              >
                <option value="baik">Baik (100%)</option>
                <option value="butuh_perbaikan">Butuh Perbaikan</option>
                <option value="rusak">Rusak</option>
              </select>
            </div>
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
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-xs"
            >
              Simpan Inventaris
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Pinjamkan Aset */}
      <Modal
        isOpen={!!pinjamModalAsset}
        onClose={() => setPinjamModalAsset(null)}
        title="Formulir Peminjaman Aset Kantor"
        subtitle={`Aset: ${pinjamModalAsset?.kodeAset} - ${pinjamModalAsset?.namaAset}`}
        maxWidth="md"
      >
        <form onSubmit={handleProcessPinjam} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Pegawai Peminjam *</label>
            <select
              value={pinjamPeminjam}
              onChange={(e) => setPinjamPeminjam(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-teal-500 font-semibold"
            >
              {users.map(u => (
                <option key={u.id} value={u.name}>{u.name} ({u.roleLabel})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Keperluan Peminjaman</label>
            <input
              type="text"
              value={pinjamKeperluan}
              onChange={(e) => setPinjamKeperluan(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Batas Waktu Pengembalian</label>
            <input
              type="date"
              value={pinjamSampai}
              onChange={(e) => setPinjamSampai(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-teal-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setPinjamModalAsset(null)}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-xs"
            >
              Konfirmasi Peminjaman
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
