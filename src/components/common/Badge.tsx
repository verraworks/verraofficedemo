import React from 'react';
import { PriorityLevel, SuratStatus, SuratKeluarStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = ''
}) => {
  const variantStyles = {
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: PriorityLevel }> = ({ priority }) => {
  switch (priority) {
    case 'sangat_segera':
      return <Badge variant="danger">⚡ Sangat Segera</Badge>;
    case 'penting':
      return <Badge variant="warning">⚠️ Penting</Badge>;
    case 'rahasia':
      return <Badge variant="purple">🔒 Rahasia</Badge>;
    case 'biasa':
    default:
      return <Badge variant="neutral">Biasa</Badge>;
  }
};

export const SuratStatusBadge: React.FC<{ status: SuratStatus | SuratKeluarStatus }> = ({ status }) => {
  switch (status) {
    case 'baru':
      return <Badge variant="primary">Surat Baru</Badge>;
    case 'disposisi':
      return <Badge variant="warning">Didisposisikan</Badge>;
    case 'diproses':
      return <Badge variant="info">Sedang Diproses</Badge>;
    case 'selesai':
      return <Badge variant="success">Selesai</Badge>;
    case 'diarsipkan':
      return <Badge variant="neutral">Diarsipkan</Badge>;
    case 'draft':
      return <Badge variant="neutral">Draft Konsep</Badge>;
    case 'menunggu_approval':
      return <Badge variant="warning">Menunggu Approval</Badge>;
    case 'disetujui':
      return <Badge variant="info">Disetujui</Badge>;
    case 'ditandatangani':
      return <Badge variant="purple">Ditandatangani Digital</Badge>;
    case 'terkirim':
      return <Badge variant="success">Terkirim</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};

export const FormStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'pending':
      return <Badge variant="warning">⏳ Menunggu Persetujuan</Badge>;
    case 'approved':
      return <Badge variant="success">✓ Disetujui</Badge>;
    case 'rejected':
      return <Badge variant="danger">✕ Ditolak</Badge>;
    case 'revision_requested':
      return <Badge variant="purple">✏️ Perlu Revisi</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};
