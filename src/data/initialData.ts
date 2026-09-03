import { 
  User, 
  SuratMasuk, 
  SuratKeluar, 
  DisposisiItem, 
  DokumenArsip, 
  FormSubmission, 
  ESignatureRecord, 
  MemoInternal, 
  CalendarEvent, 
  TaskItem, 
  AssetInventory, 
  GuestBookEntry, 
  NotificationItem, 
  Department, 
  OfficeSettings 
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Dr. Ir. Hendra Wijaya, M.M.',
    email: 'hendra.wijaya@verraoffice.id',
    role: 'pimpinan',
    roleLabel: 'Direktur Utama / Pimpinan',
    department: 'Direksi & Manajemen',
    position: 'Direktur Utama',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    phone: '0812-3456-7890',
    nip: '19750812 199903 1 002',
    signatureUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="60"><text x="10" y="45" font-family="cursive" font-size="28" fill="%231e3a8a">Hendra Wijaya</text></svg>'
  },
  {
    id: 'usr-2',
    name: 'Siti Rahmawati, S.Psi., M.HRM.',
    email: 'siti.rahma@verraoffice.id',
    role: 'hr',
    roleLabel: 'Kepala Bagian SDM / HRD',
    department: 'Human Resources (SDM)',
    position: 'Head of Human Resources',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    phone: '0813-8901-2345',
    nip: '19840215 200801 2 007'
  },
  {
    id: 'usr-3',
    name: 'Dimas Pratama, S.E., Ak., CA',
    email: 'dimas.pratama@verraoffice.id',
    role: 'finance',
    roleLabel: 'Kepala Bagian Keuangan',
    department: 'Keuangan & Akuntansi',
    position: 'Finance & Budgeting Manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    phone: '0811-9876-5432',
    nip: '19871103 201102 1 004'
  },
  {
    id: 'usr-4',
    name: 'Anisa Putri Maharani, S.I.Kom.',
    email: 'anisa.sekretariat@verraoffice.id',
    role: 'admin_surat',
    roleLabel: 'Sekretariat & Admin Surat',
    department: 'Sekretariat & Tata Usaha',
    position: 'Sekretaris Eksekutif',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
    phone: '0857-1234-5678',
    nip: '19920620 201604 2 009'
  },
  {
    id: 'usr-5',
    name: 'Budi Santoso, S.T., M.Kom.',
    email: 'budi.santoso@verraoffice.id',
    role: 'superadmin',
    roleLabel: 'Super Administrator & IT',
    department: 'Teknologi Informasi (IT)',
    position: 'IT Infrastructure & Security Lead',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    phone: '0815-6789-0123',
    nip: '19890412 201301 1 005'
  },
  {
    id: 'usr-6',
    name: 'Rian Hidayat, S.Kom.',
    email: 'rian.hidayat@verraoffice.id',
    role: 'staff',
    roleLabel: 'Staf Operasional',
    department: 'Operasional & Layanan',
    position: 'Staf Administrasi Operasional',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
    phone: '0821-4567-8901',
    nip: '19960914 202012 1 003'
  }
];

export const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'dept-1', kode: 'DIR', nama: 'Direksi & Manajemen', kepala: 'Dr. Ir. Hendra Wijaya, M.M.', jumlahStaff: 4, lokasi: 'Lantai 4 Gedung Utama', email: 'direksi@verraoffice.id' },
  { id: 'dept-2', kode: 'SEK', nama: 'Sekretariat & Tata Usaha', kepala: 'Anisa Putri Maharani, S.I.Kom.', jumlahStaff: 6, lokasi: 'Lantai 3 Sayap Barat', email: 'sekretariat@verraoffice.id' },
  { id: 'dept-3', kode: 'HRD', nama: 'Human Resources (SDM)', kepala: 'Siti Rahmawati, S.Psi., M.HRM.', jumlahStaff: 8, lokasi: 'Lantai 2 Sayap Timur', email: 'hrd@verraoffice.id' },
  { id: 'dept-4', kode: 'FIN', nama: 'Keuangan & Akuntansi', kepala: 'Dimas Pratama, S.E., Ak., CA', jumlahStaff: 7, lokasi: 'Lantai 2 Sayap Barat', email: 'keuangan@verraoffice.id' },
  { id: 'dept-5', kode: 'ITD', nama: 'Teknologi Informasi (IT)', kepala: 'Budi Santoso, S.T., M.Kom.', jumlahStaff: 5, lokasi: 'Lantai 1 Ruang Server & IT', email: 'it@verraoffice.id' },
  { id: 'dept-6', kode: 'OPS', nama: 'Operasional & Layanan', kepala: 'Ir. Ahmad Fadilah', jumlahStaff: 14, lokasi: 'Lantai 1 Sayap Selatan', email: 'operasional@verraoffice.id' }
];

export const INITIAL_SETTINGS: OfficeSettings = {
  namaInstansi: 'VerraOffice Digital System',
  namaPerusahaanLengkap: 'PT VERRA MULTI SINERGI PERSADA',
  alamat: 'Graha Sinergi Tower Lt. 12, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan 12190',
  telepon: '(021) 5798-2200',
  email: 'official@verraoffice.id',
  website: 'https://verraoffice.id',
  formatNomorSurat: '{NO}/{KODE_DEPT}/VERRA/{BULAN_ROMAWI}/{TAHUN}',
  autoNumberPrefix: '045.2',
  pimpinanNama: 'Dr. Ir. Hendra Wijaya, M.M.',
  pimpinanJabatan: 'Direktur Utama',
  pimpinanNip: '19750812 199903 1 002',
  logoUrl: '',
  kopSuratAktif: true,
  watermarkDigital: true
};

export const INITIAL_SURAT_MASUK: SuratMasuk[] = [
  {
    id: 'sm-001',
    nomorSurat: '028/UND-KEMENKEU/IX/2026',
    nomorAgenda: 'AG-SM-2026-09-001',
    tanggalSurat: '2026-09-01',
    tanggalTerima: '2026-09-02',
    asalSurat: 'Kementerian Keuangan Republik Indonesia',
    perihal: 'Undangan Koordinasi Penerapan Tata Kelola Digital Sektor Korporasi',
    kategori: 'Undangan Resmi',
    prioritas: 'penting',
    tujuanDisposisi: ['usr-1', 'usr-3'],
    ringkasanIsi: 'Permohonan kehadiran Direksi dalam rapat kerja koordinasi implementasi e-Gov dan standardisasi digital invoice pada tanggal 10 September 2026 di Gedung Djuanda I.',
    fileUrl: '#',
    fileName: 'Undangan_Kemenkeu_028_IX_2026.pdf',
    fileSize: '1.4 MB',
    status: 'disposisi',
    disposisiCount: 1,
    riwayat: [
      { tanggal: '2026-09-02 08:30', oleh: 'Anisa Putri Maharani', aksi: 'Registrasi Surat Masuk & Scan Berkas' },
      { tanggal: '2026-09-02 09:15', oleh: 'Dr. Ir. Hendra Wijaya', aksi: 'Memberikan Lembar Disposisi ke Kabag Keuangan' }
    ]
  },
  {
    id: 'sm-002',
    nomorSurat: 'B-1422/OJK.03/2026',
    nomorAgenda: 'AG-SM-2026-09-002',
    tanggalSurat: '2026-08-30',
    tanggalTerima: '2026-09-01',
    asalSurat: 'Otoritas Jasa Keuangan (OJK)',
    perihal: 'Pemberitahuan Audit Kepatuhan Sistem Manajemen Informasi Q3 2026',
    kategori: 'Pemberitahuan / Regulasi',
    prioritas: 'sangat_segera',
    tujuanDisposisi: ['usr-1', 'usr-5'],
    ringkasanIsi: 'Pemberitahuan jadwal pelaksanaan audit kesiapan kepatuhan perlindungan data pribadi dan disaster recovery sistem kantor digital terintegrasi.',
    fileUrl: '#',
    fileName: 'Surat_OJK_Audit_Q3_2026.pdf',
    fileSize: '2.1 MB',
    status: 'diproses',
    disposisiCount: 1,
    riwayat: [
      { tanggal: '2026-09-01 10:00', oleh: 'Anisa Putri Maharani', aksi: 'Penerimaan surat & upload digital' },
      { tanggal: '2026-09-01 11:20', oleh: 'Dr. Ir. Hendra Wijaya', aksi: 'Disposisi kepada Tim IT untuk persiapan bahan audit' },
      { tanggal: '2026-09-02 08:00', oleh: 'Budi Santoso', aksi: 'Mulai menyusun dokumen kepatuhan server' }
    ]
  },
  {
    id: 'sm-003',
    nomorSurat: '788/SP/TELKOM-ENT/VIII/2026',
    nomorAgenda: 'AG-SM-2026-08-089',
    tanggalSurat: '2026-08-28',
    tanggalTerima: '2026-08-29',
    asalSurat: 'PT Telkom Indonesia Enterprise',
    perihal: 'Penawaran Perpanjangan Dedicated Leased Line 1Gbps & Cloud Backup',
    kategori: 'Penawaran Kerjasama',
    prioritas: 'biasa',
    tujuanDisposisi: ['usr-5'],
    ringkasanIsi: 'Proposal renewal kontrak jaringan leased line kantor pusat dengan diskon bundling tier enterprise untuk periode 2026-2028.',
    fileUrl: '#',
    fileName: 'Proposal_Telkom_Dedicated_Line.pdf',
    fileSize: '3.8 MB',
    status: 'selesai',
    disposisiCount: 1,
    riwayat: [
      { tanggal: '2026-08-29 13:40', oleh: 'Anisa Putri Maharani', aksi: 'Registrasi surat masuk' },
      { tanggal: '2026-08-30 09:00', oleh: 'Dr. Ir. Hendra Wijaya', aksi: 'Disposisi ke IT untuk evaluasi teknis' },
      { tanggal: '2026-08-31 16:00', oleh: 'Budi Santoso', aksi: 'Selesai dievaluasi dan disetujui untuk perpanjangan' }
    ]
  },
  {
    id: 'sm-004',
    nomorSurat: '091/DIR-BCA/KORP/IX/2026',
    nomorAgenda: 'AG-SM-2026-09-003',
    tanggalSurat: '2026-09-02',
    tanggalTerima: '2026-09-02',
    asalSurat: 'PT Bank Central Asia Tbk',
    perihal: 'Konfirmasi Rekening Koran & Fasilitas Payroll Perusahaan Periode Agustus',
    kategori: 'Keuangan & Perbankan',
    prioritas: 'penting',
    tujuanDisposisi: ['usr-3'],
    ringkasanIsi: 'Penyampaian rekening koran resmi terenkripsi dan konfirmasi keberhasilan eksekusi payroll seluruh karyawan.',
    fileUrl: '#',
    fileName: 'BCA_Statement_Payroll_Aug2026.pdf',
    fileSize: '950 KB',
    status: 'baru',
    disposisiCount: 0,
    riwayat: [
      { tanggal: '2026-09-02 09:45', oleh: 'Anisa Putri Maharani', aksi: 'Registrasi surat masuk baru' }
    ]
  }
];

export const INITIAL_SURAT_KELUAR: SuratKeluar[] = [
  {
    id: 'sk-001',
    nomorSurat: '089/DIR/VERRA/IX/2026',
    tanggalSurat: '2026-09-02',
    tujuanSurat: 'Sekretaris Jenderal Kementerian Komunikasi dan Digital',
    instansiTujuan: 'Kementerian Komdigi RI',
    perihal: 'Permohonan Integrasi Sertifikasi Tanda Tangan Elektronik Berinduk',
    klasifikasi: 'Surat Permohonan',
    pembuatId: 'usr-4',
    pembuatNama: 'Anisa Putri Maharani',
    departemen: 'Sekretariat & Tata Usaha',
    penandatanganId: 'usr-1',
    penandatanganNama: 'Dr. Ir. Hendra Wijaya, M.M.',
    status: 'disetujui',
    isiSurat: 'Dengan hormat, sehubungan dengan akselerasi sistem paperless perkantoran pada PT Verra Multi Sinergi, kami bermaksud mengajukan permohonan fasilitasi integrasi sertifikasi tanda tangan elektronik berinduk guna menjamin keaslian dan legalitas dokumen digital kami...',
    fileName: 'Surat_Permohonan_Komdigi_089.pdf',
    signatureStamp: {
      signedBy: 'Dr. Ir. Hendra Wijaya, M.M.',
      signedAt: '2026-09-02 09:30 WIB',
      signatureId: 'VERRA-ESIGN-20260902-88219',
      qrCodeUrl: 'https://verraoffice.id/verify/VERRA-ESIGN-20260902-88219'
    },
    approvalHistory: [
      { tahap: 'Konsep Surat', approver: 'Anisa Putri Maharani', status: 'approved', tanggal: '2026-09-01 14:00', catatan: 'Draf surat siap dinaikkan ke Pimpinan' },
      { tahap: 'Review Legalitas', approver: 'Siti Rahmawati', status: 'approved', tanggal: '2026-09-01 16:30', catatan: 'Bahasa dan rujukan perundangan sudah sesuai' },
      { tahap: 'Tanda Tangan Pimpinan', approver: 'Dr. Ir. Hendra Wijaya', status: 'approved', tanggal: '2026-09-02 09:30', catatan: 'Disetujui dan ditandatangani secara digital' }
    ]
  },
  {
    id: 'sk-002',
    nomorSurat: '090/HRD/VERRA/IX/2026',
    tanggalSurat: '2026-09-02',
    tujuanSurat: 'Seluruh Karyawan dan Staf PT Verra Multi Sinergi',
    instansiTujuan: 'Internal Perusahaan',
    perihal: 'Surat Edaran Pelaksanaan Evaluasi Kinerja Semester II & Digital Work Policy',
    klasifikasi: 'Surat Edaran',
    pembuatId: 'usr-2',
    pembuatNama: 'Siti Rahmawati, S.Psi.',
    departemen: 'Human Resources (SDM)',
    penandatanganId: 'usr-1',
    penandatanganNama: 'Dr. Ir. Hendra Wijaya, M.M.',
    status: 'menunggu_approval',
    isiSurat: 'Diberitahukan kepada seluruh pegawai bahwa pengisian form evaluasi kinerja semester II akan dilakukan secara mandiri melalui modul Formulir Digital VerraOffice mulai tanggal 5 September 2026...',
    fileName: 'SE_Evaluasi_Kinerja_Sem2_2026.pdf',
    approvalHistory: [
      { tahap: 'Penyusunan HR', approver: 'Siti Rahmawati', status: 'approved', tanggal: '2026-09-02 08:30', catatan: 'Lampiran panduan KPI terlampir' },
      { tahap: 'Persetujuan Direktur Utama', approver: 'Dr. Ir. Hendra Wijaya', status: 'pending', catatan: 'Menunggu review akhir' }
    ]
  },
  {
    id: 'sk-003',
    nomorSurat: '091/FIN/VERRA/IX/2026',
    tanggalSurat: '2026-09-03',
    tujuanSurat: 'Pimpinan Cabang Utama Bank Mandiri Sudirman',
    instansiTujuan: 'PT Bank Mandiri (Persero) Tbk',
    perihal: 'Instruksi Pemindahan Rekening Giro Operasional & Rekonsiliasi E-Payment',
    klasifikasi: 'Surat Keuangan',
    pembuatId: 'usr-3',
    pembuatNama: 'Dimas Pratama, S.E.',
    departemen: 'Keuangan & Akuntansi',
    penandatanganId: 'usr-1',
    penandatanganNama: 'Dr. Ir. Hendra Wijaya, M.M.',
    status: 'draft',
    isiSurat: 'Berdasarkan keputusan rapat koordinasi internal, kami instruksikan perihal administrasi pemindahan pos dana cadangan operasional kuartal IV...',
    approvalHistory: [
      { tahap: 'Draf Keuangan', approver: 'Dimas Pratama', status: 'pending' }
    ]
  }
];

export const INITIAL_DISPOSISI: DisposisiItem[] = [
  {
    id: 'disp-001',
    suratMasukId: 'sm-001',
    nomorSurat: '028/UND-KEMENKEU/IX/2026',
    asalSurat: 'Kementerian Keuangan RI',
    perihal: 'Undangan Koordinasi Penerapan Tata Kelola Digital Sektor Korporasi',
    dariPimpinan: 'Dr. Ir. Hendra Wijaya, M.M.',
    tujuanPegawaiId: 'usr-3',
    tujuanPegawaiNama: 'Dimas Pratama, S.E., Ak., CA',
    departemenTujuan: 'Keuangan & Akuntansi',
    instruksi: ['Hadir / Wakili', 'Siapkan Bahan Paparan', 'Koordinasikan dengan IT'],
    catatanInstruksi: 'Mohon dampingi saya pada rapat tanggal 10 September di Kemenkeu. Siapkan laporan statistik penghematan kertas dan sistem e-invoice kantor kita.',
    prioritas: 'penting',
    deadline: '2026-09-08',
    tanggalDisposisi: '2026-09-02 09:15',
    status: 'dikerjakan'
  },
  {
    id: 'disp-002',
    suratMasukId: 'sm-002',
    nomorSurat: 'B-1422/OJK.03/2026',
    asalSurat: 'Otoritas Jasa Keuangan (OJK)',
    perihal: 'Pemberitahuan Audit Kepatuhan Sistem Manajemen Informasi Q3 2026',
    dariPimpinan: 'Dr. Ir. Hendra Wijaya, M.M.',
    tujuanPegawaiId: 'usr-5',
    tujuanPegawaiNama: 'Budi Santoso, S.T., M.Kom.',
    departemenTujuan: 'Teknologi Informasi (IT)',
    instruksi: ['Tindak Lanjuti Segera', 'Laporkan Hasilnya', 'Siapkan Dokumen Pendukung'],
    catatanInstruksi: 'Audit akan berlangsung tanggal 18 September. Pastikan seluruh log enkripsi, sertifikat SSL, dan simulasi disaster recovery sudah terdokumentasi lengkap.',
    prioritas: 'sangat_segera',
    deadline: '2026-09-12',
    tanggalDisposisi: '2026-09-01 11:20',
    status: 'dikerjakan'
  },
  {
    id: 'disp-003',
    suratMasukId: 'sm-003',
    nomorSurat: '788/SP/TELKOM-ENT/VIII/2026',
    asalSurat: 'PT Telkom Indonesia Enterprise',
    perihal: 'Penawaran Perpanjangan Dedicated Leased Line 1Gbps',
    dariPimpinan: 'Dr. Ir. Hendra Wijaya, M.M.',
    tujuanPegawaiId: 'usr-5',
    tujuanPegawaiNama: 'Budi Santoso, S.T., M.Kom.',
    departemenTujuan: 'Teknologi Informasi (IT)',
    instruksi: ['Pelajari & Beri Masukan', 'Selesaikan'],
    catatanInstruksi: 'Apakah harga diskon bundling menguntungkan dibandingkan tahun lalu? Jika ya, siapkan berkas PKS perpanjangan.',
    prioritas: 'biasa',
    deadline: '2026-09-05',
    tanggalDisposisi: '2026-08-30 09:00',
    status: 'selesai',
    laporanPenyelesaian: 'Evaluasi selesai. Penawaran bundling menghemat biaya bandwidth sebesar 18% per tahun. Rekomendasi perpanjangan telah dikirim ke Keuangan.',
    tanggalSelesai: '2026-08-31 16:00'
  }
];

export const INITIAL_DOKUMEN_ARSIP: DokumenArsip[] = [
  {
    id: 'doc-001',
    nomorDokumen: 'DOC-REG-2026-004',
    judul: 'Standar Operasional Prosedur (SOP) Tata Naskah Dinas & E-Office Digital 2026',
    kategori: 'SOP & Tata Kelola',
    departemen: 'Sekretariat & Tata Usaha',
    tanggalUnggah: '2026-08-15',
    diunggahOleh: 'Anisa Putri Maharani',
    ukuranFile: '3.2 MB',
    fileType: 'pdf',
    tags: ['SOP', 'Tata Naskah', 'Paperless', 'Pedoman'],
    versi: '2.1',
    masaRetensi: 'Permanen',
    tingkatAkses: 'publik',
    deskripsi: 'Pedoman resmi tata laksana administrasi surat menyurat, format naskah dinas elektronik, alur disposisi digital, dan standar penamaan berkas kantor.',
    riwayatVersi: [
      { versi: '1.0', tanggal: '2025-01-10', diubahOleh: 'Anisa Putri', catatan: 'Rilis awal format SOP konvensional' },
      { versi: '2.0', tanggal: '2026-01-15', diubahOleh: 'Anisa Putri', catatan: 'Pembaruan modul disposisi elektronik' },
      { versi: '2.1', tanggal: '2026-08-15', diubahOleh: 'Anisa Putri', catatan: 'Integrasi modul E-Sign & QR verification' }
    ],
    downloadCount: 48
  },
  {
    id: 'doc-002',
    nomorDokumen: 'DOC-FIN-2026-018',
    judul: 'Laporan Keuangan Audited Semester I Tahun Anggaran 2026',
    kategori: 'Laporan Keuangan',
    departemen: 'Keuangan & Akuntansi',
    tanggalUnggah: '2026-08-20',
    diunggahOleh: 'Dimas Pratama',
    ukuranFile: '4.7 MB',
    fileType: 'pdf',
    tags: ['Keuangan', 'Audit', 'Semester I', 'Neraca', 'Laba Rugi'],
    versi: '1.0',
    masaRetensi: '10 Tahun',
    tingkatAkses: 'rahasia',
    deskripsi: 'Hasil audit independen laporan posisi keuangan, arus kas, dan catatan atas laporan keuangan semester pertama tahun 2026 dengan opini Wajar Tanpa Pengecualian.',
    riwayatVersi: [
      { versi: '1.0', tanggal: '2026-08-20', diubahOleh: 'Dimas Pratama', catatan: 'Arsip resmi hasil audit KAP' }
    ],
    downloadCount: 19
  },
  {
    id: 'doc-003',
    nomorDokumen: 'DOC-HRD-2026-009',
    judul: 'Buku Pedoman Karyawan & Perjanjian Kerja Bersama (PKB) 2026-2028',
    kategori: 'SDM & Personalia',
    departemen: 'Human Resources (SDM)',
    tanggalUnggah: '2026-07-01',
    diunggahOleh: 'Siti Rahmawati',
    ukuranFile: '2.5 MB',
    fileType: 'pdf',
    tags: ['HRD', 'PKB', 'Peraturan Perusahaan', 'Hak & Kewajiban'],
    versi: '1.0',
    masaRetensi: '5 Tahun',
    tingkatAkses: 'internal',
    deskripsi: 'Buku panduan hak, kewajiban, jenjang karir, fasilitas kesehatan, tunjangan, dan peraturan disiplin kerja seluruh karyawan.',
    riwayatVersi: [
      { versi: '1.0', tanggal: '2026-07-01', diubahOleh: 'Siti Rahmawati', catatan: 'Pengesahan bersama Disnaker' }
    ],
    downloadCount: 65
  },
  {
    id: 'doc-004',
    nomorDokumen: 'DOC-ITD-2026-012',
    judul: 'Arsitektur Keamanan Siber & Disaster Recovery Plan VerraOffice Cloud',
    kategori: 'IT & Keamanan',
    departemen: 'Teknologi Informasi (IT)',
    tanggalUnggah: '2026-08-10',
    diunggahOleh: 'Budi Santoso',
    ukuranFile: '5.1 MB',
    fileType: 'pdf',
    tags: ['IT', 'Cybersecurity', 'Disaster Recovery', 'Enkripsi'],
    versi: '3.0',
    masaRetensi: 'Permanen',
    tingkatAkses: 'terbatas',
    deskripsi: 'Dokumentasi topologi jaringan, sertifikasi ISO 27001, konfigurasi multi-region backup, dan skenario mitigasi insiden keamanan informasi.',
    riwayatVersi: [
      { versi: '3.0', tanggal: '2026-08-10', diubahOleh: 'Budi Santoso', catatan: 'Pembaruan enkripsi SHA-256 dan protokol zero-trust' }
    ],
    downloadCount: 23
  }
];

export const INITIAL_FORM_SUBMISSIONS: FormSubmission[] = [
  {
    id: 'form-sub-001',
    nomorPengajuan: 'FPB-2026-09-001',
    formType: 'permintaan_barang',
    formTitle: 'Form Permintaan Barang & Perlengkapan Kerja',
    pemohonId: 'usr-6',
    pemohonNama: 'Rian Hidayat',
    departemen: 'Operasional & Layanan',
    tanggalPengajuan: '2026-09-01',
    status: 'pending',
    prioritas: 'penting',
    biayaEstimasi: 3500000,
    data: {
      itemBarang: '2 Unit Barcode Scanner Wireless & 1 Unit Label Printer',
      keperluan: 'Peralatan digitalisasi barcode aset gudang dan ruang arsip',
      spesifikasi: 'Honeywell Voyager 1400g 2D & Brother QL-800',
      jumlah: '3 Unit',
      estimasiHarga: 'Rp 3.500.000'
    },
    approvers: [
      { level: 1, role: 'Kepala Bagian', userName: 'Ahmad Fadilah', status: 'approved', reviewedAt: '2026-09-01 14:00', notes: 'Dibutuhkan untuk percepatan digitalisasi aset' },
      { level: 2, role: 'Kepala Keuangan', userName: 'Dimas Pratama', status: 'pending', notes: 'Pemeriksaan anggaran pos ATK Q3' },
      { level: 3, role: 'Direktur Utama', userName: 'Dr. Ir. Hendra Wijaya', status: 'pending' }
    ]
  },
  {
    id: 'form-sub-002',
    nomorPengajuan: 'FPD-2026-09-004',
    formType: 'perjalanan_dinas',
    formTitle: 'Form Pengajuan Surat Perintah Perjalanan Dinas (SPPD)',
    pemohonId: 'usr-5',
    pemohonNama: 'Budi Santoso',
    departemen: 'Teknologi Informasi (IT)',
    tanggalPengajuan: '2026-09-02',
    status: 'pending',
    prioritas: 'sangat_segera',
    biayaEstimasi: 4800000,
    data: {
      kotaTujuan: 'Bandung & Yogyakarta',
      tanggalBerangkat: '2026-09-07',
      tanggalKembali: '2026-09-09',
      tujuanKegiatan: 'Instalasi & sinkronisasi server edge kantor perwakilan wilayah Jawa',
      transportasi: 'Kereta Cepat Whoosh & Pesawat',
      uangHarianAkomodasi: 'Rp 4.800.000'
    },
    approvers: [
      { level: 1, role: 'Kepala Bagian SDM', userName: 'Siti Rahmawati', status: 'approved', reviewedAt: '2026-09-02 08:45', notes: 'Surat tugas telah diterbitkan' },
      { level: 2, role: 'Direktur Utama', userName: 'Dr. Ir. Hendra Wijaya', status: 'pending', notes: 'Menunggu persetujuan final' }
    ]
  },
  {
    id: 'form-sub-003',
    nomorPengajuan: 'FIC-2026-08-012',
    formType: 'izin_cuti',
    formTitle: 'Form Pengajuan Izin & Cuti Pegawai',
    pemohonId: 'usr-4',
    pemohonNama: 'Anisa Putri Maharani',
    departemen: 'Sekretariat & Tata Usaha',
    tanggalPengajuan: '2026-08-25',
    status: 'approved',
    prioritas: 'biasa',
    data: {
      jenisCuti: 'Cuti Tahunan',
      tanggalMulai: '2026-09-15',
      tanggalSelesai: '2026-09-17',
      jumlahHari: '3 Hari Kerja',
      alasan: 'Keperluan keluarga di luar kota',
      pelimpahanTugas: 'Rian Hidayat (Staf Operasional)'
    },
    approvers: [
      { level: 1, role: 'Kepala SDM', userName: 'Siti Rahmawati', status: 'approved', reviewedAt: '2026-08-25 10:00', notes: 'Sisa cuti masih 8 hari. Disetujui.' },
      { level: 2, role: 'Direktur Utama', userName: 'Dr. Ir. Hendra Wijaya', status: 'approved', reviewedAt: '2026-08-25 15:30', notes: 'Selamat berlibur, pastikan koordinasi tugas lancar.' }
    ],
    catatanPersetujuan: 'Pengajuan cuti disetujui penuh oleh Direksi.'
  },
  {
    id: 'form-sub-004',
    nomorPengajuan: 'FPA-2026-09-002',
    formType: 'peminjaman_aset',
    formTitle: 'Form Peminjaman Aset & Fasilitas Ruangan',
    pemohonId: 'usr-2',
    pemohonNama: 'Siti Rahmawati',
    departemen: 'Human Resources (SDM)',
    tanggalPengajuan: '2026-09-02',
    status: 'approved',
    prioritas: 'biasa',
    data: {
      asetDipinjam: 'Ruang Rapat Utama Bimasena & 2 Unit Proyektor 4K',
      tanggalPinjam: '2026-09-04 09:00',
      tanggalSelesai: '2026-09-04 16:00',
      keperluan: 'Pelatihan Pelayanan Prima & Workshop Digital Mindset Pegawai Baru'
    },
    approvers: [
      { level: 1, role: 'General Affairs / Pengelola Aset', userName: 'Budi Santoso', status: 'approved', reviewedAt: '2026-09-02 09:10', notes: 'Jadwal ruangan kosong dan siap digunakan.' }
    ]
  }
];

export const INITIAL_E_SIGNATURES: ESignatureRecord[] = [
  {
    id: 'sig-001',
    documentTitle: 'Surat Permohonan Integrasi Sertifikasi TTE Komdigi',
    documentNumber: '089/DIR/VERRA/IX/2026',
    signedBy: 'Dr. Ir. Hendra Wijaya, M.M.',
    signerPosition: 'Direktur Utama',
    signedAt: '2026-09-02 09:30:15 WIB',
    hashSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    certificateNumber: 'CERT-VERRA-BSRE-2026-88219',
    status: 'valid',
    qrCodeUrl: 'https://verraoffice.id/verify/CERT-VERRA-BSRE-2026-88219'
  },
  {
    id: 'sig-002',
    documentTitle: 'Standar Operasional Prosedur Tata Naskah Dinas Digital v2.1',
    documentNumber: 'DOC-REG-2026-004',
    signedBy: 'Dr. Ir. Hendra Wijaya, M.M.',
    signerPosition: 'Direktur Utama',
    signedAt: '2026-08-15 11:20:00 WIB',
    hashSha256: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    certificateNumber: 'CERT-VERRA-BSRE-2026-74102',
    status: 'valid',
    qrCodeUrl: 'https://verraoffice.id/verify/CERT-VERRA-BSRE-2026-74102'
  }
];

export const INITIAL_MEMOS: MemoInternal[] = [
  {
    id: 'memo-001',
    nomorMemo: '014/MEMO-DIR/IX/2026',
    judul: 'Akselerasi 100% Bebas Kertas (Total Paperless Movement) Semester II',
    pengirimId: 'usr-1',
    pengirimNama: 'Dr. Ir. Hendra Wijaya, M.M.',
    pengirimJabatan: 'Direktur Utama',
    tujuan: 'semua',
    tanggal: '2026-09-01',
    kategori: 'kebijakan',
    prioritas: 'penting',
    isiMemo: 'Mulai 1 September 2026, seluruh pengajuan formulir kantor, disposisi surat, persetujuan reimbursement, dan nota dinas WAJIB menggunakan platform VerraOffice. Pencetakan kertas fisik hanya diperbolehkan untuk dokumen eksternal yang diwajibkan regulasi hukum materiil.',
    lampiranName: 'Pedoman_Paperless_Policy_2026.pdf',
    dibacaOleh: [
      { userId: 'usr-2', userName: 'Siti Rahmawati', waktu: '2026-09-01 09:10' },
      { userId: 'usr-3', userName: 'Dimas Pratama', waktu: '2026-09-01 09:25' },
      { userId: 'usr-4', userName: 'Anisa Putri', waktu: '2026-09-01 08:40' },
      { userId: 'usr-5', userName: 'Budi Santoso', waktu: '2026-09-01 09:00' },
      { userId: 'usr-6', userName: 'Rian Hidayat', waktu: '2026-09-01 10:15' }
    ]
  },
  {
    id: 'memo-002',
    nomorMemo: '008/MEMO-IT/IX/2026',
    judul: 'Jadwal Pemeliharaan Server Cloud & Peningkatan Fitur Keamanan',
    pengirimId: 'usr-5',
    pengirimNama: 'Budi Santoso, S.T.',
    pengirimJabatan: 'IT Lead',
    tujuan: 'semua',
    tanggal: '2026-09-02',
    kategori: 'pengumuman',
    prioritas: 'biasa',
    isiMemo: 'Akan dilakukan scheduled maintenance server pada hari Sabtu, 6 September 2026 pukul 22.00 - 02.00 WIB. Layanan aplikasi tetap aktif dengan mode failover read-only selama 15 menit proses migrasi data.',
    dibacaOleh: [
      { userId: 'usr-1', userName: 'Dr. Ir. Hendra Wijaya', waktu: '2026-09-02 08:30' },
      { userId: 'usr-4', userName: 'Anisa Putri', waktu: '2026-09-02 08:15' }
    ]
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-001',
    judul: 'Rapat Pleno Direksi & Evaluasi Target Q3',
    tanggal: '2026-09-02',
    waktuMulai: '10:00',
    waktuSelesai: '12:00',
    kategori: 'jadwal_pimpinan',
    lokasi: 'Ruang Rapat Utama Bimasena (Lt. 4)',
    tipeLokasi: 'ruang_rapat',
    peserta: ['Dr. Ir. Hendra Wijaya', 'Siti Rahmawati', 'Dimas Pratama', 'Budi Santoso', 'Anisa Putri'],
    penanggungJawab: 'Anisa Putri Maharani',
    departemen: 'Sekretariat & Tata Usaha',
    catatan: 'Membahas efisiensi anggaran dan capaian transformasi digital',
    linkMeeting: 'https://meet.verraoffice.id/direksi-q3'
  },
  {
    id: 'ev-002',
    judul: 'Kunjungan Tamu Delegasi PT Telkom Enterprise',
    tanggal: '2026-09-02',
    waktuMulai: '14:00',
    waktuSelesai: '15:30',
    kategori: 'kunjungan',
    lokasi: 'Ruang Rapat Eksekutif Merbabu (Lt. 3)',
    tipeLokasi: 'ruang_rapat',
    peserta: ['Budi Santoso', 'Dimas Pratama', 'Tim Telkom'],
    penanggungJawab: 'Budi Santoso',
    departemen: 'Teknologi Informasi (IT)',
    catatan: 'Presentasi detail implementasi fiber optic redundant line'
  },
  {
    id: 'ev-003',
    judul: 'Deadline Penyerahan Berkas SPPD & Laporan Realisasi Keuangan',
    tanggal: '2026-09-04',
    waktuMulai: '17:00',
    waktuSelesai: '17:30',
    kategori: 'deadline',
    lokasi: 'Portal VerraOffice Finance',
    tipeLokasi: 'ruang_rapat',
    peserta: ['Seluruh Kepala Bagian'],
    penanggungJawab: 'Dimas Pratama',
    departemen: 'Keuangan & Akuntansi'
  },
  {
    id: 'ev-004',
    judul: 'Rapat Koordinasi Kemenkeu RI (Hybrid)',
    tanggal: '2026-09-10',
    waktuMulai: '09:00',
    waktuSelesai: '12:00',
    kategori: 'rapat',
    lokasi: 'Gedung Djuanda I Kemenkeu & Zoom',
    tipeLokasi: 'zoom',
    peserta: ['Dr. Ir. Hendra Wijaya', 'Dimas Pratama'],
    penanggungJawab: 'Dr. Ir. Hendra Wijaya',
    departemen: 'Direksi & Manajemen',
    linkMeeting: 'https://kemenkeu.zoom.us/j/8899221100'
  }
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-001',
    judul: 'Tindak lanjuti disposisi audit OJK Q3 2026',
    deskripsi: 'Menyiapkan berkas sertifikasi data protection, diagram arsitektur cloud, dan log enkripsi berkas digital.',
    penanggungJawabId: 'usr-5',
    penanggungJawabNama: 'Budi Santoso',
    penanggungJawabAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    departemen: 'Teknologi Informasi (IT)',
    deadline: '2026-09-12',
    prioritas: 'sangat_segera',
    status: 'in_progress',
    subtasks: [
      { id: 'st-1', judul: 'Kompilasi log audit server 6 bulan terakhir', selesai: true },
      { id: 'st-2', judul: 'Review sertifikat ISO 27001', selesai: true },
      { id: 'st-3', judul: 'Simulasi failover server database', selesai: false },
      { id: 'st-4', judul: 'Susun laporan akhir kesiapan audit', selesai: false }
    ],
    tags: ['OJK', 'Security', 'Compliance'],
    lampiranCount: 3
  },
  {
    id: 'task-002',
    judul: 'Kompilasi bahan paparan koordinasi Kemenkeu',
    deskripsi: 'Menyiapkan slide presentasi capaian paperless, grafik efisiensi anggaran ATK, dan demo alur e-Sign.',
    penanggungJawabId: 'usr-3',
    penanggungJawabNama: 'Dimas Pratama',
    penanggungJawabAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    departemen: 'Keuangan & Akuntansi',
    deadline: '2026-09-08',
    prioritas: 'penting',
    status: 'in_progress',
    subtasks: [
      { id: 'st-21', judul: 'Rekap total rim kertas dihemat tahun 2026', selesai: true },
      { id: 'st-22', judul: 'Buat visualisasi grafik perbandingan biaya', selesai: false }
    ],
    tags: ['Kemenkeu', 'Presentation', 'Paperless'],
    lampiranCount: 1
  },
  {
    id: 'task-003',
    judul: 'Digitalisasi berkas arsip SK Kepegawaian 2020-2024',
    deskripsi: 'Pindai seluruh SK pengangkatan lama, beri tag dan klasifikasi akses di modul Dokumen & Arsip.',
    penanggungJawabId: 'usr-6',
    penanggungJawabNama: 'Rian Hidayat',
    penanggungJawabAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
    departemen: 'Operasional & Layanan',
    deadline: '2026-09-15',
    prioritas: 'biasa',
    status: 'todo',
    subtasks: [
      { id: 'st-31', judul: 'Scanning berkas arsip fisik', selesai: false },
      { id: 'st-32', judul: 'Input metadata nomor dokumen', selesai: false }
    ],
    tags: ['Arsip', 'HRD', 'Digitalisasi'],
    lampiranCount: 0
  },
  {
    id: 'task-004',
    judul: 'Verifikasi pengajuan formulir lembur bulan Agustus',
    deskripsi: 'Mencocokkan log presensi fingerprint digital dengan form lembur staf operasional.',
    penanggungJawabId: 'usr-2',
    penanggungJawabNama: 'Siti Rahmawati',
    penanggungJawabAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    departemen: 'Human Resources (SDM)',
    deadline: '2026-09-03',
    prioritas: 'penting',
    status: 'review',
    subtasks: [
      { id: 'st-41', judul: 'Unduh rekap presensi tim operasional', selesai: true },
      { id: 'st-42', judul: 'Validasi paraf atasan langsung', selesai: true }
    ],
    tags: ['Payroll', 'Lembur', 'HR'],
    lampiranCount: 2
  },
  {
    id: 'task-005',
    judul: 'Penerbitan Surat Keputusan Penunjukan Tim Taskforce E-Office',
    deskripsi: 'Menyusun SK Direksi perihal pembentukan tim percepatan transformasi digital.',
    penanggungJawabId: 'usr-4',
    penanggungJawabNama: 'Anisa Putri Maharani',
    penanggungJawabAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
    departemen: 'Sekretariat & Tata Usaha',
    deadline: '2026-08-30',
    prioritas: 'penting',
    status: 'completed',
    subtasks: [
      { id: 'st-51', judul: 'Draf SK', selesai: true },
      { id: 'st-52', judul: 'E-Sign Direktur Utama', selesai: true }
    ],
    tags: ['SK', 'Direksi'],
    lampiranCount: 1
  }
];

export const INITIAL_ASSETS: AssetInventory[] = [
  {
    id: 'ast-001',
    kodeAset: 'AST-IT-2026-0012',
    namaAset: 'Laptop Apple MacBook Pro 14" M3 Pro 18GB/512GB',
    kategori: 'elektronik',
    lokasi: 'Ruang Pimpinan Lt. 4',
    kondisi: 'baik',
    penanggungJawab: 'Dr. Ir. Hendra Wijaya, M.M.',
    departemen: 'Direksi & Manajemen',
    tanggalPengadaan: '2026-01-10',
    nilaiAset: 32000000,
    status: 'dipinjam',
    peminjamSaatIni: {
      nama: 'Dr. Ir. Hendra Wijaya',
      keperluan: 'Perangkat kerja operasional Direktur Utama',
      sejak: '2026-01-10',
      sampai: '2027-01-10'
    },
    riwayatPeminjaman: [
      { peminjam: 'Dr. Ir. Hendra Wijaya', tanggalPinjam: '2026-01-10', tanggalKembali: '-', kondisiKembali: 'Dalam Penggunaan Aktif' }
    ]
  },
  {
    id: 'ast-002',
    kodeAset: 'AST-KND-2025-0004',
    namaAset: 'Mobil Dinas Toyota Innova Zenix Hybrid V 2025 (B 1892 VER)',
    kategori: 'kendaraan',
    lokasi: 'Parkir VIP Basemen 1',
    kondisi: 'baik',
    penanggungJawab: 'Ahmad Fadilah (Kabag Operasional)',
    departemen: 'Operasional & Layanan',
    tanggalPengadaan: '2025-06-15',
    nilaiAset: 495000000,
    status: 'tersedia',
    riwayatPeminjaman: [
      { peminjam: 'Dimas Pratama', tanggalPinjam: '2026-08-20', tanggalKembali: '2026-08-20', kondisiKembali: 'Baik & Bersih' }
    ]
  },
  {
    id: 'ast-003',
    kodeAset: 'AST-IT-2025-0048',
    namaAset: 'Proyektor Laser Epson EB-L210SW Wireless 4000 Lumens',
    kategori: 'elektronik',
    lokasi: 'Ruang Rapat Bimasena Lt. 4',
    kondisi: 'baik',
    penanggungJawab: 'Budi Santoso',
    departemen: 'Teknologi Informasi (IT)',
    tanggalPengadaan: '2025-03-20',
    nilaiAset: 24500000,
    status: 'tersedia',
    riwayatPeminjaman: [
      { peminjam: 'Siti Rahmawati', tanggalPinjam: '2026-08-15', tanggalKembali: '2026-08-15', kondisiKembali: 'Baik' }
    ]
  },
  {
    id: 'ast-004',
    kodeAset: 'AST-FRN-2024-0022',
    namaAset: 'Meja Rapat Konferensi Kayu Jati Solid Oval 16 Seats',
    kategori: 'furniture',
    lokasi: 'Ruang Rapat Utama Lt. 4',
    kondisi: 'baik',
    penanggungJawab: 'Anisa Putri Maharani',
    departemen: 'Sekretariat & Tata Usaha',
    tanggalPengadaan: '2024-02-10',
    nilaiAset: 38000000,
    status: 'tersedia',
    riwayatPeminjaman: []
  },
  {
    id: 'ast-005',
    kodeAset: 'AST-EQP-2025-0019',
    namaAset: 'Mesin Shredder & Scanner High-Speed Fujitsu fi-8170',
    kategori: 'peralatan',
    lokasi: 'Ruang Arsip Digital Lt. 3',
    kondisi: 'butuh_perbaikan',
    penanggungJawab: 'Rian Hidayat',
    departemen: 'Operasional & Layanan',
    tanggalPengadaan: '2025-05-18',
    nilaiAset: 18500000,
    status: 'maintenance',
    riwayatPeminjaman: []
  }
];

export const INITIAL_GUEST_BOOK: GuestBookEntry[] = [
  {
    id: 'gst-001',
    namaTamu: 'Ir. Faisal Rahman, M.T.',
    instansi: 'PT Telkom Indonesia (Persero) Tbk',
    kontak: '0812-9988-7766',
    keperluan: 'Presentasi Teknis Upgrade Jaringan Dedicated Leased Line 1Gbps',
    orangDituju: 'Budi Santoso, S.T. (IT Lead)',
    departemenDituju: 'Teknologi Informasi (IT)',
    waktuDatang: '2026-09-02 13:45',
    status: 'sedang_bertemu',
    nomorBadge: 'VISITOR-042',
    catatan: 'Pertemuan di Ruang Rapat Lt. 3'
  },
  {
    id: 'gst-002',
    namaTamu: 'Dewi Kartika, S.E.',
    instansi: 'Kantor Akuntan Publik (KAP) Tanubrata & Rekan',
    kontak: '0813-1122-3344',
    keperluan: 'Konfirmasi Klarifikasi Dokumen Audit Pajak Badan 2026',
    orangDituju: 'Dimas Pratama, S.E. (Kabag Keuangan)',
    departemenDituju: 'Keuangan & Akuntansi',
    waktuDatang: '2026-09-02 09:15',
    waktuKeluar: '2026-09-02 11:30',
    status: 'selesai',
    nomorBadge: 'VISITOR-028',
    catatan: 'Selesai menyerahkan berita acara klarifikasi'
  },
  {
    id: 'gst-003',
    namaTamu: 'Agus Setiawan',
    instansi: 'PT Pos Logistik Indonesia',
    kontak: '0856-4433-2211',
    keperluan: 'Pengantaran Berkas Fisik Bersegel Dokumen Kontrak Kerjasama',
    orangDituju: 'Anisa Putri Maharani (Sekretaris)',
    departemenDituju: 'Sekretariat & Tata Usaha',
    waktuDatang: '2026-09-02 14:10',
    status: 'menunggu',
    nomorBadge: 'VISITOR-049',
    catatan: 'Menunggu di Lobby Resepsionis Lt. 1'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    tipe: 'surat',
    judul: 'Surat Masuk Baru',
    pesan: 'Surat masuk dari OJK No. B-1422/OJK.03/2026 perihal Audit Kepatuhan telah didisposisikan kepada Anda.',
    waktu: '10 menit yang lalu',
    dibaca: false,
    linkTab: 'disposisi',
    targetId: 'disp-002'
  },
  {
    id: 'notif-2',
    tipe: 'approval',
    judul: 'Permintaan Approval Menunggu',
    pesan: 'Form SPPD Perjalanan Dinas dari Budi Santoso (Rp 4.800.000) memerlukan persetujuan Direksi.',
    waktu: '35 menit yang lalu',
    dibaca: false,
    linkTab: 'approval',
    targetId: 'form-sub-002'
  },
  {
    id: 'notif-3',
    tipe: 'tamu',
    judul: 'Tamu Telah Tiba di Lobby',
    pesan: 'Ir. Faisal Rahman dari PT Telkom Indonesia telah check-in untuk menemui Budi Santoso.',
    waktu: '1 jam yang lalu',
    dibaca: true,
    linkTab: 'buku_tamu',
    targetId: 'gst-001'
  },
  {
    id: 'notif-4',
    tipe: 'tugas',
    judul: 'Pengingat Deadline Tugas',
    pesan: 'Tugas "Kompilasi bahan paparan Kemenkeu" jatuh tempo dalam 6 hari.',
    waktu: '3 jam yang lalu',
    dibaca: true,
    linkTab: 'tugas',
    targetId: 'task-002'
  }
];
