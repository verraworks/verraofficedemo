import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  UserRole,
  SuratMasuk,
  SuratKeluar,
  DisposisiItem,
  DokumenArsip,
  FormSubmission,
  FormType,
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
import {
  INITIAL_USERS,
  INITIAL_DEPARTMENTS,
  INITIAL_SETTINGS,
  INITIAL_SURAT_MASUK,
  INITIAL_SURAT_KELUAR,
  INITIAL_DISPOSISI,
  INITIAL_DOKUMEN_ARSIP,
  INITIAL_FORM_SUBMISSIONS,
  INITIAL_E_SIGNATURES,
  INITIAL_MEMOS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_TASKS,
  INITIAL_ASSETS,
  INITIAL_GUEST_BOOK,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';

interface PaperlessStats {
  kertasDihematLembar: number;
  rimKertasDihemat: number;
  biayaPercetakanDihemat: number; // in IDR
  pohonTerselamatkan: number;
  emisiKarbonKg: number;
  jamKerjaDihemat: number;
}

interface OfficeContextType {
  currentUser: User | null;
  users: User[];
  departments: Department[];
  settings: OfficeSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Auth & Switcher
  switchUser: (userId: string) => void;
  login: (email: string) => boolean;
  logout: () => void;
  updateCurrentUserProfile: (data: Partial<User>) => void;

  // Surat Masuk
  suratMasuk: SuratMasuk[];
  addSuratMasuk: (surat: Omit<SuratMasuk, 'id' | 'nomorAgenda' | 'disposisiCount' | 'riwayat'>) => SuratMasuk;
  updateSuratMasukStatus: (id: string, status: SuratMasuk['status']) => void;
  deleteSuratMasuk: (id: string) => void;

  // Surat Keluar
  suratKeluar: SuratKeluar[];
  addSuratKeluar: (surat: Omit<SuratKeluar, 'id' | 'nomorSurat' | 'approvalHistory'>) => SuratKeluar;
  approveSuratKeluar: (id: string, catatan?: string) => void;
  signSuratKeluar: (id: string, signatureId?: string) => void;
  deleteSuratKeluar: (id: string) => void;
  generateLetterNumber: (deptCode: string) => string;

  // Disposisi
  disposisi: DisposisiItem[];
  addDisposisi: (item: Omit<DisposisiItem, 'id' | 'tanggalDisposisi' | 'status'>) => DisposisiItem;
  updateDisposisiStatus: (id: string, status: DisposisiItem['status'], laporan?: string) => void;

  // Dokumen & Arsip
  dokumen: DokumenArsip[];
  addDokumen: (doc: Omit<DokumenArsip, 'id' | 'tanggalUnggah' | 'diunggahOleh' | 'versi' | 'riwayatVersi' | 'downloadCount'>) => DokumenArsip;
  deleteDokumen: (id: string) => void;
  incrementDownloadCount: (id: string) => void;

  // Formulir Digital
  formSubmissions: FormSubmission[];
  submitForm: (formType: FormType, title: string, data: Record<string, any>, biayaEstimasi?: number, prioritas?: FormSubmission['prioritas']) => FormSubmission;
  addFormSubmission: (submission: any) => FormSubmission;
  approveFormSubmission: (id: string, notes?: string) => void;
  rejectFormSubmission: (id: string, reason: string) => void;
  requestRevisionFormSubmission: (id: string, notes: string) => void;

  // E-Signatures
  eSignatures: ESignatureRecord[];
  createSignatureRecord: (docTitle: string, docNumber: string, signatureImageBase64?: string) => ESignatureRecord;
  verifyDocumentCertificate: (hashOrCert: string) => ESignatureRecord | null;

  // Memo Internal
  memos: MemoInternal[];
  addMemo: (memo: Omit<MemoInternal, 'id' | 'tanggal' | 'dibacaOleh'>) => MemoInternal;
  markMemoAsRead: (id: string) => void;

  // Agenda & Kalender
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => CalendarEvent;
  deleteEvent: (id: string) => void;

  // Tasks
  tasks: TaskItem[];
  addTask: (task: Omit<TaskItem, 'id'>) => TaskItem;
  updateTaskStatus: (id: string, status: TaskItem['status']) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteTask: (id: string) => void;

  // Asset Inventory
  assets: AssetInventory[];
  addAsset: (asset: Omit<AssetInventory, 'id' | 'riwayatPeminjaman'>) => AssetInventory;
  borrowAsset: (assetId: string, peminjam: string, keperluan: string, sampai: string) => void;
  returnAsset: (assetId: string, kondisi: 'baik' | 'butuh_perbaikan' | 'rusak') => void;

  // Guest Book
  guestBook: GuestBookEntry[];
  checkInGuest: (entry: Omit<GuestBookEntry, 'id' | 'waktuDatang' | 'status' | 'nomorBadge'>) => GuestBookEntry;
  checkOutGuest: (id: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'waktu' | 'dibaca'>) => void;

  // Settings
  updateSettings: (newSettings: Partial<OfficeSettings>) => void;

  // Search & Modals
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  previewItem: { type: 'surat_masuk' | 'surat_keluar' | 'disposisi' | 'dokumen' | 'form' | 'tamu'; data: any } | null;
  setPreviewItem: (item: { type: 'surat_masuk' | 'surat_keluar' | 'disposisi' | 'dokumen' | 'form' | 'tamu'; data: any } | null) => void;

  // Computed Impact
  paperlessStats: PaperlessStats;
  resetToSampleData: () => void;
}

const OfficeContext = createContext<OfficeContextType | undefined>(undefined);

function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(`verra_office_${key}`);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(`Error loading localStorage for ${key}`, e);
  }
  return defaultValue;
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`verra_office_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving localStorage for ${key}`, e);
  }
}

export const OfficeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(() => getStorage('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedId = localStorage.getItem('verra_office_current_user_id');
    return users.find(u => u.id === savedId) || users[0];
  });
  
  const [departments] = useState<Department[]>(() => getStorage('departments', INITIAL_DEPARTMENTS));
  const [settings, setSettings] = useState<OfficeSettings>(() => getStorage('settings', INITIAL_SETTINGS));
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewItem, setPreviewItem] = useState<{ type: any; data: any } | null>(null);

  // Entities
  const [suratMasuk, setSuratMasuk] = useState<SuratMasuk[]>(() => getStorage('surat_masuk', INITIAL_SURAT_MASUK));
  const [suratKeluar, setSuratKeluar] = useState<SuratKeluar[]>(() => getStorage('surat_keluar', INITIAL_SURAT_KELUAR));
  const [disposisi, setDisposisi] = useState<DisposisiItem[]>(() => getStorage('disposisi', INITIAL_DISPOSISI));
  const [dokumen, setDokumen] = useState<DokumenArsip[]>(() => getStorage('dokumen', INITIAL_DOKUMEN_ARSIP));
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>(() => getStorage('form_submissions', INITIAL_FORM_SUBMISSIONS));
  const [eSignatures, setESignatures] = useState<ESignatureRecord[]>(() => getStorage('e_signatures', INITIAL_E_SIGNATURES));
  const [memos, setMemos] = useState<MemoInternal[]>(() => getStorage('memos', INITIAL_MEMOS));
  const [events, setEvents] = useState<CalendarEvent[]>(() => getStorage('events', INITIAL_CALENDAR_EVENTS));
  const [tasks, setTasks] = useState<TaskItem[]>(() => getStorage('tasks', INITIAL_TASKS));
  const [assets, setAssets] = useState<AssetInventory[]>(() => getStorage('assets', INITIAL_ASSETS));
  const [guestBook, setGuestBook] = useState<GuestBookEntry[]>(() => getStorage('guest_book', INITIAL_GUEST_BOOK));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => getStorage('notifications', INITIAL_NOTIFICATIONS));

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('verra_office_current_user_id', currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => setStorage('settings', settings), [settings]);
  useEffect(() => setStorage('surat_masuk', suratMasuk), [suratMasuk]);
  useEffect(() => setStorage('surat_keluar', suratKeluar), [suratKeluar]);
  useEffect(() => setStorage('disposisi', disposisi), [disposisi]);
  useEffect(() => setStorage('dokumen', dokumen), [dokumen]);
  useEffect(() => setStorage('form_submissions', formSubmissions), [formSubmissions]);
  useEffect(() => setStorage('e_signatures', eSignatures), [eSignatures]);
  useEffect(() => setStorage('memos', memos), [memos]);
  useEffect(() => setStorage('events', events), [events]);
  useEffect(() => setStorage('tasks', tasks), [tasks]);
  useEffect(() => setStorage('assets', assets), [assets]);
  useEffect(() => setStorage('guest_book', guestBook), [guestBook]);
  useEffect(() => setStorage('notifications', notifications), [notifications]);

  // Auth
  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      addNotification({
        tipe: 'memo',
        judul: 'Beralih Akun',
        pesan: `Anda sekarang aktif sebagai ${target.name} (${target.roleLabel}).`
      });
    }
  };

  const login = (email: string): boolean => {
    const target = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (target) {
      setCurrentUser(target);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('verra_office_current_user_id');
  };

  const updateCurrentUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
  };

  // Helper Notifications
  const addNotification = (notif: Omit<NotificationItem, 'id' | 'waktu' | 'dibaca'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      waktu: 'Baru saja',
      dibaca: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, dibaca: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, dibaca: true })));
  };

  // Surat Masuk Handlers
  const addSuratMasuk = (suratData: Omit<SuratMasuk, 'id' | 'nomorAgenda' | 'disposisiCount' | 'riwayat'>): SuratMasuk => {
    const count = suratMasuk.length + 1;
    const now = new Date();
    const pad = String(count).padStart(3, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const agendaNo = `AG-SM-${now.getFullYear()}-${month}-${pad}`;
    
    const newSurat: SuratMasuk = {
      ...suratData,
      id: `sm-${Date.now()}`,
      nomorAgenda: agendaNo,
      disposisiCount: suratData.tujuanDisposisi.length > 0 ? 1 : 0,
      riwayat: [
        {
          tanggal: `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          oleh: currentUser?.name || 'Admin',
          aksi: 'Registrasi & Pengarsipan Digital Surat Masuk'
        }
      ]
    };

    setSuratMasuk(prev => [newSurat, ...prev]);
    
    // Auto add notification to leadership
    addNotification({
      tipe: 'surat',
      judul: 'Surat Masuk Baru Diterima',
      pesan: `Surat dari ${newSurat.asalSurat} perihal "${newSurat.perihal}" telah diarsipkan secara digital.`,
      linkTab: 'surat_masuk',
      targetId: newSurat.id
    });

    return newSurat;
  };

  const updateSuratMasukStatus = (id: string, status: SuratMasuk['status']) => {
    const now = new Date();
    const timeStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setSuratMasuk(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status,
          riwayat: [
            ...s.riwayat,
            {
              tanggal: timeStr,
              oleh: currentUser?.name || 'Pengguna',
              aksi: `Perubahan status menjadi "${status.toUpperCase()}"`
            }
          ]
        };
      }
      return s;
    }));
  };

  const deleteSuratMasuk = (id: string) => {
    setSuratMasuk(prev => prev.filter(s => s.id !== id));
  };

  // Surat Keluar Handlers
  const generateLetterNumber = (deptCode: string): string => {
    const count = suratKeluar.length + 1;
    const pad = String(count).padStart(3, '0');
    const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const curMonthRoman = romanMonths[new Date().getMonth()];
    const year = new Date().getFullYear();
    return `${pad}/${deptCode || 'DIR'}/VERRA/${curMonthRoman}/${year}`;
  };

  const addSuratKeluar = (suratData: Omit<SuratKeluar, 'id' | 'nomorSurat' | 'approvalHistory'>): SuratKeluar => {
    const deptObj = departments.find(d => d.nama === suratData.departemen);
    const deptCode = deptObj ? deptObj.kode : 'DIR';
    const nomor = generateLetterNumber(deptCode);
    const now = new Date();
    const timeStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newSurat: SuratKeluar = {
      ...suratData,
      id: `sk-${Date.now()}`,
      nomorSurat: nomor,
      approvalHistory: [
        {
          tahap: 'Konsep Draf',
          approver: currentUser?.name || suratData.pembuatNama,
          status: 'approved',
          tanggal: timeStr,
          catatan: 'Draf surat dibuat dalam sistem'
        },
        {
          tahap: 'Persetujuan Pimpinan',
          approver: suratData.penandatanganNama,
          status: 'pending'
        }
      ]
    };

    setSuratKeluar(prev => [newSurat, ...prev]);

    addNotification({
      tipe: 'approval',
      judul: 'Surat Keluar Butuh Persetujuan',
      pesan: `Surat No. ${nomor} kepada ${suratData.tujuanSurat} menunggu persetujuan dan e-signature pimpinan.`,
      linkTab: 'surat_keluar',
      targetId: newSurat.id
    });

    return newSurat;
  };

  const approveSuratKeluar = (id: string, catatan?: string) => {
    const now = new Date();
    const timeStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setSuratKeluar(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: 'disetujui',
          approvalHistory: s.approvalHistory.map(h => 
            h.status === 'pending' ? { ...h, status: 'approved', tanggal: timeStr, catatan: catatan || 'Disetujui oleh Pimpinan' } : h
          )
        };
      }
      return s;
    }));

    addNotification({
      tipe: 'surat',
      judul: 'Surat Keluar Telah Disetujui',
      pesan: `Surat telah disetujui oleh pimpinan dan siap ditandatangani secara digital.`,
      linkTab: 'surat_keluar',
      targetId: id
    });
  };

  const signSuratKeluar = (id: string, signatureId?: string) => {
    const now = new Date();
    const timeStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} WIB`;
    const sigCode = signatureId || `VERRA-ESIGN-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${Math.floor(10000 + Math.random() * 90000)}`;
    
    setSuratKeluar(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: 'ditandatangani',
          signatureStamp: {
            signedBy: currentUser?.name || 'Dr. Ir. Hendra Wijaya, M.M.',
            signedAt: timeStr,
            signatureId: sigCode,
            qrCodeUrl: `https://verraoffice.id/verify/${sigCode}`
          }
        };
      }
      return s;
    }));

    // Register to E-Signature Archive
    const target = suratKeluar.find(s => s.id === id);
    if (target) {
      createSignatureRecord(target.perihal, target.nomorSurat);
    }
  };

  const deleteSuratKeluar = (id: string) => {
    setSuratKeluar(prev => prev.filter(s => s.id !== id));
  };

  // Disposisi Handlers
  const addDisposisi = (item: Omit<DisposisiItem, 'id' | 'tanggalDisposisi' | 'status'>): DisposisiItem => {
    const now = new Date();
    const timeStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    const newDisp: DisposisiItem = {
      ...item,
      id: `disp-${Date.now()}`,
      tanggalDisposisi: timeStr,
      status: 'belum_dibuka'
    };

    setDisposisi(prev => [newDisp, ...prev]);

    // Update parent surat masuk disposisi count
    setSuratMasuk(prev => prev.map(s => s.id === item.suratMasukId ? { ...s, status: 'disposisi', disposisiCount: (s.disposisiCount || 0) + 1 } : s));

    addNotification({
      tipe: 'disposisi',
      judul: 'Disposisi Digital Baru Diterima',
      pesan: `Pimpinan mendisposisikan surat No. ${item.nomorSurat} kepada ${item.tujuanPegawaiNama}: "${item.instruksi.join(', ')}".`,
      linkTab: 'disposisi',
      targetId: newDisp.id
    });

    return newDisp;
  };

  const updateDisposisiStatus = (id: string, status: DisposisiItem['status'], laporan?: string) => {
    const now = new Date();
    const timeStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    setDisposisi(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          status,
          ...(laporan ? { laporanPenyelesaian: laporan } : {}),
          ...(status === 'selesai' ? { tanggalSelesai: timeStr } : {})
        };
      }
      return d;
    }));

    if (status === 'selesai') {
      addNotification({
        tipe: 'disposisi',
        judul: 'Disposisi Selesai Dikerjakan',
        pesan: `Disposisi tugas telah diselesaikan oleh staf pelaksana.`,
        linkTab: 'disposisi',
        targetId: id
      });
    }
  };

  // Dokumen & Arsip Handlers
  const addDokumen = (docData: Omit<DokumenArsip, 'id' | 'tanggalUnggah' | 'diunggahOleh' | 'versi' | 'riwayatVersi' | 'downloadCount'>): DokumenArsip => {
    const count = dokumen.length + 1;
    const now = new Date();
    const timeStr = now.toISOString().slice(0, 10);
    const newDoc: DokumenArsip = {
      ...docData,
      id: `doc-${Date.now()}`,
      nomorDokumen: `DOC-${docData.departemen.slice(0, 3).toUpperCase()}-${now.getFullYear()}-${String(count).padStart(3, '0')}`,
      tanggalUnggah: timeStr,
      diunggahOleh: currentUser?.name || 'Staf Arsip',
      versi: '1.0',
      downloadCount: 0,
      riwayatVersi: [
        {
          versi: '1.0',
          tanggal: timeStr,
          diubahOleh: currentUser?.name || 'Staf Arsip',
          catatan: 'Dokumen pertama diunggah ke arsip digital'
        }
      ]
    };

    setDokumen(prev => [newDoc, ...prev]);

    addNotification({
      tipe: 'memo',
      judul: 'Dokumen Digital Diarsipkan',
      pesan: `Dokumen "${newDoc.judul}" berhasil diarsipkan di folder ${newDoc.departemen}.`,
      linkTab: 'dokumen',
      targetId: newDoc.id
    });

    return newDoc;
  };

  const deleteDokumen = (id: string) => {
    setDokumen(prev => prev.filter(d => d.id !== id));
  };

  const incrementDownloadCount = (id: string) => {
    setDokumen(prev => prev.map(d => d.id === id ? { ...d, downloadCount: d.downloadCount + 1 } : d));
  };

  // Formulir Digital Handlers
  const submitForm = (
    formType: FormType, 
    title: string, 
    data: Record<string, any>, 
    biayaEstimasi?: number, 
    prioritas: FormSubmission['prioritas'] = 'biasa'
  ): FormSubmission => {
    const count = formSubmissions.length + 1;
    const now = new Date();
    const typePrefix = typeof formType === 'string' ? formType.split('_').map(w => w[0].toUpperCase()).join('') : 'FD';
    const formNo = `F${typePrefix}-${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(count).padStart(3, '0')}`;
    
    const approversList = [
      {
        level: 1,
        urutan: 1,
        role: 'Kepala Bagian / Atasan Langsung',
        userName: 'Siti Rahmawati / Dimas Pratama',
        pejabatNama: 'Siti Rahmawati / Dimas Pratama',
        status: 'pending' as const
      },
      {
        level: 2,
        urutan: 2,
        role: 'Direktur Utama',
        userName: 'Dr. Ir. Hendra Wijaya',
        pejabatNama: 'Dr. Ir. Hendra Wijaya',
        status: 'pending' as const
      }
    ];

    const newSubmission: FormSubmission = {
      id: `form-sub-${Date.now()}`,
      nomorPengajuan: formNo,
      formType,
      formTitle: title,
      pemohonId: currentUser?.id || 'usr-6',
      pemohonNama: currentUser?.name || 'Staf Kantor',
      pemohonJabatan: currentUser?.roleLabel || 'Pegawai',
      departemen: currentUser?.department || 'Operasional & Layanan',
      tanggalPengajuan: now.toISOString().slice(0, 10),
      status: 'pending',
      prioritas,
      data: data || {},
      formData: data || {},
      biayaEstimasi,
      approvers: approversList,
      tahapanApproval: approversList
    };

    setFormSubmissions(prev => [newSubmission, ...prev]);

    addNotification({
      tipe: 'approval',
      judul: 'Pengajuan Form Digital Baru',
      pesan: `Pengajuan ${title} (${formNo}) dari ${newSubmission.pemohonNama} menunggu persetujuan Anda.`,
      linkTab: 'approval',
      targetId: newSubmission.id
    });

    return newSubmission;
  };

  const addFormSubmission = (submission: any): FormSubmission => {
    const count = formSubmissions.length + 1;
    const now = new Date();
    const formType = submission.formType || submission.formId || 'permintaan_barang';
    const formNo = submission.nomorPengajuan || `FPD-${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(count).padStart(3, '0')}`;
    
    const inputData = submission.data || submission.formData || {};
    const rawApprovers = submission.approvers || submission.tahapanApproval || [
      {
        level: 1,
        urutan: 1,
        role: 'Kepala Unit / Departemen',
        userName: 'Siti Rahmawati, S.E.',
        pejabatNama: 'Siti Rahmawati, S.E.',
        status: 'pending' as const
      },
      {
        level: 2,
        urutan: 2,
        role: 'Pimpinan / Direktur Utama',
        userName: 'Dr. Ir. Hendra Wijaya, M.M.',
        pejabatNama: 'Dr. Ir. Hendra Wijaya, M.M.',
        status: 'pending' as const
      }
    ];

    const normalizedApprovers = rawApprovers.map((a: any, idx: number) => ({
      level: a.level || a.urutan || idx + 1,
      urutan: a.urutan || a.level || idx + 1,
      role: a.role || 'Pejabat Terkait',
      userName: a.userName || a.pejabatNama || 'Pejabat Berwenang',
      pejabatNama: a.pejabatNama || a.userName || 'Pejabat Berwenang',
      status: a.status || 'pending',
      notes: a.notes,
      reviewedAt: a.reviewedAt
    }));

    const newSubmission: FormSubmission = {
      id: submission.id || `form-sub-${Date.now()}`,
      nomorPengajuan: formNo,
      formType,
      formTitle: submission.formTitle || 'Pengajuan Formulir Digital',
      pemohonId: submission.pemohonId || currentUser?.id || 'usr-1',
      pemohonNama: submission.pemohonNama || currentUser?.name || 'Pegawai',
      pemohonJabatan: submission.pemohonJabatan || currentUser?.roleLabel || 'Pegawai',
      departemen: submission.departemen || currentUser?.department || 'Umum',
      tanggalPengajuan: submission.tanggalPengajuan || now.toISOString().slice(0, 10),
      status: submission.status || 'pending',
      prioritas: submission.prioritas || 'penting',
      biayaEstimasi: submission.biayaEstimasi,
      data: inputData,
      formData: inputData,
      approvers: normalizedApprovers,
      tahapanApproval: normalizedApprovers
    };

    setFormSubmissions(prev => [newSubmission, ...prev]);

    addNotification({
      tipe: 'approval',
      judul: 'Pengajuan Form Digital Baru',
      pesan: `Pengajuan ${newSubmission.formTitle} (${formNo}) menunggu persetujuan.`,
      linkTab: 'approval',
      targetId: newSubmission.id
    });

    return newSubmission;
  };

  const approveFormSubmission = (id: string, notes?: string) => {
    const now = new Date();
    const timeStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setFormSubmissions(prev => prev.map(f => {
      if (f.id === id) {
        const appList = f.approvers || f.tahapanApproval || [];
        const updatedApprovers = appList.map((app: any) => {
          if (app.status === 'pending') {
            return {
              ...app,
              status: 'approved' as const,
              reviewedAt: timeStr,
              notes: notes || 'Disetujui tanpa catatan perbaikan.',
              signatureUrl: currentUser?.signatureUrl
            };
          }
          return app;
        });

        const allApproved = updatedApprovers.every((a: any) => a.status === 'approved');

        return {
          ...f,
          status: allApproved ? 'approved' : 'pending',
          approvers: updatedApprovers,
          tahapanApproval: updatedApprovers,
          catatanPersetujuan: notes || f.catatanPersetujuan
        };
      }
      return f;
    }));

    addNotification({
      tipe: 'approval',
      judul: 'Pengajuan Telah Disetujui',
      pesan: `Pengajuan formulir telah disetujui oleh ${currentUser?.name}.`,
      linkTab: 'form_digital',
      targetId: id
    });
  };

  const rejectFormSubmission = (id: string, reason: string) => {
    const now = new Date();
    const timeStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setFormSubmissions(prev => prev.map(f => {
      if (f.id === id) {
        return {
          ...f,
          status: 'rejected',
          catatanPersetujuan: `Ditolak: ${reason}`,
          approvers: f.approvers.map(a => a.status === 'pending' ? { ...a, status: 'rejected', reviewedAt: timeStr, notes: reason } : a)
        };
      }
      return f;
    }));

    addNotification({
      tipe: 'approval',
      judul: 'Pengajuan Ditolak',
      pesan: `Pengajuan formulir Anda ditolak dengan alasan: "${reason}".`,
      linkTab: 'form_digital',
      targetId: id
    });
  };

  const requestRevisionFormSubmission = (id: string, notes: string) => {
    setFormSubmissions(prev => prev.map(f => {
      if (f.id === id) {
        return {
          ...f,
          status: 'revision_requested',
          catatanPersetujuan: `Permintaan Revisi: ${notes}`
        };
      }
      return f;
    }));

    addNotification({
      tipe: 'approval',
      judul: 'Permintaan Revisi Formulir',
      pesan: `Pengajuan memerlukan revisi: "${notes}". Silakan perbaiki dan ajukan ulang.`,
      linkTab: 'form_digital',
      targetId: id
    });
  };

  // E-Signatures Handlers
  const createSignatureRecord = (docTitle: string, docNumber: string, signatureImageBase64?: string): ESignatureRecord => {
    const now = new Date();
    const timeStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} WIB`;
    const randomHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const certNum = `CERT-VERRA-BSRE-${now.getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newSig: ESignatureRecord = {
      id: `sig-${Date.now()}`,
      documentTitle: docTitle,
      documentNumber: docNumber,
      signedBy: currentUser?.name || 'Pimpinan Berwenang',
      signerPosition: currentUser?.position || 'Direktur',
      signedAt: timeStr,
      hashSha256: randomHex,
      certificateNumber: certNum,
      status: 'valid',
      qrCodeUrl: `https://verraoffice.id/verify/${certNum}`,
      signatureImageBase64
    };

    setESignatures(prev => [newSig, ...prev]);
    return newSig;
  };

  const verifyDocumentCertificate = (hashOrCert: string): ESignatureRecord | null => {
    const clean = hashOrCert.trim().toLowerCase();
    return eSignatures.find(s => 
      s.certificateNumber.toLowerCase().includes(clean) || 
      s.hashSha256.toLowerCase().includes(clean) ||
      s.documentNumber.toLowerCase().includes(clean)
    ) || null;
  };

  // Memo Handlers
  const addMemo = (memoData: Omit<MemoInternal, 'id' | 'tanggal' | 'dibacaOleh'>): MemoInternal => {
    const count = memos.length + 1;
    const now = new Date();
    const memoNo = `${String(count).padStart(3, '0')}/MEMO-${currentUser?.department.slice(0, 3).toUpperCase() || 'DIR'}/${now.getFullYear()}`;

    const newMemo: MemoInternal = {
      ...memoData,
      id: `memo-${Date.now()}`,
      nomorMemo: memoNo,
      tanggal: now.toISOString().slice(0, 10),
      dibacaOleh: [
        {
          userId: currentUser?.id || 'usr-1',
          userName: currentUser?.name || 'Pimpinan',
          waktu: `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        }
      ]
    };

    setMemos(prev => [newMemo, ...prev]);

    addNotification({
      tipe: 'memo',
      judul: 'Memo Internal Baru Diterbitkan',
      pesan: `"${newMemo.judul}" telah diterbitkan oleh ${newMemo.pengirimNama}.`,
      linkTab: 'memo',
      targetId: newMemo.id
    });

    return newMemo;
  };

  const markMemoAsRead = (id: string) => {
    if (!currentUser) return;
    const now = new Date();
    const timeStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setMemos(prev => prev.map(m => {
      if (m.id === id) {
        if (!m.dibacaOleh.some(r => r.userId === currentUser.id)) {
          return {
            ...m,
            dibacaOleh: [...m.dibacaOleh, { userId: currentUser.id, userName: currentUser.name, waktu: timeStr }]
          };
        }
      }
      return m;
    }));
  };

  // Agenda Handlers
  const addEvent = (eventData: Omit<CalendarEvent, 'id'>): CalendarEvent => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `ev-${Date.now()}`
    };
    setEvents(prev => [...prev, newEvent]);

    addNotification({
      tipe: 'tugas',
      judul: 'Agenda Baru Ditambahkan',
      pesan: `Agenda "${newEvent.judul}" dijadwalkan pada ${newEvent.tanggal} pukul ${newEvent.waktuMulai}.`,
      linkTab: 'kalender',
      targetId: newEvent.id
    });

    return newEvent;
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // Task Handlers
  const addTask = (taskData: Omit<TaskItem, 'id'>): TaskItem => {
    const newTask: TaskItem = {
      ...taskData,
      id: `task-${Date.now()}`
    };
    setTasks(prev => [newTask, ...prev]);

    addNotification({
      tipe: 'tugas',
      judul: 'Tugas Baru Diberikan',
      pesan: `Tugas "${newTask.judul}" ditugaskan kepada ${newTask.penanggungJawabNama}.`,
      linkTab: 'tugas',
      targetId: newTask.id
    });

    return newTask;
  };

  const updateTaskStatus = (id: string, status: TaskItem['status']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: t.subtasks.map(st => st.id === subtaskId ? { ...st, selesai: !st.selesai } : st)
        };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Asset Inventory Handlers
  const addAsset = (assetData: Omit<AssetInventory, 'id' | 'riwayatPeminjaman'>): AssetInventory => {
    const newAsset: AssetInventory = {
      ...assetData,
      id: `ast-${Date.now()}`,
      riwayatPeminjaman: []
    };
    setAssets(prev => [newAsset, ...prev]);
    return newAsset;
  };

  const borrowAsset = (assetId: string, peminjam: string, keperluan: string, sampai: string) => {
    const now = new Date().toISOString().slice(0, 10);
    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        return {
          ...a,
          status: 'dipinjam',
          peminjamSaatIni: {
            nama: peminjam,
            keperluan,
            sejak: now,
            sampai
          },
          riwayatPeminjaman: [
            ...a.riwayatPeminjaman,
            { peminjam, tanggalPinjam: now, tanggalKembali: '-', kondisiKembali: 'Dalam Peminjaman' }
          ]
        };
      }
      return a;
    }));

    addNotification({
      tipe: 'memo',
      judul: 'Peminjaman Aset Tercatat',
      pesan: `Aset kantor telah dipinjam oleh ${peminjam} untuk keperluan: ${keperluan}.`,
      linkTab: 'inventaris',
      targetId: assetId
    });
  };

  const returnAsset = (assetId: string, kondisi: 'baik' | 'butuh_perbaikan' | 'rusak') => {
    const now = new Date().toISOString().slice(0, 10);
    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        const lastRiwayat = a.riwayatPeminjaman[a.riwayatPeminjaman.length - 1];
        const updatedRiwayat = lastRiwayat ? [
          ...a.riwayatPeminjaman.slice(0, -1),
          { ...lastRiwayat, tanggalKembali: now, kondisiKembali: `Kondisi: ${kondisi}` }
        ] : a.riwayatPeminjaman;

        return {
          ...a,
          status: kondisi === 'rusak' ? 'maintenance' : 'tersedia',
          kondisi,
          peminjamSaatIni: undefined,
          riwayatPeminjaman: updatedRiwayat
        };
      }
      return a;
    }));
  };

  // Guest Book Handlers
  const checkInGuest = (entry: Omit<GuestBookEntry, 'id' | 'waktuDatang' | 'status' | 'nomorBadge'>): GuestBookEntry => {
    const now = new Date();
    const timeStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const badgeNum = `VISITOR-${String(guestBook.length + 1).padStart(3, '0')}`;

    const newGuest: GuestBookEntry = {
      ...entry,
      id: `gst-${Date.now()}`,
      waktuDatang: timeStr,
      status: 'menunggu',
      nomorBadge: badgeNum
    };

    setGuestBook(prev => [newGuest, ...prev]);

    addNotification({
      tipe: 'tamu',
      judul: 'Tamu Tiba di Resepsionis',
      pesan: `${newGuest.namaTamu} (${newGuest.instansi}) telah tiba untuk bertemu dengan ${newGuest.orangDituju}.`,
      linkTab: 'buku_tamu',
      targetId: newGuest.id
    });

    return newGuest;
  };

  const checkOutGuest = (id: string) => {
    const now = new Date();
    const timeStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setGuestBook(prev => prev.map(g => g.id === id ? { ...g, status: 'selesai', waktuKeluar: timeStr } : g));
  };

  // Settings
  const updateSettings = (newSettings: Partial<OfficeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Reset to initial sample data
  const resetToSampleData = () => {
    localStorage.clear();
    setSuratMasuk(INITIAL_SURAT_MASUK);
    setSuratKeluar(INITIAL_SURAT_KELUAR);
    setDisposisi(INITIAL_DISPOSISI);
    setDokumen(INITIAL_DOKUMEN_ARSIP);
    setFormSubmissions(INITIAL_FORM_SUBMISSIONS);
    setESignatures(INITIAL_E_SIGNATURES);
    setMemos(INITIAL_MEMOS);
    setEvents(INITIAL_CALENDAR_EVENTS);
    setTasks(INITIAL_TASKS);
    setAssets(INITIAL_ASSETS);
    setGuestBook(INITIAL_GUEST_BOOK);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSettings(INITIAL_SETTINGS);
    setCurrentUser(INITIAL_USERS[0]);
  };

  // Paperless Impact Metrics Calculation
  // Total transactions that replaced paper:
  // - Every Surat Masuk scanned & archived = 4 sheets saved (surat + amplop + map arsip)
  // - Every Surat Keluar digital = 3 sheets saved (surat + arsip tembusan + amplop)
  // - Every Disposisi digital = 2 sheets saved (lembar disposisi kuning + fotokopi)
  // - Every Dokumen Arsip digital = 25 sheets average (bundel dokumen)
  // - Every Form Submission digital = 3 sheets saved (formulir + lampiran + tanda tangan fisik)
  // - Every E-Sign = 2 sheets saved
  // - Every Guest Book entry = 1 sheet saved
  const totalSheetsSaved = 
    (suratMasuk.length * 4) +
    (suratKeluar.length * 3) +
    (disposisi.length * 2) +
    (dokumen.length * 25) +
    (formSubmissions.length * 3) +
    (eSignatures.length * 2) +
    (guestBook.length * 1) + 420; // baseline past months

  const rimSaved = parseFloat((totalSheetsSaved / 500).toFixed(1));
  const printCostSaved = totalSheetsSaved * 850; // IDR 850 per sheet printed with toner & logistics
  const treesSaved = parseFloat((totalSheetsSaved / 8333).toFixed(2)); // ~8,333 sheets = 1 tree
  const co2SavedKg = parseFloat((totalSheetsSaved * 0.005).toFixed(1)); // ~5g CO2 per paper sheet lifecycle
  const hoursSaved = parseFloat((totalSheetsSaved * 0.08).toFixed(1)); // ~5 mins saved per manual search/delivery

  const paperlessStats: PaperlessStats = {
    kertasDihematLembar: totalSheetsSaved,
    rimKertasDihemat: rimSaved,
    biayaPercetakanDihemat: printCostSaved,
    pohonTerselamatkan: treesSaved,
    emisiKarbonKg: co2SavedKg,
    jamKerjaDihemat: hoursSaved
  };

  return (
    <OfficeContext.Provider
      value={{
        currentUser,
        users,
        departments,
        settings,
        activeTab,
        setActiveTab,
        switchUser,
        login,
        logout,
        updateCurrentUserProfile,
        suratMasuk,
        addSuratMasuk,
        updateSuratMasukStatus,
        deleteSuratMasuk,
        suratKeluar,
        addSuratKeluar,
        approveSuratKeluar,
        signSuratKeluar,
        deleteSuratKeluar,
        generateLetterNumber,
        disposisi,
        addDisposisi,
        updateDisposisiStatus,
        dokumen,
        addDokumen,
        deleteDokumen,
        incrementDownloadCount,
        formSubmissions,
        submitForm,
        addFormSubmission,
        approveFormSubmission,
        rejectFormSubmission,
        requestRevisionFormSubmission,
        eSignatures,
        createSignatureRecord,
        verifyDocumentCertificate,
        memos,
        addMemo,
        markMemoAsRead,
        events,
        addEvent,
        deleteEvent,
        tasks,
        addTask,
        updateTaskStatus,
        toggleSubtask,
        deleteTask,
        assets,
        addAsset,
        borrowAsset,
        returnAsset,
        guestBook,
        checkInGuest,
        checkOutGuest,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        updateSettings,
        searchQuery,
        setSearchQuery,
        previewItem,
        setPreviewItem,
        paperlessStats,
        resetToSampleData
      }}
    >
      {children}
    </OfficeContext.Provider>
  );
};

export const useOffice = () => {
  const context = useContext(OfficeContext);
  if (!context) {
    throw new Error('useOffice must be used within an OfficeProvider');
  }
  return context;
};
