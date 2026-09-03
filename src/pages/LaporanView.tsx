import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Filter,
  FileSpreadsheet,
  TrendingUp,
  Inbox,
  Send,
  GitPullRequest,
  CheckCircle2,
  TreePine,
  DollarSign,
  Clock,
  Sparkles
} from 'lucide-react';
import { useOffice } from '../context/OfficeContext';

export const LaporanView: React.FC = () => {
  const {
    suratMasuk,
    suratKeluar,
    disposisi,
    formSubmissions,
    dokumen,
    paperlessStats,
    departments
  } = useOffice();

  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedDept, setSelectedDept] = useState('all');

  const monthlyData = [
    { bulan: 'Jan', masuk: 24, keluar: 18, disposisi: 22, hematKertas: 120 },
    { bulan: 'Feb', masuk: 30, keluar: 22, disposisi: 28, hematKertas: 145 },
    { bulan: 'Mar', masuk: 28, keluar: 25, disposisi: 26, hematKertas: 130 },
    { bulan: 'Apr', masuk: 35, keluar: 29, disposisi: 32, hematKertas: 160 },
    { bulan: 'Mei', masuk: 42, keluar: 36, disposisi: 39, hematKertas: 195 },
    { bulan: 'Jun', masuk: 38, keluar: 31, disposisi: 35, hematKertas: 175 },
    { bulan: 'Jul', masuk: 45, keluar: 40, disposisi: 43, hematKertas: 210 },
    { bulan: 'Agu', masuk: 50, keluar: 44, disposisi: 48, hematKertas: 235 },
    { bulan: 'Sep', masuk: suratMasuk.length, keluar: suratKeluar.length, disposisi: disposisi.length, hematKertas: 260 }
  ];

  const handleExportCSV = () => {
    let csv = "Bulan,Surat Masuk,Surat Keluar,Disposisi,Kertas Dihemat (Lembar)\n";
    monthlyData.forEach(row => {
      csv += `${row.bulan},${row.masuk},${row.keluar},${row.disposisi},${row.hematKertas}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Eksekutif_VerraOffice_${selectedYear}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Laporan Eksekutif & Analitik Administrasi Digital
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistik komprehensif volume persuratan, kecepatan disposisi, tingkat kepatuhan approval, dan penghematan biaya paperless.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" /> Ekspor ke Excel / CSV
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Cetak Laporan
          </button>
        </div>
      </div>

      {/* 4 Pillars Eco-Office Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-5 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-100 text-xs font-bold">
            <span>Kertas Dihemat</span>
            <TreePine className="w-4 h-4 text-emerald-300" />
          </div>
          <p className="text-2xl font-black">{paperlessStats.kertasDihematLembar.toLocaleString('id-ID')} Lembar</p>
          <p className="text-[11px] text-emerald-100">{paperlessStats.rimKertasDihemat} Rim kertas A4</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-blue-100 text-xs font-bold">
            <span>Biaya Cetak Dihemat</span>
            <DollarSign className="w-4 h-4 text-blue-300" />
          </div>
          <p className="text-2xl font-black">Rp {(paperlessStats.biayaPercetakanDihemat).toLocaleString('id-ID')}</p>
          <p className="text-[11px] text-blue-100">Toner printer, kertas, & kurir fisik</p>
        </div>

        <div className="bg-gradient-to-br from-amber-600 to-orange-700 text-white p-5 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-100 text-xs font-bold">
            <span>Pohon Terselamatkan</span>
            <TreePine className="w-4 h-4 text-amber-300" />
          </div>
          <p className="text-2xl font-black">{paperlessStats.pohonTerselamatkan} Pohon</p>
          <p className="text-[11px] text-amber-100">Pengurangan jejak karbon instansi</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-violet-700 text-white p-5 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-purple-100 text-xs font-bold">
            <span>Waktu Kerja Terhemat</span>
            <Clock className="w-4 h-4 text-purple-300" />
          </div>
          <p className="text-2xl font-black">{paperlessStats.jamKerjaDihemat} Jam</p>
          <p className="text-[11px] text-purple-100">Efisiensi pencarian arsip & disposisi</p>
        </div>
      </div>

      {/* Monthly Trends Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Rekapitulasi Persuratan Bulanan ({selectedYear})</h3>
            <p className="text-xs text-slate-500">Pergerakan arus dokumen dan kepatuhan penyelesaian disposisi</p>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-700 outline-none"
          >
            <option value="2026">Tahun Anggaran 2026</option>
            <option value="2025">Tahun Anggaran 2025</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Bulan</th>
                <th className="py-3 px-4">Surat Masuk</th>
                <th className="py-3 px-4">Surat Keluar</th>
                <th className="py-3 px-4">Disposisi Diterbitkan</th>
                <th className="py-3 px-4">Kertas Terhemat</th>
                <th className="py-3 px-4 text-right">Tingkat Digitalisasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monthlyData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{row.bulan} {selectedYear}</td>
                  <td className="py-3 px-4 font-semibold text-blue-700">{row.masuk} Dokumen</td>
                  <td className="py-3 px-4 font-semibold text-emerald-700">{row.keluar} Dokumen</td>
                  <td className="py-3 px-4 font-semibold text-amber-700">{row.disposisi} Lembar</td>
                  <td className="py-3 px-4 font-bold text-emerald-800">{row.hematKertas} Lembar</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> 100% Paperless
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Distribusi Beban Dokumen Berdasarkan Unit Kerja</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {departments.map((dept) => {
            const deptDocs = dokumen.filter(d => d.departemen === dept.nama).length;
            const deptForms = formSubmissions.filter(f => f.departemen === dept.nama).length;
            return (
              <div key={dept.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-900 text-xs">{dept.nama}</h4>
                  <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border text-slate-600">{dept.kode}</span>
                </div>
                <p className="text-[11px] text-slate-500">Kepala Unit: {dept.kepalaNama}</p>
                <div className="pt-2 border-t border-slate-200/80 flex justify-between text-[11px]">
                  <span>Arsip: <strong>{deptDocs} berkas</strong></span>
                  <span>Formulir: <strong>{deptForms} diajukan</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
