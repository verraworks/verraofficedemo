export type UserRole = 
  | 'superadmin' 
  | 'pimpinan' 
  | 'hr' 
  | 'finance' 
  | 'staff' 
  | 'admin_surat';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  department: string;
  position: string;
  avatar: string;
  phone: string;
  nip?: string;
  signatureUrl?: string;
}

export type PriorityLevel = 'biasa' | 'penting' | 'rahasia' | 'sangat_segera';

export type SuratStatus = 'baru' | 'disposisi' | 'diproses' | 'selesai' | 'diarsipkan';

export interface SuratMasuk {
  id: string;
  nomorSurat: string;
  nomorAgenda: string;
  tanggalSurat: string;
  tanggalTerima: string;
  asalSurat: string;
  perihal: string;
  kategori: string;
  prioritas: PriorityLevel;
  tujuanDisposisi: string[];
  ringkasanIsi: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  status: SuratStatus;
  disposisiCount: number;
  riwayat: {
    tanggal: string;
    oleh: string;
    aksi: string;
    keterangan?: string;
  }[];
}

export type SuratKeluarStatus = 'draft' | 'menunggu_approval' | 'disetujui' | 'ditandatangani' | 'terkirim' | 'diarsipkan';

export interface SuratKeluar {
  id: string;
  nomorSurat: string;
  tanggalSurat: string;
  tujuanSurat: string;
  instansiTujuan: string;
  perihal: string;
  klasifikasi: string;
  pembuatId: string;
  pembuatNama: string;
  departemen: string;
  penandatanganId: string;
  penandatanganNama: string;
  status: SuratKeluarStatus;
  isiSurat: string;
  fileUrl?: string;
  fileName?: string;
  signatureStamp?: {
    signedBy: string;
    signedAt: string;
    signatureId: string;
    qrCodeUrl: string;
  };
  approvalHistory: {
    tahap: string;
    approver: string;
    status: 'pending' | 'approved' | 'rejected';
    tanggal?: string;
    catatan?: string;
  }[];
}

export interface DisposisiItem {
  id: string;
  suratMasukId: string;
  nomorSurat: string;
  asalSurat: string;
  perihal: string;
  dariPimpinan: string;
  tujuanPegawaiId: string;
  tujuanPegawaiNama: string;
  departemenTujuan: string;
  instruksi: string[]; // e.g., ["Tindak lanjuti", "Siapkan bahan", "Koordinasikan"]
  catatanInstruksi: string;
  prioritas: PriorityLevel;
  deadline: string;
  tanggalDisposisi: string;
  status: 'belum_dibuka' | 'dikerjakan' | 'selesai';
  laporanPenyelesaian?: string;
  tanggalSelesai?: string;
}

export interface DokumenArsip {
  id: string;
  nomorDokumen: string;
  judul: string;
  kategori: string;
  departemen: string;
  tanggalUnggah: string;
  diunggahOleh: string;
  ukuranFile: string;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'image';
  tags: string[];
  versi: string;
  masaRetensi: string;
  tingkatAkses: 'publik' | 'internal' | 'rahasia' | 'terbatas';
  deskripsi: string;
  riwayatVersi: {
    versi: string;
    tanggal: string;
    diubahOleh: string;
    catatan: string;
  }[];
  downloadCount: number;
}

export type FormType = 
  | 'permintaan_barang'
  | 'peminjaman_aset'
  | 'izin_cuti'
  | 'perjalanan_dinas'
  | 'lembur'
  | 'permintaan_dokumen'
  | 'pengajuan_pembayaran'
  | 'pengajuan_fasilitas';

export interface FormSubmission {
  id: string;
  nomorPengajuan: string;
  formType: FormType | string;
  formTitle: string;
  pemohonId: string;
  pemohonNama: string;
  pemohonJabatan?: string;
  departemen: string;
  tanggalPengajuan: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  prioritas: PriorityLevel;
  data: Record<string, any>;
  formData?: Record<string, any>;
  biayaEstimasi?: number;
  lampiranName?: string;
  approvers: {
    level?: number;
    urutan?: number;
    role: string;
    userName: string;
    pejabatNama?: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewedAt?: string;
    notes?: string;
    signatureUrl?: string;
  }[];
  tahapanApproval?: {
    urutan?: number;
    level?: number;
    role: string;
    pejabatNama?: string;
    userName?: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewedAt?: string;
    notes?: string;
  }[];
  catatanPersetujuan?: string;
}

export interface ESignatureRecord {
  id: string;
  documentTitle: string;
  documentNumber: string;
  signedBy: string;
  signerPosition: string;
  signedAt: string;
  hashSha256: string;
  certificateNumber: string;
  status: 'valid' | 'revoked';
  qrCodeUrl: string;
  signatureImageBase64?: string;
}

export interface MemoInternal {
  id: string;
  nomorMemo: string;
  judul: string;
  pengirimId: string;
  pengirimNama: string;
  pengirimJabatan: string;
  tujuan: 'semua' | 'departemen' | 'spesifik';
  targetDepartemen?: string[];
  targetUserIds?: string[];
  tanggal: string;
  kategori: 'pengumuman' | 'kebijakan' | 'surat_edaran' | 'darurat';
  prioritas: PriorityLevel;
  isiMemo: string;
  lampiranName?: string;
  dibacaOleh: {
    userId: string;
    userName: string;
    waktu: string;
  }[];
}

export interface CalendarEvent {
  id: string;
  judul: string;
  tanggal: string;
  waktuMulai: string;
  waktuSelesai: string;
  kategori: 'rapat' | 'kunjungan' | 'deadline' | 'acara' | 'jadwal_pimpinan';
  lokasi: string;
  tipeLokasi: 'ruang_rapat' | 'zoom' | 'luar_kantor';
  peserta: string[];
  penanggungJawab: string;
  departemen: string;
  catatan?: string;
  linkMeeting?: string;
}

export interface TaskItem {
  id: string;
  judul: string;
  deskripsi: string;
  penanggungJawabId: string;
  penanggungJawabNama: string;
  penanggungJawabAvatar: string;
  departemen: string;
  deadline: string;
  prioritas: PriorityLevel;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  subtasks: { id: string; judul: string; selesai: boolean }[];
  tags: string[];
  lampiranCount: number;
}

export interface AssetInventory {
  id: string;
  kodeAset: string;
  namaAset: string;
  kategori: 'elektronik' | 'kendaraan' | 'furniture' | 'peralatan' | 'atk';
  lokasi: string;
  kondisi: 'baik' | 'butuh_perbaikan' | 'rusak';
  penanggungJawab: string;
  departemen: string;
  tanggalPengadaan: string;
  nilaiAset: number;
  status: 'tersedia' | 'dipinjam' | 'maintenance' | 'afkir';
  peminjamSaatIni?: {
    nama: string;
    keperluan: string;
    sejak: string;
    sampai: string;
  };
  riwayatPeminjaman: {
    peminjam: string;
    tanggalPinjam: string;
    tanggalKembali: string;
    kondisiKembali: string;
  }[];
}

export interface GuestBookEntry {
  id: string;
  namaTamu: string;
  instansi: string;
  kontak: string;
  keperluan: string;
  orangDituju: string;
  departemenDituju: string;
  waktuDatang: string;
  waktuKeluar?: string;
  status: 'menunggu' | 'sedang_bertemu' | 'selesai';
  nomorBadge: string;
  fotoUrl?: string;
  catatan?: string;
}

export interface NotificationItem {
  id: string;
  tipe: 'surat' | 'disposisi' | 'approval' | 'tugas' | 'tamu' | 'memo';
  judul: string;
  pesan: string;
  waktu: string;
  dibaca: boolean;
  linkTab?: string;
  targetId?: string;
}

export interface Department {
  id: string;
  kode: string;
  nama: string;
  kepala: string;
  jumlahStaff: number;
  lokasi: string;
  email: string;
}

export interface OfficeSettings {
  namaInstansi: string;
  namaPerusahaanLengkap: string;
  alamat: string;
  telepon: string;
  email: string;
  website: string;
  formatNomorSurat: string;
  autoNumberPrefix: string;
  pimpinanNama: string;
  pimpinanJabatan: string;
  pimpinanNip: string;
  logoUrl: string;
  kopSuratAktif: boolean;
  watermarkDigital: boolean;
}
