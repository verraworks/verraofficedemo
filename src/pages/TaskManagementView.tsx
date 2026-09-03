import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  List,
  LayoutGrid,
  ChevronRight,
  ChevronLeft,
  Check
} from 'lucide-react';
import { useOffice } from '../context/OfficeContext';
import { TaskItem, PriorityLevel } from '../types';
import { PriorityBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const TaskManagementView: React.FC = () => {
  const {
    tasks,
    addTask,
    updateTaskStatus,
    toggleSubtask,
    deleteTask,
    users,
    departments
  } = useOffice();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Form State
  const [formJudul, setFormJudul] = useState('');
  const [formDeskripsi, setFormDeskripsi] = useState('');
  const [formTargetUser, setFormTargetUser] = useState(users[0]?.id || '');
  const [formPrioritas, setFormPrioritas] = useState<PriorityLevel>('penting');
  const [formDeadline, setFormDeadline] = useState(new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10));
  const [formTags, setFormTags] = useState('Administrasi, Operasional');
  const [formSubtasksInput, setFormSubtasksInput] = useState('Pemeriksaan berkas\nKoordinasi unit terkait\nFinalisasi dokumen');

  const filteredTasks = tasks.filter(t => 
    t.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.penanggungJawabNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns: { id: 'todo' | 'in_progress' | 'review' | 'completed'; label: string; color: string }[] = [
    { id: 'todo', label: 'Belum Dimulai (To Do)', color: 'border-t-slate-400' },
    { id: 'in_progress', label: 'Sedang Dikerjakan', color: 'border-t-blue-500' },
    { id: 'review', label: 'Dalam Review / Verifikasi', color: 'border-t-amber-500' },
    { id: 'completed', label: 'Selesai (Done)', color: 'border-t-emerald-500' }
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul) return;

    const assignedUser = users.find(u => u.id === formTargetUser) || users[0];
    const subtaskList = formSubtasksInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      .map((text, idx) => ({
        id: `st-${Date.now()}-${idx}`,
        judul: text,
        selesai: false
      }));

    addTask({
      judul: formJudul,
      deskripsi: formDeskripsi || 'Instruksi tugas administrasi perkantoran terpadu.',
      penanggungJawabId: assignedUser.id,
      penanggungJawabNama: assignedUser.name,
      penanggungJawabAvatar: assignedUser.avatar,
      departemen: assignedUser.department,
      prioritas: formPrioritas,
      status: 'todo',
      deadline: formDeadline,
      subtasks: subtaskList,
      tags: formTags.split(',').map(t => t.trim()).filter(Boolean),
      lampiranCount: 1
    });

    setIsNewModalOpen(false);
    setFormJudul('');
    setFormDeskripsi('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-blue-600" />
            Manajemen Tugas & Kolaborasi Kantor (Kanban)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pelacakan progres pekerjaan, delegasi tugas staf, pembagian subtask, dan monitoring deadline proyek.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'kanban' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            id="btn-add-task"
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tambah Tugas Baru
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
            placeholder="Cari tugas, penanggung jawab, tag..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {viewMode === 'kanban' ? (
        /* Kanban 4 Columns */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const columnTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div
                key={col.id}
                className={`bg-slate-100/70 rounded-2xl p-4 border border-slate-200/80 border-t-4 ${col.color} space-y-3 min-h-[500px] flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 mb-3">
                    <h3 className="text-xs font-bold text-slate-800">{col.label}</h3>
                    <span className="text-[11px] font-extrabold bg-white text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                      {columnTasks.length}
                    </span>
                  </div>

                  {/* Cards inside column */}
                  <div className="space-y-3">
                    {columnTasks.length === 0 ? (
                      <p className="text-center py-8 text-[11px] text-slate-400 font-medium">
                        Tidak ada tugas.
                      </p>
                    ) : (
                      columnTasks.map((t) => {
                        const completedSubtasks = t.subtasks.filter(st => st.selesai).length;
                        return (
                          <div
                            key={t.id}
                            className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs hover:shadow-md transition-all space-y-3"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-bold text-slate-900 text-xs leading-snug">{t.judul}</h4>
                              <PriorityBadge priority={t.prioritas} />
                            </div>

                            <p className="text-[11px] text-slate-500 line-clamp-2">{t.deskripsi}</p>

                            {/* Subtasks checklist */}
                            {t.subtasks.length > 0 && (
                              <div className="space-y-1.5 pt-1 border-t border-slate-100">
                                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                  <span>Subtasks</span>
                                  <span>{completedSubtasks}/{t.subtasks.length}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-blue-600 h-full rounded-full transition-all"
                                    style={{ width: `${(completedSubtasks / t.subtasks.length) * 100}%` }}
                                  />
                                </div>
                                <div className="space-y-1 pt-1">
                                  {t.subtasks.map((st) => (
                                    <div
                                      key={st.id}
                                      onClick={() => toggleSubtask(t.id, st.id)}
                                      className="flex items-center gap-1.5 text-[11px] text-slate-700 cursor-pointer hover:text-blue-600"
                                    >
                                      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${st.selesai ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'}`}>
                                        {st.selesai && <Check className="w-2.5 h-2.5" />}
                                      </div>
                                      <span className={st.selesai ? 'line-through text-slate-400' : ''}>{st.judul}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Footer info & quick column transitions */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                              <span className="font-semibold text-slate-700">{t.penanggungJawabNama.split(' ')[0]}</span>
                              <span className="flex items-center gap-1 text-[10px]">
                                <Clock className="w-3 h-3 text-slate-400" /> {t.deadline}
                              </span>
                            </div>

                            {/* Status Change Buttons */}
                            <div className="flex items-center justify-between gap-1 pt-1">
                              {col.id !== 'todo' && (
                                <button
                                  onClick={() => {
                                    const prevStatus = col.id === 'completed' ? 'review' : col.id === 'review' ? 'in_progress' : 'todo';
                                    updateTaskStatus(t.id, prevStatus);
                                  }}
                                  className="text-[10px] text-slate-500 hover:text-slate-800 font-semibold p-1 hover:bg-slate-100 rounded flex items-center gap-0.5 cursor-pointer"
                                >
                                  <ChevronLeft className="w-3 h-3" /> Mundur
                                </button>
                              )}
                              <div className="flex-1" />
                              {col.id !== 'completed' && (
                                <button
                                  onClick={() => {
                                    const nextStatus = col.id === 'todo' ? 'in_progress' : col.id === 'in_progress' ? 'review' : 'completed';
                                    updateTaskStatus(t.id, nextStatus);
                                  }}
                                  className="text-[10px] text-blue-600 hover:text-blue-800 font-bold p-1 hover:bg-blue-50 rounded flex items-center gap-0.5 cursor-pointer"
                                >
                                  Maju <ChevronRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setIsNewModalOpen(true)}
                  className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-[11px] font-bold text-slate-600 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Item
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Tugas & Rincian</th>
                  <th className="py-3.5 px-4">Penanggung Jawab</th>
                  <th className="py-3.5 px-4">Prioritas</th>
                  <th className="py-3.5 px-4">Deadline</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 align-top">
                      <p className="font-bold text-slate-900">{t.judul}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{t.deskripsi}</p>
                    </td>
                    <td className="py-3.5 px-4 align-top font-semibold text-slate-800">
                      {t.penanggungJawabNama}
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <PriorityBadge priority={t.prioritas} />
                    </td>
                    <td className="py-3.5 px-4 align-top font-mono text-slate-600">
                      {t.deadline}
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <span className="font-bold text-xs uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 align-top text-right">
                      <button
                        onClick={() => {
                          if (confirm('Hapus tugas ini?')) deleteTask(t.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Tambah Tugas Baru */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Tambah Tugas & Delegasi Pekerjaan Baru"
        subtitle="Tetapkan penanggung jawab, tenggat waktu, dan checklist subtasks"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateTask} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Judul Pekerjaan / Tugas *</label>
            <input
              type="text"
              required
              value={formJudul}
              onChange={(e) => setFormJudul(e.target.value)}
              placeholder="Contoh: Penyusunan Dokumen Evaluasi Kinerja Semester I 2026"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Penanggung Jawab (PIC)</label>
              <select
                value={formTargetUser}
                onChange={(e) => setFormTargetUser(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.roleLabel})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tingkat Prioritas</label>
              <select
                value={formPrioritas}
                onChange={(e) => setFormPrioritas(e.target.value as PriorityLevel)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500"
              >
                <option value="biasa">Biasa</option>
                <option value="penting">Penting</option>
                <option value="sangat_segera">Sangat Segera (Urgent)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tenggat Waktu (Deadline)</label>
              <input
                type="date"
                value={formDeadline}
                onChange={(e) => setFormDeadline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Checklist Subtasks (1 baris per subtask)</label>
            <textarea
              rows={3}
              value={formSubtasksInput}
              onChange={(e) => setFormSubtasksInput(e.target.value)}
              placeholder="Tahap 1: Pengumpulan data&#10;Tahap 2: Pembahasan draft&#10;Tahap 3: Laporan akhir"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Uraian / Deskripsi Tugas</label>
            <textarea
              rows={3}
              value={formDeskripsi}
              onChange={(e) => setFormDeskripsi(e.target.value)}
              placeholder="Petunjuk detail pengerjaan..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none resize-none"
            />
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
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs"
            >
              Simpan Tugas
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
